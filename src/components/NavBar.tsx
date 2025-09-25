import {
  FaArrowRightFromBracket,
  FaFileCircleCheck,
  FaFilePen,
  FaHandHoldingHand,
  FaHouse,
  FaPenToSquare,
  FaUserGroup
} from "react-icons/fa6";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="container-sm">
      <div className="bg-primary shadow">
        <nav className="navbar navbar-expand-sm navbar-dark py-3">
          <div className="container-sm">
            {/* Logo o título */}
            <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
              <img
                src="../src/assets/img/logo2.png"
                style={{ width: "60px", height: "60px" }}
                alt="Logo"
                className="me-2"
              />
            </Link>

            {/* Botón hamburguesa para móvil */}
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

            {/* Links de navegación */}
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
                <li className="nav-item">
                  <button
                    className="btn btn-danger btn-sm ms-3"
                    id="logoutButton"
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                  >
                    <FaArrowRightFromBracket className="me-1" /> Salir
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
