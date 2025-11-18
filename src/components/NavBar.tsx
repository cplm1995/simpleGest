import { useEffect, useState } from "react";
import { FaCheckCircle, FaUserCircle } from "react-icons/fa";
import {
  FaArrowRightFromBracket,
  FaFileCircleCheck,
  FaFilePen,
  FaHandHoldingHand,
  FaHouse,
  FaPenToSquare,
  FaUserGroup,
} from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//  Interfaz del usuario
interface User {
  nombrecompleto?: string;
  username: string;
  rol: string;
}

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Sesión cerrada correctamente");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="container-sm px-0">
      <div className="bg-primary shadow-sm">
        <nav className="navbar navbar-expand-sm navbar-dark py-2">
          <div className="container-sm">
            {/* Logo */}
            <Link
              className="navbar-brand d-flex align-items-center"
              to="/dashboard"
            >
              <img
                src="/simpleGest.png"
                alt="Logo"
                style={{ width: "50px", height: "50px" }}
                className="me-2 rounded-circle bg-white p-1"
              />
              <span className="fw-bold">SimpleGest</span>
            </Link>

            {/* Botón hamburguesa */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Links */}
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center fw-semibold small">
                
                {/* Solo visible si el rol es admin */}
                {user?.rol === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      <FaHouse className="me-1" /> Dashboard
                    </Link>
                  </li>
                )}

                {/* Solo visible si el rol es admin */}
                {user?.rol === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/lista-solicitudes">
                      <FaFileCircleCheck className="me-1" /> Solicitudes
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <Link className="nav-link" to="/nueva-solicitud">
                    <FaFilePen className="me-1" /> Nueva Solicitud
                  </Link>
                </li>

                {user?.rol === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/autorizacion">
                      <FaCheckCircle className="me-1" /> Autorización
                    </Link>
                  </li>
                )}


                {/*Solo visible si el rol es admin*/}
                {user?.rol === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/registro">
                      <FaPenToSquare className="me-1" /> Registro
                    </Link>
                  </li>
                )}

                {/*Solo visible si el rol es admin*/}
                {user?.rol === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/prestamos">
                      <FaHandHoldingHand className="me-1" /> Préstamo
                    </Link>
                  </li>
                )}

                {/* Solo visible si el rol es admin */}
                {user?.rol === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/usuarios">
                      <FaUserGroup className="me-1" /> Usuarios
                    </Link>
                  </li>
                )}

                {/* Usuario logueado */}
                {user && (
                  <li className="nav-item ms-3 text-white d-flex flex-column align-items-center">
                    <FaUserCircle size={22} />
                    <span className="small text-center">
                      {user.nombrecompleto || user.username}
                      <br />
                      <span className="badge bg-light text-dark">
                        {user.rol}
                      </span>
                    </span>
                  </li>
                )}

                {/* Botón salir */}
                <li className="nav-item ms-3">
                  <button
                    className="btn btn-danger btn-sm"
                    id="logoutButton"
                    onClick={handleLogout}
                  >
                    <FaArrowRightFromBracket className="me-1" /> Salir
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default NavBar;
