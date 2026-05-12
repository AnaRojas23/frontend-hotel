import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeHuesped from "./pages/HomeHuesped";
import Login from "./pages/Login";
import Iniciar from "./pages/IniciarSesion";
import Registrar from "./pages/Registrar";
import HomeRecepcionista from "./pages/HomeRecepcionista";
import HomeAdministrador from "./pages/HomeAdministrador";
import { UserProvider } from "./UserContext";

function App() {
  return (
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/homeHuesped/*" element={<HomeHuesped />} />
        <Route path="/homeRecepcionista/*" element={<HomeRecepcionista />} />
         <Route path="/homeAdministrador/*" element={<HomeAdministrador />} />
        <Route path="/" element={<Login />} />
        <Route path="/iniciarSesion" element={<Iniciar />} />
        <Route path="/registrar" element={<Registrar />} />
      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;