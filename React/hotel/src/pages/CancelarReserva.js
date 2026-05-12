import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Reservas.css";
import { useUser } from "../UserContext";

function CancelarReserva() {
  const location = useLocation();
  const navigate = useNavigate();
  const reserva = location.state;
  const habitacion = reserva?.habitacion;

  const { user } = useUser();
  const tipo = user?.tipoUsuario || user?.tipo_usuario;

  if (!habitacion) return <h2>No se seleccionó ninguna habitación</h2>;

  const fechaInicio = new Date(reserva.fechaIngreso);
  const fechaFin = new Date(reserva.fechaSalida);

  const cancelarReserva = async () => {
    const hoy = new Date();
    const diferenciaDias = Math.ceil((fechaInicio - hoy) / (1000 * 60 * 60 * 24));

    let multa = 0;
    if (diferenciaDias <= 3) {
      multa = 80;
    } else if (diferenciaDias <= 14) {
      multa = 50;
    }

    let mensaje = "¿Estás seguro de cancelar esta reserva?";
    if (multa > 0) {
      mensaje = `La cancelación está muy cercana a la fecha de ingreso.\n` +
                `Se aplicará una penalización de $${multa}.\n` +
                `¿Deseas continuar con la cancelación?`;
    }

    const confirmado = window.confirm(mensaje);
    if (!confirmado) return;

    const idReserva = reserva.idReserva || reserva.id_reserva || reserva.id;

    try {
      // 🔹 Generar PDF con multa ANTES de borrar la reserva
      if (multa > 0) {
        const response = await axios.post(
          "http://localhost:8080/facturacion/pdf-cancelacion",
          { idReserva, multa },
          { responseType: "blob" }
        );

        // Descargar PDF
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `factura_cancelacion_${idReserva}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // 🔹 Ahora sí borrar la reserva
      await axios.delete(`http://localhost:8080/reservas/${idReserva}`);

      alert("Reserva cancelada con éxito");
      if (tipo === "Recepcionista") {
        navigate("/homeRecepcionista/mis-reservas");
      } else {
        navigate("/homeHuesped/mis-reservas");
      }
    } catch (err) {
      console.error("Error al cancelar:", err);
      alert("Error al cancelar la reserva");
    }
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
        <h1 className="titulo">Cancelar Reserva</h1>
        <div className="contenedor-reserva">
          {/* IZQUIERDA */}
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

          {/* DERECHA */}
          <div className="lado-derecho">
            <h2>Fechas de la reserva</h2>
            <DatePicker
              startDate={fechaInicio}
              endDate={fechaFin}
              selectsRange
              readOnly
              inline
            />
            <h3>Total: ${reserva.total}</h3>
            <button onClick={cancelarReserva} className="btn-cancelar">
              Cancelar Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelarReserva;
