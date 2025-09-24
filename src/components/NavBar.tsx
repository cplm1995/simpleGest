import { Link, useNavigate } from "react-router-dom"
import '../NavBar.css'
import { FaArrowRightFromBracket, FaFileCirclePlus, FaFileLines, FaFilePen, FaHandHolding, FaHouse, FaUserGroup } from "react-icons/fa6";
import { FaList } from "react-icons/fa";


const NavBar = () => {
  const navigate = useNavigate();

  const hanledLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <>
      <div className="container-lg">
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow custom-navbar">
          <div className="container-fluid">
            {/*Logo y titulo*/}
            <Link className="navbar-brand custom-brand" to={"/"}><img src="../src/assets/img/logo2.png" style={{ width: 100, height: 100 }}></img></Link>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link custom-link" aria-current="page" to={"/dashboard"}><FaHouse /> Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-link" to={"/lista-solicitudes"}><FaFileLines /> Lista de Solicitudes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-link" to={"/nueva-solicitud"}><FaFilePen /> Nueva solicitud</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-link" to={"/categorias"}><FaList /> Categorías</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-link" to={"/registro"}><FaFileCirclePlus /> Registro</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-link" to={"/prestamo"}><FaHandHolding /> Prestamo</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-link" to={"/usuarios"}><FaUserGroup /> Usuarios</Link>
              </li>
            </ul>
            {/*Botón para cerrar sesión*/}
            <button style={{ marginLeft: 10 }} className="btn-sm btn btn-danger custom-btn-danger" id="btn-logout" onClick={hanledLogout}>
              <FaArrowRightFromBracket style={{ marginRight: 10 }} />
              Cerrar sesión
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}

export default NavBar
