import { useState } from "react";
import axios from "axios";
import "./registrar.css";
import { useNavigate } from "react-router-dom";

function Registrar() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    documento_id: "",
    tipo_usuario: "",
    pais_origen: "",
    fecha_nac: "",
    usuario: "",
    contrasena: ""
  });

  // 🔥 códigos secretos guardados en el front
  const CODIGO_RECEPCIONISTA = "RECEP123";
  const CODIGO_ADMIN = "ADMIN456";
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de código para roles especiales
    if (formData.tipo_usuario === "Recepcionista" || formData.tipo_usuario === "Administrador") {
      const codigoIngresado = window.prompt("Ingrese el código de autorización:");

      if (
        (formData.tipo_usuario === "Recepcionista" && codigoIngresado !== CODIGO_RECEPCIONISTA) ||
        (formData.tipo_usuario === "Administrador" && codigoIngresado !== CODIGO_ADMIN)
      ) {
        alert("Código incorrecto. No se puede registrar este usuario.");
        return; // detener registro
      }
    }
     console.log("Datos enviados:", formData);
    // Enviar datos al backend
    axios.post("${API_URL}/usuarios/registrar", formData)
      .then(res => {
        alert("Usuario registrado con éxito");
        console.log("Respuesta backend:", res.data);
        navigate("/iniciarSesion"); // 👈 redirige después del alert
      })
      .catch(err => {
        console.error("Error al registrar:", err.response?.data || err.message);
        alert("Error al registrar usuario");
      });
  };

  return (
    <div className="registrar-container">
      <div className="registrar-card">
        <img src="/LogoHotel.png" className="logo" alt="Logo Hotel" />
        <h1>ROYALBLUE</h1>
        <h2>Registrarse</h2>

        <form className="formulario" onSubmit={handleSubmit}>
          <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} />
          <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} />
          <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} />
          <input type="email" name="correo" placeholder="Correo" onChange={handleChange} />
          <input type="text" name="documento_id" placeholder="Documento" onChange={handleChange} />

          <select name="tipo_usuario" onChange={handleChange}>
            <option value="">Seleccione tipo de usuario</option>
            <option value="Huesped">Huésped</option>
            <option value="Recepcionista">Recepcionista</option>
            <option value="Administrador">Administrador</option>
          </select>

          <input type="text" name="pais_origen" placeholder="País de origen" onChange={handleChange} />
          <input type="date" name="fecha_nac" onChange={handleChange} />
          <input type="text" name="usuario" placeholder="Usuario" onChange={handleChange} />
          <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} />

          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default Registrar;
