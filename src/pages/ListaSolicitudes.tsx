import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ---------------------------
// Tipos de datos
// ---------------------------
interface Articulo {
  _id: string;
  codigoArticulo: string;
  nombreArticulo: string;
  descripcion?: string;
}

interface Material {
  nombreArticulo: any;
  codigoArticulo: Articulo | null;
  cantidad: number;
}

interface Solicitante {
  nombreSolicitante: string;
  areaSolicitante: string;
}

interface Servicio {
  _id: string;
  fechaSolicitud?: string;
  servicios?: string[];
  descripcionProblema?: string;
  solicitante: Solicitante;
  materiales: Material[];
}

// ---------------------------
// Componente principal
// ---------------------------
const ListaSolicitudes = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 10;

  // ---------------------------
  // Función eliminar
  // ---------------------------
  const handleEliminar = (id: string) => {
    toast.info(
      <div>
        <p>¿Seguro que quieres eliminar esta solicitud?</p>
        <div className="d-flex justify-content-end mt-2">
          <button
            className="btn btn-sm btn-danger me-2"
            onClick={async () => {
              try {
                const response = await fetch(
                  `http://simplegest.com:3000/api/solicitudes/${id}`,
                  { method: "DELETE" }
                );

                if (!response.ok) throw new Error("Error al eliminar");

                setServicios((prev) => prev.filter((s) => s._id !== id));
                toast.dismiss();
                toast.warning("Solicitud eliminada correctamente");
              } catch (error) {
                console.error(error);
                toast.error("Error al eliminar solicitud");
              }
            }}
          >
            Sí, eliminar
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => toast.dismiss()}
          >
            Cancelar
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  // ---------------------------
  // Obtener datos del backend
  // ---------------------------
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch("http://simplegest.com:3000/api/solicitudes");
        const data = await response.json();
        const raw = data?.docs ?? [];

        const normalized = raw.map((s: any) => {
          const materiales: Material[] = (s.materiales || []).map((m: any) => ({
            codigoArticulo: m.codigoArticulo || null,
            nombreArticulo: m.codigoArticulo?.nombreArticulo ?? "N/A",
            cantidad: Number(m.cantidad ?? 0),
          }));

          return {
            _id: s._id,
            fechaSolicitud: s.fechaSolicitud ?? "",
            servicios: s.servicios ?? [],
            descripcionProblema: s.descripcionProblema ?? "N/A",
            solicitante: {
              nombreSolicitante: s.nombreSolicitante ?? "N/A",
              areaSolicitante: s.areaSolicitante ?? "N/A",
            },
            materiales,
          } as Servicio;
        });

        setServicios(normalized);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      }
    };

    fetchServicios();
  }, []);

  // ---------------------------
  // Paginación y búsqueda
  // ---------------------------
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;

  const serviciosFiltrados = servicios.filter((servicio) => {
    const query = busqueda.toLowerCase();

    const coincideMaterial = servicio.materiales.some(
      (m) =>
        m.codigoArticulo?.codigoArticulo?.toLowerCase().includes(query) ||
        m.nombreArticulo.toLowerCase().includes(query)
    );

    return (
      coincideMaterial ||
      servicio.solicitante?.nombreSolicitante
        .toLowerCase()
        .includes(query) ||
      servicio.solicitante?.areaSolicitante.toLowerCase().includes(query)
    );
  });

  const filasActuales = serviciosFiltrados.slice(
    indicePrimeraFila,
    indiceUltimaFila
  );

  const totalPaginas = Math.ceil(serviciosFiltrados.length / filasPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Lista de Solicitudes</h1>

      {/* Buscador */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por código, material, solicitante o área..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <table className="table table-striped table-bordered table-responsive">
        <thead className="table-dark text-center">
          <tr>
            <th colSpan={3}>Materiales</th>
            <th>Solicitante</th>
            <th>Área</th>
            <th>Servicios</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filasActuales.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center">
                No hay solicitudes que coincidan
              </td>
            </tr>
          ) : (
            filasActuales.map((servicio) => (
              <tr key={servicio._id}>
                {/* Celda con materiales en lista con viñetas */}
                <td colSpan={3}>
                  <ul className="mb-0 ps-3">
                    {servicio.materiales.map((m, index) => (
                      <li key={index}>
                        <strong>{m.codigoArticulo?.codigoArticulo ?? "N/A"}</strong> -{" "}
                        {m.nombreArticulo} ({m.cantidad})
                      </li>
                    ))}
                  </ul>
                </td>

                <td>{servicio.solicitante?.nombreSolicitante}</td>
                <td>{servicio.solicitante?.areaSolicitante}</td>
                <td>{(servicio.servicios || []).join(", ")}</td>
                <td>{servicio.descripcionProblema}</td>
                <td>
                  {servicio.fechaSolicitud
                    ? new Date(servicio.fechaSolicitud).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(servicio._id)}
                  >
                    <FaTrashAlt style={{ marginRight: "1px", marginTop: -3 }} />
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ListaSolicitudes;
