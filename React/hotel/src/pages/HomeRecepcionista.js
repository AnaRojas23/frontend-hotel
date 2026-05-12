import { Routes, Route } from "react-router-dom";
import SidebarRecepcionista from "../components/SidebarRecepcionista";
import Habitaciones from "./ConsultarHabitaciones";
import Reservas from "./reservarHabitacionRecepcionista";
import MisReservas from "./MisReservas";
import ModificarReserva from "./ModificarReserva";
import CancelarReserva from "./CancelarReserva";
import ReservasCheck from "./ReservasCheck";
import "../components/Sidebar.css";
import Header from "../components/Header";

function HomeRecepcionista() {
  return (
    <div className="homeRecepcionista">

      <Header />

      <div className="layout">
        <SidebarRecepcionista />
        <div className="main">
          <Routes>
            <Route index element={<h2>Bienvenido al sistema</h2>} />
            <Route path="habitaciones" element={<Habitaciones />} />
            <Route path="reservasRecepcionista" element={<Reservas />} />
            <Route path="mis-reservas" element={<MisReservas />} />
             <Route path="reservas" element={<ReservasCheck />} />
            <Route path="modificar-reserva" element={<ModificarReserva />} />
            <Route path="cancelar-reserva" element={<CancelarReserva />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
export default HomeRecepcionista;