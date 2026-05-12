import { Link } from "react-router-dom";
import "../components/Sidebar.css";

function SidebarAdministrador() {
  return (
    <div className="sidebar">
      <h2>Menú</h2>

      <Link to="/">Inicio</Link>
      <Link to="/homeAdministrador/habitaciones">Consultar Habitaciones</Link>
      <Link to="/homeAdministrador/reportes">Consultar reportes</Link>
     
      
    </div>
  );
}

export default SidebarAdministrador;
