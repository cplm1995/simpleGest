import React, { useEffect, useState } from "react";
import { FaRegFloppyDisk } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiFetch } from "../utils/apiFetch";

interface PrestamoItem {
  _id?: string;
  codigoPrestamo: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  cantidad: number;
  nombre: string;
  entregado: "Si" | "No";
  articulo: string;
}

const Prestamo: React.FC<{ actualizarResumen?: () => void }> = ({
  actualizarResumen,
}) => {
  // Estado del formulario
  const [prestamo, setPrestamo] = useState<PrestamoItem>({
    codigoPrestamo: "",
    fechaPrestamo: "",
    articulo: "",
    cantidad: 0,
    fechaDevolucion: "",
    nombre: "",
    entregado: "No",
  });

  // Lista de préstamos
  const [prestamos, setPrestamos] = useState<PrestamoItem[]>([]);

  // Búsqueda y paginación
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 5;

  // Cargar préstamos (CORREGIDO)
  const fetchPrestamos = async () => {
    try {
      const data = await apiFetch("/api/prestamos"); // construye URL con VITE_API_URL
      const ordenados = data.docs
        ? data.docs.reverse()
        : Array.isArray(data)
        ? data.reverse()
        : [];
      setPrestamos(ordenados);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar préstamos");
    }
  };

  useEffect(() => {
    fetchPrestamos();
  }, []);

  // Inputs
  const datosPrestamoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPrestamo({
      ...prestamo,
      [name]: name === "cantidad" ? Number(value) : value,
    });
  };

  // Guardar préstamo (CORREGIDO)
  const handleGuardarClick = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const nuevoPrestamo = await apiFetch("/api/prestamos", {
        method: "POST",
        body: JSON.stringify(prestamo),
      });

      toast.success("Préstamo guardado");

      const data = await nuevoPrestamo.json(); // Parse the response to get the actual PrestamoItem
      setPrestamos((prev) => [data, ...prev]);
      limpiarFormulario();

      actualizarResumen?.();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar");
    }
  };

  // Reset form
  const limpiarFormulario = () => {
    setPrestamo({
      codigoPrestamo: "",
      fechaPrestamo: "",
      fechaDevolucion: "",
      nombre: "",
      articulo: "",
      cantidad: 0,
      entregado: "No",
    });
  };

  // Manejar checkbox (CORREGIDO)
  const handleCheckboxChange = async (id?: string) => {
    if (!id) return;

    const prestamoActual = prestamos.find((p) => p._id === id);
    if (!prestamoActual) return;

    const actualizado: PrestamoItem = {
      ...prestamoActual,
      entregado: prestamoActual.entregado === "Si" ? "No" : "Si",
      fechaDevolucion:
        prestamoActual.entregado === "Si"
          ? ""
          : new Date().toLocaleDateString("es-CO"),
    };

    // Actualizar UI al instante
    setPrestamos((prev) => prev.map((p) => (p._id === id ? actualizado : p)));

    try {
      await apiFetch(`/api/prestamos/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          entregado: actualizado.entregado,
          fechaDevolucion: actualizado.fechaDevolucion,
        }),
      });

      toast.success("Préstamo actualizado");

      actualizarResumen?.();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar");

      // rollback
      fetchPrestamos();
    }
  };

  // Filtrar
  const filtrados = prestamos.filter((p) => {
    const q = busqueda.toLowerCase();
    return (
      (p.codigoPrestamo || "").toLowerCase().includes(q) ||
      (p.fechaPrestamo || "").toLowerCase().includes(q) ||
      (p.fechaDevolucion || "").toLowerCase().includes(q) ||
      (p.articulo || "").toLowerCase().includes(q) ||
      (p.cantidad?.toString() || "").includes(q) ||
      (p.nombre || "").toLowerCase().includes(q)
    );
  });

  // Paginación
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
  const filasActuales = filtrados.slice(indicePrimeraFila, indiceUltimaFila);
  const totalPaginas = Math.ceil(filtrados.length / filasPorPagina) || 1;

  useEffect(() => setPaginaActual(1), [busqueda]);

  return (
    <>
      <div className="container-sm mt-5 text-center">

        {/* Formulario */}
        <div className="card">
          <div className="card-body shadow-sm">
            <div className="card-title text-start fw-bold">
              Nueva solicitud de préstamo
            </div>
            <div className="card-text mt-5">
              <form onSubmit={handleGuardarClick}>
                <div className="row text-start">
                  <div className="col-sm-4">
                    <label htmlFor="codigoPrestamo" className="form-label">
                      Código de préstamo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="codigoPrestamo"
                      name="codigoPrestamo"
                      value={prestamo.codigoPrestamo}
                      onChange={datosPrestamoChange}
                      required
                      placeholder="Ejemplo: M001"
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="articulo">Artículo</label>
                    <input
                      value={prestamo.articulo}
                      onChange={datosPrestamoChange}
                      name="articulo"
                      className="form-control mt-2"
                      id="articulo"
                      type="text"
                      required
                      placeholder="Ejemplo: Monitor LG 24''"
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="cantidad">Cantidad</label>
                    <input
                      type="number"
                      value={prestamo.cantidad}
                      onChange={datosPrestamoChange}
                      name="cantidad"
                      className="form-control mt-2"
                      id="cantidad"
                      required
                      placeholder="Cantidad"
                    />
                  </div>
                </div>
                <div className="row text-start mt-3">
                  <div className="col-sm-4">
                    <label htmlFor="fechaPrestamo" className="form-label">
                      Fecha de préstamo
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="fechaPrestamo"
                      name="fechaPrestamo"
                      value={prestamo.fechaPrestamo}
                      onChange={datosPrestamoChange}
                      required
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="nombre" className="form-label">
                      Nombre del solicitante
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={prestamo.nombre}
                      onChange={datosPrestamoChange}
                      required
                      placeholder="Ejemplo: Juan Pérez"
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-sm-12 text-end">
                    <button
                      type="submit"
                      id="btnGeneral"
                      className="btn btn-md btn-outline-primary"
                    >
                      <FaRegFloppyDisk
                        style={{ marginRight: "5px", marginTop: -3 }}
                      />{" "}
                      Guardar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Lista */}
        <h2 className="mt-5">Lista de Solicitudes</h2>
        <input
          type="text"
          placeholder="Buscar..."
          className="form-control mb-3 shadow-sm"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <table className="table table-striped table-responsive shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Código</th>
              <th>Fecha de préstamo</th>
              <th>Artículo</th>
              <th>Cantidad</th>
              <th>Nombre</th>
              <th>Entregado</th>
              <th>Fecha devolución</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filasActuales.length === 0 ? (
              <tr>
                <td colSpan={8}>No hay solicitudes</td>
              </tr>
            ) : (
              filasActuales.map((p) => (
                <tr key={p._id}>
                  <td>{1 + filtrados.indexOf(p)}</td>
                  <td>{p.codigoPrestamo}</td>
                  <td>{new Date(p.fechaPrestamo).toLocaleDateString()}</td>
                  <td>{p.articulo}</td>
                  <td>{p.cantidad}</td>
                  <td>{p.nombre}</td>
                  <td>{p.entregado}</td>
                  <td>{p.fechaDevolucion}</td>
                  <td>
                    <input
                      type="checkbox"
                      disabled={p.entregado === "Si"}
                      checked={p.entregado === "Si"}
                      onChange={() => handleCheckboxChange(p._id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-secondary me-2"
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(paginaActual - 1)}
          >
            Anterior
          </button>
          <span className="align-self-center">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            className="btn btn-secondary ms-2"
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(paginaActual + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default Prestamo;
