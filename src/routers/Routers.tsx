import { Routes, Route } from "react-router-dom";

// Páginas
import Dashboard from "../pages/Dashboard";
import NuevaSolicitud from "../pages/nuevaSolicitud";
import Registro from "../pages/Registro";
import Prestamo from "../pages/Prestamo";
import Usuarios from "../pages/Usuarios";
import Autorizacion from "../pages/Autorizacion";

// Componentes
import Login from "../components/Login";
import Layout from "../components/Layout";
import { AdminRoute } from "../components/AdminRoute";
import { apiFetch } from "../utils/apiFetch";

const Routers = () => {
  return (
    <Routes>
      {/* RUTAS SIN LAYOUT */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* RUTAS CON LAYOUT */}
      <Route element={<Layout />}>
        {/* Rutas públicas dentro del layout */}
        <Route path="/nueva-solicitud" element={<NuevaSolicitud />} />
        <Route path="/registro" element={<Registro />} />

        {/* Prestamo */}
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

        {/* RUTAS SOLO ADMIN */}
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
      </Route>
    </Routes>
  );
};

export default Routers;
