import { useState, useEffect } from "react";

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
  codigoArticulo: Articulo | null; // Populate devuelve un objeto
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
  const filasPorPagina = 5;

  // 🔎 Filtrar resultados
  const filtrados = servicios.flatMap((servicio) =>
    servicio.materiales
      .filter((material) => {
        const query = busqueda.toLowerCase();
        return (
          (material.codigoArticulo?.codigoArticulo &&
            material.codigoArticulo.codigoArticulo.toLowerCase().includes(query)) ||
          (material.codigoArticulo?.nombreArticulo &&
            material.codigoArticulo.nombreArticulo.toLowerCase().includes(query)) ||
          servicio.solicitante?.nombreSolicitante.toLowerCase().includes(query) ||
          servicio.solicitante?.areaSolicitante.toLowerCase().includes(query)
        );
      })
      .map((material, idx) => ({
        ...servicio,
        material,
        key: `${servicio._id}-${idx}`,
      }))
  );

  // 📌 Paginación con base en resultados filtrados
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
  const filasActuales = filtrados.slice(indicePrimeraFila, indiceUltimaFila);
  const totalPaginas = Math.ceil(filtrados.length / filasPorPagina);

  // Reiniciar a página 1 cuando cambie la búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // 📌 Obtener datos del backend
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/solicitudes");
        const data = await response.json();
        const raw = data?.docs ?? [];

        // Normalización de datos
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

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Lista de Solicitudes</h1>
      {/*Buscador */}
      <div className="mb-3 mt-5">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por código, material, solicitante o área..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/*Tabla */}
      <table className="table table-striped table-bordered table-responsive">
        <thead className="table-dark text-center">
          <tr>
            <th>Código Artículo</th>
            <th>Material</th>
            <th>Cantidad</th>
            <th>Solicitante</th>
            <th>Área</th>
            <th>Servicios</th>
            <th>Descripción</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {filasActuales.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center">
                No hay solicitudes que coincidan
              </td>
            </tr>
          ) : (
            filasActuales.map(
              ({ material, solicitante, servicios, descripcionProblema, fechaSolicitud, key }) => (
                <tr key={key}>
                  <td>{material.codigoArticulo ? material.codigoArticulo.codigoArticulo : "N/A"}</td>
                  <td>{material.nombreArticulo}</td>
                  <td>{material.cantidad}</td>
                  <td>{solicitante?.nombreSolicitante}</td>
                  <td>{solicitante?.areaSolicitante}</td>
                  <td>{(servicios || []).join(", ")}</td>
                  <td>{descripcionProblema}</td>
                  <td>{fechaSolicitud ? new Date(fechaSolicitud).toLocaleDateString() : "N/A"}</td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
      {/*Paginación */}
      <nav>
        <ul className="pagination justify-content-start">
          <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPaginaActual(paginaActual - 1)}>
              Anterior
            </button>
          </li>

          {[...Array(totalPaginas)].map((_, i) => (
            <li key={i} className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPaginaActual(paginaActual + 1)}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ListaSolicitudes;
