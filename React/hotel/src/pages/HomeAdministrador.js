import { Routes, Route } from "react-router-dom";
import SidebarAdministrador from "../components/SidebarAdministrador";
import Habitaciones from "./ConsultarHabitaciones";
import Reportes from "./DashboardReportes";
import "../components/Sidebar.css";
import Header from "../components/Header";

function HomeAdministrador() {
  return (
    <div className="homeAdministrador">

      <Header />

      <div className="layout">
        <SidebarAdministrador />
        <div className="main">
          <Routes>
            <Route index element={<h2>Bienvenido al sistema</h2>} />
            <Route path="habitaciones" element={<Habitaciones />} />
            <Route path="reportes" element={<Reportes/>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
export default HomeAdministrador;