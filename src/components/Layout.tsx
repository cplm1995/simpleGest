import { useEffect, useState } from "react";
import { FaCheckCircle, FaUserCircle } from "react-icons/fa";
import {
  FaArrowRightFromBracket,
  FaFilePen,
  FaHandHoldingHand,
  FaHouse,
  FaPenToSquare,
  FaUserGroup,
} from "react-icons/fa6";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "./Footer";

//  Interfaz del usuario
interface User {
  nombrecompleto?: string;
  username: string;
  rol: string;
}

const Layout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Detectar la ruta y asignar título dinámico
  const pageTitles = {
    "/": "Dashboard",
    "/autorizacion": "Módulo Autorización",
    "/nueva-solicitud": "Módulo Nueva Solicitud",
    "/registro": "Módulo Registro de Artículos",
    "/prestamos": "Módulo de Préstamos",
    "/usuarios": "Módulo de Usuarios",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Sesión cerrada correctamente");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const title =
    pageTitles[location.pathname as keyof typeof pageTitles] ||
    "Dashboard";

  return (
    <div className="d-flex">
      {/* ===== SIDEBAR ===== */}

      <aside
        className={`bg-primary text-white p-3 position-fixed h-100 shadow
          ${open ? "start-0" : "start-0 d-none d-md-block"}`}
        style={{ width: "250px", zIndex: 1000 }}
      >
        {/* LOGO */}
        <div className="logo mb-4 d-flex align-items-center justify-content-center">
          <h2 className="text-center mb-4">SimpleGest</h2>
        </div>

        {/* MENU */}

        <nav className="nav flex-column">
          {user?.rol === "admin" && (
            <>
              <Link
                to="/dashboard"
                className="nav-link text-white mb-2"
                onClick={() => setOpen(false)}
              >
                <FaHouse className="mb-1" style={{ marginRight: "8px" }} />
                Dashboard
              </Link>

              <Link
                to="/autorizacion"
                className="nav-link text-white mb-2"
                onClick={() => setOpen(false)}
              >
                <FaCheckCircle
                  className="mb-1"
                  style={{ marginRight: "8px" }}
                />
                Autorización
              </Link>

              <Link
                to="/registro"
                className="nav-link text-white mb-2"
                onClick={() => setOpen(false)}
              >
                <FaPenToSquare
                  className="mb-1"
                  style={{ marginRight: "8px" }}
                />
                Registro artículos
              </Link>

              <Link
                to="/nueva-solicitud"
                className="nav-link text-white mb-2"
                onClick={() => setOpen(false)}
              >
                <FaFilePen className="mb-1" style={{ marginRight: "8px" }} />
                Nueva Solicitud
              </Link>
              <Link
                to="/prestamos"
                className="nav-link text-white mb-2"
                onClick={() => setOpen(false)}
              >
                <FaHandHoldingHand
                  className="mb-1"
                  style={{ marginRight: "8px" }}
                />
                Préstamos
              </Link>
              <Link
                to="/usuarios"
                className="nav-link text-white mb-2"
                onClick={() => setOpen(false)}
              >
                <FaUserGroup className="mb-1" style={{ marginRight: "8px" }} />
                Usuarios
              </Link>
            </>
          )}

          <img src="/logo2.png" width="100%" height="100%" alt="logoSimpleGest" style={{marginTop:"30px"}}/>

          {/* Usuario logueado */}
          {user && (
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center text-white mt-5"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUserCircle
                  size={20}
                  className="mb-1"
                  style={{ marginRight: "8px" }}
                />
                <span className="fw-semibold small">
                  {user.nombrecompleto || user.username}
                </span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end">
                <li className="dropdown-item text-black small">
                  Rol: <strong>{user.rol}</strong>
                </li>

                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <FaArrowRightFromBracket className="me-2" />
                    Salir
                  </button>
                </li>
              </ul>
              
            </li>
          )}
        </nav>
      </aside>

      {/* ===== OVERLAY EN MÓVIL ===== */}
      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 900 }}
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* ===== CONTENEDOR PRINCIPAL ===== */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: "250px", minHeight: "100vh" }}
      >
        {/* ===== HEADER ===== */}
        <header className="d-flex justify-content-center align-items-center p-3 bg-white border-bottom shadow-sm">
          <button
            className="btn btn-outline-secondary d-md-none"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>

          <h1 className="fs-3 fw-bold mb-0 text-center flex-grow-1">{title}</h1>
        </header>

        {/* ===== CONTENIDO ===== */}
        <main className="flex-grow-1 overflow-auto bg-light p-4">
          <Outlet />
        </main>

        {/* ===== FOOTER ===== */}

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
