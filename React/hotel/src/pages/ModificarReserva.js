import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Reservas.css";
import { useUser } from "../UserContext";

function ModificarReserva() {
  const location = useLocation();
  const navigate = useNavigate();
  const reserva = location.state;
  const habitacion = reserva?.habitacion;

  const [rangoFechas, setRangoFechas] = useState([
    new Date(reserva.fechaIngreso),
    new Date(reserva.fechaSalida),
  ]);
  const [fechaInicio, fechaFin] = rangoFechas;
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [total, setTotal] = useState(0);
  
    const { user } = useUser();
    const tipo = user?.tipoUsuario || user?.tipo_usuario;
  

  useEffect(() => {
    if (habitacion) {
      axios
        .get(`http://localhost:8080/reservas/fechas-ocupadas/${habitacion.idHabitacion}`)
        .then((res) => {
          const fechas = res.data
            .map((f) => new Date(f))
            .filter(
              (d) =>
                d.toDateString() !== new Date(reserva.fechaIngreso).toDateString() &&
                d.toDateString() !== new Date(reserva.fechaSalida).toDateString()
            );
          setFechasOcupadas(fechas);
        })
        .catch((err) => console.error(err));
    }
  }, [habitacion, reserva]);

  useEffect(() => {
    if (fechaInicio && fechaFin && habitacion) {
      const diffTime = Math.abs(fechaFin - fechaInicio);
      const dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotal(dias * habitacion.precioNoche);
    }
  }, [fechaInicio, fechaFin, habitacion]);

  if (!habitacion) return <h2>No se seleccionó ninguna habitación</h2>;

  const modificarReserva = () => {
    if (!fechaInicio || !fechaFin) {
      alert("Selecciona un rango de fechas");
      return;
    }

    const reservaModificada = {
      id: reserva.id,
      habitacion: habitacion, // mantenemos objeto completo
      fechaIngreso: fechaInicio,
      fechaSalida: fechaFin,
      total,
      usuario: reserva.usuario, // conservamos el usuario
    };

    axios
      .put(`http://localhost:8080/reservas/${reserva.id}`, reservaModificada)
      .then(() => {
        alert("Reserva modificada con éxito");
        if (tipo === "Recepcionista" ) {
                    
                    navigate("/homeRecepcionista/mis-reservas");
                  } else {
                    navigate("/homeHuesped/mis-reservas");
                  }
        
      })
      .catch((err) => console.error(err));
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
        <h1 className="titulo">Modificar Reserva</h1>
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
            <h2>Selecciona nuevas fechas</h2>
            <DatePicker
              selectsRange
              startDate={fechaInicio}
              endDate={fechaFin}
              onChange={(update) => setRangoFechas(update)}
              excludeDates={fechasOcupadas}
              dayClassName={(date) =>
                fechasOcupadas.some(
                  (d) => d.toDateString() === date.toDateString()
                )
                  ? "dia-ocupado"
                  : undefined
              }
              inline
            />
            <h3>Total: ${total}</h3>
            <button onClick={modificarReserva} className="btn-reservar">
              Modificar Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModificarReserva;