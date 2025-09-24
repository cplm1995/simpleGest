import { Routes, Route, useLocation } from "react-router-dom"

// Páginas
import Dashboard from "../pages/Dashboard"
import NuevaSolicitud from "../pages/nuevaSolicitud"
import Categorias from "../pages/Categorias"
import Registro from "../pages/Registro"
import ListaSolicitudes from "../pages/ListaSolicitudes"
import Prestamo from "../pages/Prestamo"

// Componentes
import Login from "../components/Login"
import NavBar from "../components/NavBar"

const Routers = () => {
  const location = useLocation()

  // Ocultar NavBar en login y root "/"
  const hideNavBar = location.pathname === "/" || location.pathname === "/login"

  return (
    <>
      {!hideNavBar && <NavBar />}

      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas principales */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nueva-solicitud" element={<NuevaSolicitud />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/lista-solicitudes" element={<ListaSolicitudes />} />
        <Route path="/prestamo" element={<Prestamo />} />
      </Routes>
    </>
  )
}

export default Routers
