import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Reservas.css";
import { useUser } from "../UserContext";

function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [docHuesped, setDocHuesped] = useState("");
  const [huesped, setHuesped] = useState(null);
  const navigate = useNavigate();
 const API_URL = process.env.REACT_APP_API_URL;
  const { user } = useUser();
  const tipo = user?.tipoUsuario || user?.tipo_usuario;

  useEffect(() => {
    if (!user) {
      alert("No hay usuario logueado");
      return;
    }

    if (tipo === "Huesped") {
      const usuarioId = user.id || user.idUsuario;
      axios
        .get(`http://localhost:8080/reservas/usuario/${usuarioId}`)
        .then((res) => setReservas(res.data))
        .catch((err) => {
          console.error("Error al obtener reservas:", err);
          alert("Error al obtener reservas, revisa la consola");
        });
    }
  }, [user, tipo]);

  const buscarReservasPorDocumento = async () => {
    if (!docHuesped) {
      alert("Debes ingresar el documento del huésped");
      return;
    }

    try {
      const resUsuario = await axios.get(`http://localhost:8080/usuarios/documento/${docHuesped}`);
      const huespedEncontrado = resUsuario.data;
      setHuesped(huespedEncontrado);

      const usuarioId = huespedEncontrado.id || huespedEncontrado.idUsuario;
      const resReservas = await axios.get(`http://localhost:8080/reservas/usuario/${usuarioId}`);
      setReservas(resReservas.data);
    } catch (err) {
      console.error("Error al buscar reservas:", err);
      alert("No se encontró huésped con ese documento o error al obtener reservas");
    }
  };

  const mostrarFecha = (fecha) => {
    if (!fecha) return "";
    if (typeof fecha === "string" && fecha.length === 10) {
      return fecha;
    }
    return new Date(fecha).toISOString().split("T")[0];
  };

  const obtenerImagen = (tipo) => {
    if (tipo === "Simple") return "/simple.png";
    if (tipo === "Doble") return "/doble.png";
    if (tipo === "Suite") return "/suite.png";
    return "/default.jpg";
  };

  return (
    <div className="contenido">
      <h1>Mis Reservas</h1>

      {tipo === "Recepcionista" && (
        <div className="campo-busqueda">
          <label htmlFor="docHuesped"><strong>Documento del huésped:</strong></label>
          <div className="fila-busqueda">
            <input
              id="docHuesped"
              type="text"
              placeholder="Ingresa el documento"
              value={docHuesped}
              onChange={(e) => setDocHuesped(e.target.value)}
              className="input-doc"
            />
            <button onClick={buscarReservasPorDocumento} className="btn-buscar">
              Buscar
            </button>
          </div>
        </div>
      )}

      {reservas.length === 0 ? (
        <p>No hay reservas para mostrar</p>
      ) : (
        <div className="grid">
          {reservas.map((r) => (
            <div className="card" key={r.id}>
              <h3>Habitación {r.habitacion?.numHabitacion || "Sin info"}</h3>
              <img
                src={obtenerImagen(r.habitacion?.tipoHabitacion)}
                alt="Habitación"
                className="img-habitacion"
              />
              <p><strong>Fecha inicio:</strong> {mostrarFecha(r.fechaIngreso)}</p>
              <p><strong>Fecha fin:</strong> {mostrarFecha(r.fechaSalida)}</p>
              <p><strong>Estado:</strong> {r.estado}</p>

              {(r.estado === "Finalizado" || r.estado === "En curso") ? (
                <p className="estado-finalizado">No disponible</p>
              ) : (
                <>
                  <button
                    className="btn-modificar"
                    onClick={() => {
                      if (tipo === "Recepcionista" && huesped) {
                        const reservaConHuesped = { ...r, usuario: huesped };
                        navigate("/homeRecepcionista/modificar-reserva", { state: reservaConHuesped });
                      } else {
                        navigate("/homeHuesped/modificar-reserva", { state: r });
                      }
                    }}
                  >
                    Modificar
                  </button>

                  <button
                    className="btn-cancelar"
                    onClick={() => {
                      if (tipo === "Recepcionista" && huesped) {
                        const reservaConHuesped = { ...r, usuario: huesped };
                        navigate("/homeRecepcionista/cancelar-reserva", { state: reservaConHuesped });
                      } else {
                        navigate("/homeHuesped/cancelar-reserva", { state: r });
                      }
                    }}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisReservas;
