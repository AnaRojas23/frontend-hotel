import { useEffect, useState } from "react";
import axios from "axios";
import "./Reservas.css";
import { useUser } from "../UserContext";

function ReservasCheck() {
  const [reservas, setReservas] = useState([]);
  const [docHuesped, setDocHuesped] = useState(""); 
  const [ huesped, setHuesped] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const { user } = useUser();
  const tipo = user?.tipoUsuario || user?.tipo_usuario;

  useEffect(() => {
    if (!user) {
      alert("No hay usuario logueado");
      return;
    }
  }, [user, tipo]); 
   
  // Buscar reservas de huésped por documento (solo recepcionista)
  const buscarReservasPorDocumento = async () => {
    if (!docHuesped) {
      alert("Debes ingresar el documento del huésped");
      return;
    }

    try {
      const resUsuario = await axios.get(`${API_URL}/usuarios/documento/${docHuesped}`);
      const huespedEncontrado = resUsuario.data;
      setHuesped(huespedEncontrado);

      const usuarioId = huespedEncontrado.id || huespedEncontrado.idUsuario;
      const resReservas = await axios.get(`${API_URL}/reservas/usuario/${usuarioId}`);
      const reservasConEstado = resReservas.data.map(r => ({
        ...r,
        estado: r.estado || "Pendiente",
        metodoPago: "" // 👈 nuevo campo en frontend
      }));
      setReservas(reservasConEstado);
    } catch (err) {
      console.error("Error al buscar reservas:", err);
      alert("No se encontró huésped con ese documento o error al obtener reservas");
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-CO");
  };

  const obtenerImagen = (tipo) => {
    if (tipo === "Simple") return "/simple.png";
    if (tipo === "Doble") return "/doble.png";
    if (tipo === "Suite") return "/suite.png";
    return "/default.jpg";
  };

  return (
    <div className="contenido">
      <h1>Reservas</h1>

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
          {reservas.map((r, index) => (
            <div className="card" key={r.id}>
              <h3>Habitación {r.habitacion?.numHabitacion || "Sin info"}</h3>
              <img
                src={obtenerImagen(r.habitacion?.tipoHabitacion)}
                alt="Habitación"
                className="img-habitacion"
              />
              <p><strong>Fecha inicio:</strong> {formatearFecha(r.fechaIngreso)}</p>
              <p><strong>Fecha fin:</strong> {formatearFecha(r.fechaSalida)}</p>

              {/* 👇 Estado dinámico */}
              <p><strong>Estado:</strong> {r.estado}</p>

              {/* 🔹 Selector de método de pago */}
              <div className="campo-metodo">
                <label><strong>Método de pago:</strong></label>
                <select
                  value={r.metodoPago}
                  onChange={(e) => {
                    const nuevasReservas = [...reservas];
                    nuevasReservas[index].metodoPago = e.target.value;
                    setReservas(nuevasReservas);
                  }}
                >
                  <option value="">Seleccione...</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta Débito">Tarjeta Débito</option>
                  <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                </select>
              </div>

              <div className="botones">
                {/* 🔹 Check in con PDF */}
                <button
                  className="btn-checkin"
                  onClick={async () => {
                    try {
                      if (!r.metodoPago) {
                        alert("Debes seleccionar un método de pago antes de hacer check-in");
                        return;
                      }

                      const response = await axios.get(
                        `${API_URL}/check/checkin/${r.id}/pdf`,
                        {
                          params: { metodoPago: r.metodoPago },
                          responseType: "blob"
                        }
                      );

                      // Crear blob con tipo correcto
                      const blob = new Blob([response.data], { type: "application/pdf" });
                      const url = window.URL.createObjectURL(blob);

                      // Crear enlace temporal y forzar descarga
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "factura_checkin.pdf";
                      document.body.appendChild(link);
                      link.click();

                      // Liberar memoria
                      window.URL.revokeObjectURL(url);

                      // Actualizar estado en frontend
                      const nuevasReservas = [...reservas];
                      nuevasReservas[index] = { ...r, estado: "En curso" };
                      setReservas(nuevasReservas);

                    } catch (err) {
                      console.error("Error al hacer check-in:", err);
                      alert("No se pudo realizar el check-in");
                    }
                  }}
                >
                  Check in
                </button>

                {/* 🔹 Check out normal */}
                <button
                  className="btn-checkout"
                  onClick={async () => {
                    try {
                      const res = await axios.put(`${API_URL}/reservas/${r.id}/checkout`);
                      const nuevasReservas = [...reservas];
                      nuevasReservas[index] = res.data;
                      setReservas(nuevasReservas);
                    } catch (err) {
                      console.error("Error al hacer check-out:", err);
                      alert("No se pudo actualizar el estado");
                    }
                  }}
                >
                  Check out
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReservasCheck;
