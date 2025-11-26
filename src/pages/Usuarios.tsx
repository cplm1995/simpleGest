import { useState, useEffect } from "react";
import {
  FaGears,
  FaLock,
  FaRegFloppyDisk,
  FaUserPen,
  FaUserPlus,
} from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import { apiFetch } from "../utils/apiFetch";
import { FaTrashAlt } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";


interface Usuario {
  _id?: string;
  nombrecompleto: string;
  username: string;
  password?: string;
  rol?: string;
}

const Usuarios = () => {
  const [formData, setFormData] = useState<Usuario>({
    nombrecompleto: "",
    username: "",
    password: "",
    rol: "usuario", // Valor por defecto
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 4;

  // 🔹 función global para cargar usuarios
  const fetchUsuarios = async () => {
    try {
      const data = await apiFetch("/api/usuarios");
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  // Filtrar resultados
  const filtrados = usuarios.filter((usuario) => {
    const query = busqueda.toLowerCase();
    return (
      usuario.nombrecompleto?.toLowerCase().includes(query) ||
      usuario.username?.toLowerCase().includes(query)
    );
  });

  // Paginación
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
  const filasActuales = filtrados.slice(indicePrimeraFila, indiceUltimaFila);
  const totalPaginas = Math.ceil(filtrados.length / filasPorPagina);

  // cargar usuarios al montar
  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardarClick = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formData.rol) {
      toast.warning("Por favor seleccione un rol antes de guardar");
      return;
    }

    try {
      console.log("formData:", formData);

      const data = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      toast.success(data.message || "Usuario registrado correctamente");

      // Refrescar lista
      await fetchUsuarios();

      limpiarFormulario();
    } catch (error) {
      toast.error("Error en la conexión con el servidor");
      console.error(error);
    }
  };

  //Eliminar usuario
  const eliminarUsuario = (id: string) => {
    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro que deseas eliminar este usuario?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            try {
              const res = await apiFetch(`/usuarios/${id}`, {
                method: "DELETE",
              });

              toast.success(res.msg);
              fetchUsuarios();
            } catch (error: any) {
              toast.error("No se pudo eliminar el usuario");
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            // No hacemos nada si el usuario cancela
          },
        },
      ],
    });
  };

  const limpiarFormulario = () => {
    setFormData({
      nombrecompleto: "",
      username: "",
      password: "",
      rol: "usuario",
    });
  };

  return (
    <>
      <div className="container mt-5">
        <h1>Bienvenidos al módulo de usuario</h1>
        <div className="card">
          <div className="card-body">
            <div className="card-header">Ingreso nuevo usuario</div>
            <form onSubmit={handleGuardarClick} className="mt-4">
              <div className="input-group-text bg-white mb-3 mt-4">
                <FaUserPen
                  style={{
                    marginRight: "6px",
                    marginTop: -3,
                    fontSize: "20px",
                    color: "blue",
                  }}
                />
                <input
                  value={formData.nombrecompleto}
                  onChange={handleChange}
                  name="nombrecompleto"
                  type="text"
                  className="form-control"
                  placeholder="Ingrese su nombre"
                  required
                />
              </div>
              <div className="input-group-text bg-white mb-3">
                <FaUserPlus
                  style={{
                    marginRight: "6px",
                    marginTop: -3,
                    fontSize: "20px",
                    color: "blue",
                  }}
                />
                <input
                  value={formData.username}
                  onChange={handleChange}
                  name="username"
                  type="text"
                  className="form-control"
                  placeholder="Ingrese su usuario"
                  required
                />
              </div>
              <div className="input-group-text bg-white mb-3">
                <FaLock
                  style={{
                    marginRight: "6px",
                    marginTop: -3,
                    fontSize: "20px",
                    color: "blue",
                  }}
                />
                <input
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Ingrese su contraseña"
                  required
                />
              </div>
              <div className="input-group-text bg-white mb-3">
                <FaGears
                  style={{
                    marginRight: "6px",
                    marginTop: -3,
                    fontSize: "20px",
                    color: "blue",
                  }}
                />
                <label htmlFor="rol"></label>
                <select
                  name="rol"
                  id="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="" disabled>
                    Seleccione un rol
                  </option>
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" id="btnGeneral">
                <FaRegFloppyDisk
                  style={{ marginRight: "5px", marginTop: -3 }}
                />{" "}
                Guardar
              </button>
            </form>
          </div>
        </div>

        <input
          type="search"
          name="busqueda"
          className="form-control mt-5"
          placeholder="Buscar.."
          onChange={(e) => setBusqueda(e.target.value)}
          value={busqueda}
        />

        {/* Tabla de usuarios */}
        <table className="table table-hover table-responsive mt-5">
          <thead className="table-dark text-start">
            <tr>
              <th>#</th>
              <th>Nombre completo</th>
              <th>Username</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filasActuales.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No hay usuarios
                </td>
              </tr>
            ) : (
              filasActuales.map((u, index) => (
                <tr key={u._id || index}>
                  <td>{index + 1}</td>
                  <td>{u.nombrecompleto || "Sin nombre"}</td>
                  <td>{u.username || "Sin usuario"}</td>
                  <td>{u.rol || "Sin rol"}</td>
                  <td>
                    <button
                      type="button"
                      title="Eliminar"
                      className="btn btn-outline-danger btn-sm align-items-center justify-content-center w-100"
                      onClick={() => u._id && eliminarUsuario(u._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <nav>
          <ul className="pagination justify-content-start">
            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                Anterior
              </button>
            </li>
            {[...Array(totalPaginas)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${
                  paginaActual === i + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setPaginaActual(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                paginaActual === totalPaginas ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Usuarios;
