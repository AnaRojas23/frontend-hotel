import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ConsultarHabitaciones.css";
import { useUser } from "../UserContext";

function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();
  const tipo = user?.tipoUsuario || user?.tipo_usuario;
  const API_URL = process.env.REACT_APP_API_URL;
  const handleRedirect = (habitacion) => {
    if (tipo === "Huesped") {
      navigate("/homeHuesped/reservasHuesped", { state: habitacion });
    } else if (tipo === "Recepcionista") {
      navigate("/homeRecepcionista/reservasRecepcionista", { state: habitacion });
    } else {
      alert("Tipo de usuario no reconocido");
    }
  };

  useEffect(() => {
    axios.get("${API_URL}/habitaciones")
      .then(res => setHabitaciones(res.data))
      .catch(err => console.error("Error habitaciones:", err));

    axios.get("${API_URL}/reservas")
      .then(res => setReservas(res.data))
      .catch(err => console.error("Error reservas:", err));
  }, []);

  // 🔥 validar si está ocupada HOY
  const estaOcupadaHoy = (idHabitacion) => {
    const hoy = new Date();
    return reservas.some(r => {
      if (r.habitacion?.idHabitacion !== idHabitacion) return false;
      const inicio = new Date(r.fechaInicio);
      const fin = new Date(r.fechaFin);
      return hoy >= inicio && hoy <= fin;
    });
  };

  // 🔥 imagen
  const obtenerImagen = (tipo) => {
    if (tipo === "Simple") return "/simple.png";
    if (tipo === "Doble") return "/doble.png";
    if (tipo === "Suite") return "/suite.png";
    return "/default.jpg";
  };

  return (
    <div className="contenido">
      <h1>Habitaciones disponibles</h1>

      <div className="grid">
        {habitaciones.map(h => {
          const ocupada = estaOcupadaHoy(h.idHabitacion);

          // 🔹 Estado según lógica
          let estadoTexto = "Libre";
          if (ocupada) {
            estadoTexto = "Ocupado";
          } else if (h.estado === "Mantenimiento") {
            estadoTexto = "Mantenimiento";
          }

          return (
            <div className="card" key={h.idHabitacion}>
              <img
                src={obtenerImagen(h.tipoHabitacion)}
                alt="Habitación"
                className="img-habitacion"
              />

              <h3>Habitación {h.numHabitacion}</h3>
              <p><strong>Tipo:</strong> {h.tipoHabitacion}</p>
              <p><strong>Vista:</strong> {h.vista}</p>
              <p><strong>Capacidad:</strong> {h.capacidad}</p>
              <p className="precio">${h.precioNoche}</p>

              {/* 🔥 Estado */}
              <p className={`estado ${estadoTexto.toLowerCase()}`}>
                {estadoTexto}
              </p>

              {/* 🔹 Botón solo si NO es administrador */}
              {tipo !== "Administrador" && (
                <button onClick={() => handleRedirect(h)}>
                  Reservar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Habitaciones;
