import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { useUser } from "../UserContext"; 

function IniciarSesion() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const navigate = useNavigate();
  const { setUser } = useUser(); 
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = (e) => {
    e.preventDefault(); 
    console.log("Enviando login:", { usuario, contrasena });

    axios.post(`${API_URL}/usuarios/login-user`, {
      usuario,
      contrasena
    })
    .then(res => {
      if (res.data) {
        alert("Login exitoso");

        // guardar usuario en contexto y localStorage
        setUser(res.data); 
        localStorage.setItem("usuario", JSON.stringify(res.data));

        // 🔥 REDIRIGIR SEGÚN EL TIPO DE USUARIO
        const tipo = res.data.tipo_usuario; // viene del backend

        if (tipo === "Huesped") {
          navigate("/homeHuesped");
        } else if (tipo === "Recepcionista") {
          navigate("/homeRecepcionista");
        } else if (tipo === "Administrador") {
          navigate("/homeAdministrador");
        } else {
          // fallback si no coincide
          navigate("/");
        }

      } else {
        alert("Usuario o contraseña incorrectos");
      }
    })
    .catch(err => {
      console.error("Error en login:", err);
      alert("Error en login");
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* LOGO */}
        <img src="/LogoHotel.png" className="logo" alt="Logo Hotel" />

        <h1>ROYALBLUE</h1>
        <h2>Iniciar Sesión</h2>

        {/* FORMULARIO */}
        <form className="formulario" onSubmit={handleLogin}>
          <input 
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
          />

          <input 
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
          />

          <button type="submit">
            Iniciar sesión
          </button>
        </form>

      </div>
    </div>
  );
}

export default IniciarSesion;
