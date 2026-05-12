import { Link } from "react-router-dom";
import "../components/Sidebar.css";

function SidebarRecepcionista() {
  return (
    <div className="sidebar">
      <h2>Menú</h2>

      <Link to="/">Inicio</Link>
      <Link to="/homeRecepcionista/habitaciones">Consultar Habitaciones</Link>
      <Link to="/homeRecepcionista/mis-reservas">Modificar/ Cancelar reservas</Link>
      <Link to="/homeRecepcionista/reservas">Realizar check in/ check out</Link>
      
    </div>
  );
}

export default SidebarRecepcionista;
