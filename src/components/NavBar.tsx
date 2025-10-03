import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import {
  FaArrowRightFromBracket,
  FaFileCircleCheck,
  FaFilePen,
  FaHandHoldingHand,
  FaHouse,
  FaPenToSquare,
  FaUserGroup,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  nombrecompleto: string;
  username: string;
  rol: string;
}

const NavBar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Sesión cerrada");
    window.location.href = "/login";
  };

  return (
    <div className="container-sm">
      <div className="bg-primary shadow">
        <nav className="navbar navbar-expand-sm navbar-dark py-3">
          <div className="container-sm">
            {/* Logo */}
            <Link
              className="navbar-brand d-flex align-items-center"
              to="/dashboard"
            >
              <img
                src="/logo2.png"
                style={{ width: "60px", height: "60px" }}
                alt="Logo"
                className="me-2"
              />
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
              <ul className="navbar-nav ms-auto small fw-semibold">
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <FaHouse className="me-1" /> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/lista-solicitudes">
                    <FaFileCircleCheck className="me-1" /> Solicitudes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/nueva-solicitud">
                    <FaFilePen className="me-1" /> Nueva Solicitud
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registro">
                    <FaPenToSquare className="me-1" /> Registro
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/prestamos">
                    <FaHandHoldingHand className="me-1" /> Préstamo
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/usuarios">
                    <FaUserGroup className="me-1" /> Usuarios
                  </Link>
                </li>

                {/* Usuario logueado */}
                {user && (
                  <li className="nav-item d-flex align-items-center text-white ms-3">
                    <FaUserCircle className="me-1" size={20} />
                    <span className="me-2">{user.nombrecompleto}</span>
                    <span className="badge bg-light text-dark">{user.rol}</span>
                  </li>
                )}

                {/* Botón salir */}
                <li className="nav-item">
                  <button
                    className="btn btn-danger btn-sm ms-3"
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
