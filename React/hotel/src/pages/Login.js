import { useNavigate } from "react-router-dom";
import "./login.css";


function Login() {
    const navigate = useNavigate();
    return (
      <div className="login-container">
       
        <div className="login-card">
        <img  src="/LogoHotel.png" alt="Logo del hotel"className="logo" />
          <h1>ROYALBLUE</h1>
          <h2>Resort</h2>
  
          <div className="buttons">
            <button onClick={() => navigate("/iniciarSesion")}>
              Iniciar sesión
            </button>
  
            <button onClick={() => navigate("/registrar")}>
              Registrarse
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default Login;
