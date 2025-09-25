import { Routes, Route, useLocation } from "react-router-dom"

// Páginas
import Dashboard from "../pages/Dashboard"
import NuevaSolicitud from "../pages/nuevaSolicitud"
import Registro from "../pages/Registro"
import ListaSolicitudes from "../pages/ListaSolicitudes"
import Prestamo from "../pages/Prestamo"
import Usuarios from "../pages/Usuarios"

// Componentes
import Login from "../components/Login"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"  // 👈 Importamos el footer

const Routers = () => {
  const location = useLocation()

  // Ocultar NavBar y Footer en login y root "/"
  const hideLayout = location.pathname === "/" || location.pathname === "/login"

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideLayout && <NavBar />}

      <main className="flex-grow-1">
        <Routes>
          {/* Rutas de autenticación */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas principales */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nueva-solicitud" element={<NuevaSolicitud />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/lista-solicitudes" element={<ListaSolicitudes />} />
          <Route path="/prestamos" element={<Prestamo />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </main>
      <br />

      {!hideLayout && <Footer />}
    </div>
  )
}

export default Routers
