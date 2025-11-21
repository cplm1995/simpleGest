import { Routes, Route, useLocation } from "react-router-dom";

// Páginas
import Dashboard from "../pages/Dashboard";
import NuevaSolicitud from "../pages/nuevaSolicitud";
import Registro from "../pages/Registro";
import Prestamo from "../pages/Prestamo";
import Usuarios from "../pages/Usuarios";

// Componentes
import Login from "../components/Login";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Autorizacion from "../pages/Autorizacion";
import { AdminRoute } from "../components/AdminRoute";
import { apiFetch } from "../utils/apiFetch";

const Routers = () => {
  const location = useLocation();

  // Ocultar NavBar y Footer en login y "/"
  const hideLayout =
    location.pathname === "/" || location.pathname === "/login";

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideLayout && <NavBar />}

      <main className="flex-grow-1">
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas accesibles para todos */}
          <Route path="/nueva-solicitud" element={<NuevaSolicitud />} />
          <Route path="/registro" element={<Registro />} />

          <Route
            path="/prestamos"
            element={
              <Prestamo
                actualizarResumen={() =>
                  apiFetch("/api/dashboard/resumen")
                }
              />
            }
          />

          {/* Rutas SOLO admin */}
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/autorizacion"
            element={
              <AdminRoute>
                <Autorizacion />
              </AdminRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <AdminRoute>
                <Usuarios />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default Routers;
