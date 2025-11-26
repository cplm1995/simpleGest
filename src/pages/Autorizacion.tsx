import { useEffect, useState } from "react";
import { FaCheckCircle, FaEdit, FaTruck } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiFetch } from "../utils/apiFetch";

/* interface Material {
    codigoArticulo: string | {
      codigoArticulo: any; nombreArticulo?: string 
  };
    cantidad: number;
  }*/

interface Material {
  hayMaterial: boolean;
  nombreArticulo: any;
  codigoArticulo: Articulo | null;
  cantidad: number;
}

interface Articulo {
  stock: number;
  _id: string;
  codigoArticulo: string;
  nombreArticulo: string;
  descripcion?: string;
}

interface Solicitud {
  hayMaterial: any;
  _id: string;
  nombreSolicitante: string;
  areaSolicitante: string;
  fechaSolicitud: string;
  materiales: Material[];
  estado: "En revisión" | "Aprobado" | "Entregado";
  servicios?: string[];
  descripcionProblema?: string;
}

const Autorizacion: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [articulosDB, setArticulosDB] = useState<Articulo[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 10;

  // Editar material
  const [materialEditando, setMaterialEditando] = useState<{
    solicitudId: string;
    index: number;
    cantidad: number;
  } | null>(null);

  // Obtener artículos Para aprobar si  Si o No
  const obtenerArticulos = async () => {
    try {
      const data = await apiFetch("/api/articulos/");
      setArticulosDB(data);
    } catch (error) {
      console.error("Error obteniendo artículos:", error);
    }
  };

  // Obtener solicitudes
  const obtenerSolicitudes = async () => {
    try {
      const data: any = await apiFetch("/api/solicitudes/todas");

      let lista: Solicitud[] = [];

      if (Array.isArray(data)) {
        lista = data;
      } else if (data && Array.isArray(data.docs)) {
        lista = data.docs;
      } else {
        throw new Error("El formato de respuesta no es válido");
      }

      // --- ESPERA A QUE ARTICULOS ESTÉ CARGADO ---
      if (articulosDB.length > 0) {
        lista = lista.map((s) => {
          // Cada solicitud puede tener varios materiales
          const hayStock = s.materiales.some((m) => {
            const materialCodigo =
              typeof m.codigoArticulo === "string"
                ? m.codigoArticulo
                : m.codigoArticulo?._id;

            const articulo = articulosDB.find(
              (a) =>
                a._id === materialCodigo || a.codigoArticulo === materialCodigo
            );
            return articulo && articulo.stock > 0;
          });

          return {
            ...s,
            hayMaterial: hayStock,
          };
        });
      }

      setSolicitudes(lista);
    } catch (error: any) {
      console.error("Error obteniendo solicitudes:", error);
      toast.error(error.message || "Error al cargar solicitudes");
    }
  };

  useEffect(() => {
    obtenerArticulos();
    obtenerSolicitudes();
  }, []);

  // Cambiar estado
  const cambiarEstado = async (
    id: string,
    nuevoEstado: Solicitud["estado"]
  ) => {
    try {
      await apiFetch(`/api/solicitudes/${id}/estado`, {
        method: "PUT",
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      toast.success(`Solicitud ${nuevoEstado}`);
      obtenerSolicitudes();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "No se pudo cambiar el estado");
    }
  };

  // Guardar cantidad editada
  const guardarCantidad = async () => {
    if (!materialEditando) return;

    try {
      const { solicitudId, index, cantidad } = materialEditando;

      await apiFetch(`/api/solicitudes/${solicitudId}/materiales/${index}`, {
        method: "PUT",
        body: JSON.stringify({ cantidad }),
      });

      toast.success("Cantidad actualizada");
      setMaterialEditando(null);
      obtenerSolicitudes();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // ---------------------------
  // Paginación y búsqueda
  // ---------------------------
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;

  const serviciosFiltrados = solicitudes.filter((servicio) => {
    const query = busqueda.toLowerCase();

    const coincideMaterial = servicio.materiales.some((m) => {
      // Código artículo
      const cod =
        typeof m.codigoArticulo === "string"
          ? m.codigoArticulo
          : m.codigoArticulo?.codigoArticulo;

      // Nombre del artículo
      const nombre =
        typeof m.codigoArticulo === "object"
          ? m.codigoArticulo?.nombreArticulo
          : "";

      return (
        cod?.toLowerCase().includes(query) ||
        nombre?.toLowerCase().includes(query)
      );
    });

    return (
      coincideMaterial ||
      servicio.nombreSolicitante?.toLowerCase().includes(query) ||
      servicio.areaSolicitante?.toLowerCase().includes(query) ||
      servicio.estado?.toLowerCase().includes(query)
    );
  });

  // Actualizar checkbox por material (por solicitud y por index del material)
  const actualizarHayMaterial = (
    solicitudId: string,
    materialIndex: number,
    valor: boolean
  ) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s._id === solicitudId
          ? {
              ...s,
              materiales: s.materiales.map((m, i) =>
                i === materialIndex ? { ...m, hayMaterial: valor } : m
              ),
            }
          : s
      )
    );
  };

  const filasActuales = serviciosFiltrados.slice(
    indicePrimeraFila,
    indiceUltimaFila
  );

  const totalPaginas = Math.ceil(serviciosFiltrados.length / filasPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  return (
    <div className="container mt-4">
      <h4 className="mb-3 text-center">Panel de Autorización</h4>

      {/* MODAL DE EDICIÓN */}
      {materialEditando && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar cantidad</h5>
                <button
                  className="btn-close"
                  onClick={() => setMaterialEditando(null)}
                />
              </div>

              <div className="modal-body">
                <label>Cantidad:</label>
                <input
                  type="number"
                  className="form-control"
                  value={materialEditando.cantidad}
                  onChange={(e) =>
                    setMaterialEditando({
                      ...materialEditando,
                      cantidad: Number(e.target.value),
                    })
                  }
                  min={1}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setMaterialEditando(null)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={guardarCantidad}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <br />
      <hr />

      {/* Buscador */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por material, solicitante o área..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <hr />

      {/* TABLA */}
      <table className="table table-bordered table-striped text-center align-middle">
        <thead className="table-primary">
          <tr>
            <th>N°</th>
            <th>Solicitante</th>
            <th>Área</th>
            <th>Artículos</th>
            <th>Cantidad</th>
            <th>Opciones</th>
            <th>Editar</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {solicitudes.length === 0 ? (
            <tr>
              <td colSpan={8}>No hay solicitudes registradas</td>
            </tr>
          ) : (
            filasActuales.map((s) => (
              <tr key={s._id}>
                <td>{solicitudes.indexOf(s) + 1}</td>
                <td>{s.nombreSolicitante}</td>
                <td>{s.areaSolicitante}</td>

                {/* Nombres de materiales */}
                <td>
                  {s.materiales.map((m, i) => (
                    <div key={i}>
                      {typeof m.codigoArticulo === "string"
                        ? m.codigoArticulo
                        : m.codigoArticulo?.nombreArticulo ?? "—"}
                    </div>
                  ))}
                </td>

                {/* Cantidades */}
                <td>
                  {s.materiales.map((m, i) => (
                    <div key={i}>{m.cantidad}</div>
                  ))}
                </td>
                {/* Opciones: por cada material un par de checkboxes */}
                <td>
                  {s.materiales.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        justifyContent: "center",
                      }}
                    >
                      <label style={{ marginRight: 4 }}>No</label>
                      <input
                        type="checkbox"
                        disabled={s.estado === "Aprobado" || s.estado === "Entregado"}
                        checked={m.hayMaterial === false}
                        onChange={() => actualizarHayMaterial(s._id, i, false)}
                      />
                      <label style={{ marginLeft: 8, marginRight: 4 }}>
                        Si
                      </label>
                      <input
                        type="checkbox"
                        disabled={s.estado === "Aprobado" || s.estado === "Entregado"}
                        checked={m.hayMaterial === true}
                        onChange={() => actualizarHayMaterial(s._id, i, true)}
                      />
                    </div>
                  ))}
                </td>

                {/* Botón editar por material */}
                <td>
                  {s.materiales.map((m, i) => (
                    <div key={i}>
                      <button
                        className="btn btn-sm btn-outline-primary mb-1"
                        disabled={s.estado !== "En revisión"}
                        title={
                          s.estado !== "En revisión"
                            ? "En revisión"
                            : "Entregado"
                        }
                        onClick={() =>
                          setMaterialEditando({
                            solicitudId: s._id,
                            index: i,
                            cantidad: m.cantidad,
                          })
                        }
                      >
                        <FaEdit className="btn-sm" />
                      </button>
                    </div>
                  ))}
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
              className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
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

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Autorizacion;
