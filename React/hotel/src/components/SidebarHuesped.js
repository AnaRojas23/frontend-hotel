import { Link } from "react-router-dom";
import "../components/Sidebar.css";

function SidebarHuesped() {
  return (
    <div className="sidebar">
      <h2>Menú</h2>

      <Link to="/">Inicio</Link>
      <Link to="/homeHuesped/habitaciones">Consultar Habitaciones</Link>
      <Link to="/homeHuesped/mis-reservas">Modificar/Cancelar mis reservas</Link>
    
    </div>
  );
}

export default SidebarHuesped;

