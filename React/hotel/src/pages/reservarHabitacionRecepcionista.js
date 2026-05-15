import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Reservas.css";
import { useUser } from "../UserContext";

function ReservarHabitacionRecepcionista() {
  const location = useLocation();
  const navigate = useNavigate();
  const habitacion = location.state;
  const API_URL = process.env.REACT_APP_API_URL;
  const [rangoFechas, setRangoFechas] = useState([null, null]);
  const [fechaInicio, fechaFin] = rangoFechas;
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [total, setTotal] = useState(0);
  const [docHuesped, setDocHuesped] = useState(""); 

  const { user } = useUser(); 
  const tipo = user?.tipoUsuario || user?.tipo_usuario;

  useEffect(() => {
    if (habitacion) {
      axios
        .get(`${API_URL}/reservas/fechas-ocupadas/${habitacion.idHabitacion}`)
        .then((res) => {
          const fechas = res.data.map((f) => new Date(f));
          setFechasOcupadas(fechas);
        })
        .catch((err) => console.error("Error fechas ocupadas:", err));
    }
  }, [habitacion]);

  useEffect(() => {
    if (fechaInicio && fechaFin && habitacion) {
      const diffTime = Math.abs(fechaFin - fechaInicio);
      const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotal(dias * habitacion.precioNoche);
    }
  }, [fechaInicio, fechaFin, habitacion]);

  if (!habitacion) {
    return <h2>No se seleccionó ninguna habitación</h2>;
  }

  const reservar = async () => {
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    if (!fechaInicio || !fechaFin) {
      alert("Selecciona un rango de fechas");
      return;
    }

    let usuarioReserva = user; 

   
    if (tipo === "Recepcionista") {
      if (!docHuesped) {
        alert("Debes ingresar el documento del huésped");
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/usuarios/documento/${docHuesped}`);
        usuarioReserva = res.data; 
      } catch (err) {
        alert("No se encontró huésped con ese documento");
        return;
      }
    }

    const nuevaReserva = {
      habitacion: habitacion,
      usuario: usuarioReserva, 
      fechaIngreso: fechaInicio,
      fechaSalida: fechaFin,
      total: total,
    };

    axios
      .post('${API_URL}/reservas', nuevaReserva)
      .then(() => {
        alert("Reserva realizada con éxito");
        navigate("/homeRecepcionista/mis-reservas");
      })
      .catch((err) => {
        console.error("Error al reservar:", err);
        alert("Error al realizar la reserva");
      });
  };

  const obtenerImagen = (tipo) => {
    if (tipo === "Simple") return "/simple.png";
    if (tipo === "Doble") return "/doble.png";
    if (tipo === "Suite") return "/suite.png";
    return "/default.jpg";
  };

  return (
    <div className="contenido">
      <div className="reserva-card">
        <h1 className="titulo">Reservar Habitación</h1>

        <div className="contenedor-reserva">
          <div className="lado-izquierdo">
            <h2>Habitación {habitacion.numHabitacion}</h2>
            <img
              src={obtenerImagen(habitacion.tipoHabitacion)}
              alt="Habitación"
              className="img-pequena"
            />
            <div className="info">
              <p><strong>Tipo:</strong> {habitacion.tipoHabitacion}</p>
              <p><strong>Vista:</strong> {habitacion.vista}</p>
              <p><strong>Capacidad:</strong> {habitacion.capacidad}</p>
              <p><strong>Precio por noche:</strong> ${habitacion.precioNoche}</p>
            </div>
          </div>

          <div className="lado-derecho">
            {/* Campo extra solo para recepcionista */}
            {tipo === "Recepcionista" && (
              <div className="campo-documento">
                <label htmlFor="docHuesped"><strong>Documento del huésped:</strong></label>
                <input
                  id="docHuesped"
                  type="text"
                  placeholder="Ingresa el documento"
                  value={docHuesped}
                  onChange={(e) => setDocHuesped(e.target.value)}
                />
              </div>
            )}

            <h2>Selecciona fechas</h2>
            <DatePicker
                  selectsRange
                  startDate={fechaInicio}
                  endDate={fechaFin}
                  onChange={(update) => setRangoFechas(update)}
                  excludeDates={fechasOcupadas}
                  highlightDates={[{ "dia-ocupado": fechasOcupadas }]}
                  inline
                />



            <h3>Total: ${total}</h3>

            <button onClick={reservar} className="btn-reservar">
              Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservarHabitacionRecepcionista;
