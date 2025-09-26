import { useState, useEffect } from "react";
import {
  FaLock,
  FaRegFloppyDisk,
  FaUserPen,
  FaUserPlus,
} from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";

interface Usuario {
  _id?: string;
  nombrecompleto: string;
  username: string;
  password?: string;
}

const Usuarios = () => {
  const [formData, setFormData] = useState<Usuario>({
    nombrecompleto: "",
    username: "",
    password: "",
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // 🔹 cargar usuarios al montar
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/usuarios");
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardarClick = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error al guardar los datos");
        return;
      }

      toast.success(data.message || "Usuario registrado correctamente");

      // agregar usuario devuelto por backend
      if (data.usuario) {
        setUsuarios((prev) => [data.usuario, ...prev]);
      }

      limpiarFormulario();
    } catch (error) {
      toast.error("Error en la conexión con el servidor");
      console.error(error);
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      nombrecompleto: "",
      username: "",
      password: "",
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
                  <FaUserPen style={{ marginRight: "6px", marginTop: -3, fontSize: "20px", color: "blue"}} />
                <input
                  value={formData.nombrecompleto}
                  onChange={handleChange}
                  name="nombrecompleto"
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Ingrese su nombre"
                  required
                />
              </div>
              <div className="input-group-text bg-white mb-3">
                  <FaUserPlus style={{ marginRight: "6px", marginTop: -3, fontSize: "20px", color: "blue"}} />
                <input
                  value={formData.username}
                  onChange={handleChange}
                  name="username"
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Ingrese su usuario"
                  required
                />
              </div>
              <div className="input-group-text bg-white mb-3">
                  <FaLock style={{ marginRight: "6px", marginTop: -3, fontSize: "20px", color: "blue"}} />
                <input
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Ingrese su contraseña"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" id="btnUsers">
                <FaRegFloppyDisk style={{ marginRight: "5px", marginTop: -3 }} /> Guardar
              </button>
            </form>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <table className="table table-hover table-responsive mt-5">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre completo</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, index) => (
              <tr key={u._id || index}>
                <td>{index + 1}</td>
                <td>{u.nombrecompleto}</td>
                <td>{u.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Usuarios;
