import { useEffect, useState } from "react";
import { FaCheckCircle, FaTruck } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Solicitud {
  _id: string;
  nombreSolicitante: string;
  areaSolicitante: string;
  fechaSolicitud: string;
  materiales: { codigoArticulo: string },
  cantidad: number;
  estado: "En revisión" | "Aprobado" | "Entregado";
}

const AutorizacionSolicitudes: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  // Obtener solicitudes al montar el componente
  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  //  Obtener todas las solicitudes desde el backend
  const obtenerSolicitudes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/solicitudes");
      if (!res.ok) throw new Error("Error al cargar las solicitudes");
      const data = await res.json();
      setSolicitudes(data.docs ?? data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudieron cargar las solicitudes");
    }
  };

  //  Cambiar estado de solicitud
  const cambiarEstado = async (
    id: string,
    nuevoEstado: Solicitud["estado"]
  ) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/solicitudes/${id}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar estado");

      toast.success(`Solicitud ${nuevoEstado}`);
      obtenerSolicitudes(); // refrescar
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("No se pudo actualizar el estado");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3 text-center">Panel de Autorización</h4>

      <table className="table table-bordered table-striped text-center align-middle">
        <thead className="table-primary">
          <tr>
            <th>Solicitante</th>
            <th>Área</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {solicitudes.length === 0 ? (
            <tr>
              <td colSpan={5}>No hay solicitudes registradas</td>
            </tr>
          ) : (
            solicitudes.map((s) => (
              <tr key={s._id}>
                <td>{s.nombreSolicitante}</td>
                <td>{s.areaSolicitante}</td>
                <td>
                  {/* Renderizar los materiales de la solicitud */}
                  {/* Asumiendo que 'materiales' es un array de objetos con una propiedad 'codigoArticulo' */}
                  {/* Si 'materiales' es un solo objeto, se puede ajustar la lógica */}
                  {s.materiales && s.materiales.codigoArticulo}
                </td>
                <td>{new Date(s.fechaSolicitud).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      s.estado === "Aprobado"
                        ? "bg-success"
                        : s.estado === "Entregado"
                        ? "bg-secondary"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {s.estado}
                  </span>
                </td>
                <td>
                  {s.estado === "En revisión" && (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => cambiarEstado(s._id, "Aprobado")}
                    >
                      <FaCheckCircle className="me-1" /> Aprobar
                    </button>
                  )}
                  {s.estado === "Aprobado" && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => cambiarEstado(s._id, "Entregado")}
                    >
                      <FaTruck className="me-1" /> Marcar entregado
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AutorizacionSolicitudes;
