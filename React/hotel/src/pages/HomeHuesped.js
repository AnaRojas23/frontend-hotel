import { Routes, Route } from "react-router-dom";
import SidebarHuesped from "../components/SidebarHuesped";
import Habitaciones from "./ConsultarHabitaciones";
import Reservas from "./reservarHabitacionHuesped";
import MisReservas from "./MisReservas";
import ModificarReserva from "./ModificarReserva";
import CancelarReserva from "./CancelarReserva";
import "../components/Sidebar.css";
import Header from "../components/Header";

function HomeHuesped() {
  return (
    <div className="homeHuesped">

      <Header />

      <div className="layout">
        <SidebarHuesped />
        <div className="main">
          <Routes>
            <Route index element={<h2>Bienvenido al sistema</h2>} />
            <Route path="habitaciones" element={<Habitaciones />} />
            <Route path="reservasHuesped" element={<Reservas />} />
            <Route path="mis-reservas" element={<MisReservas />} />
            <Route path="modificar-reserva" element={<ModificarReserva />} />
            <Route path="cancelar-reserva" element={<CancelarReserva />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
export default HomeHuesped;