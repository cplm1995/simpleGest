import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PrestamoItem {
  _id?: string;
  codigoPrestamo: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  cantidad: number;
  nombre: string;
  entregado: "Sí" | "No";
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

  // Cargar préstamos
  const fetchPrestamos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/prestamos");
      if (!res.ok) throw new Error("Error al cargar");
      const data = await res.json();
      const ordenados = data.docs ? data.docs.reverse() : data.reverse();
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

  // Guardar préstamo
  const handleGuardarClick = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/prestamos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prestamo),
      });

      if (!response.ok) throw new Error("Error al guardar");

      const nuevoPrestamo = await response.json();
      toast.success("Préstamo guardado");

      setPrestamos((prev) => [nuevoPrestamo, ...prev]);
      limpiarFormulario();

      if (actualizarResumen) actualizarResumen();
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

  // Manejar checkbox
  const handleCheckboxChange = async (id?: string) => {
    if (!id) return;

    const prestamoActual = prestamos.find((p) => p._id === id);
    if (!prestamoActual) return;

    const actualizado: PrestamoItem = {
      ...prestamoActual,
      entregado: prestamoActual.entregado === "Sí" ? "No" : "Sí",
      fechaDevolucion:
        prestamoActual.entregado === "Sí"
          ? ""
          : new Date().toLocaleDateString("es-CO"),
    };

    setPrestamos((prev) =>
      prev.map((p) => (p._id === id ? actualizado : p))
    );

    try {
      await fetch(`http://localhost:3000/api/prestamos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entregado: actualizado.entregado,
          fechaDevolucion: actualizado.fechaDevolucion,
        }),
      });

      toast.success("Préstamo actualizado");
      if (actualizarResumen) actualizarResumen();
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
      (p.cantidad?.toString() || "").toLowerCase().includes(q) ||
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
      <div className="container mt-5 text-center">
        <h1>Préstamos</h1>
        <hr />

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
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-sm-12 text-end">
                    <button
                      type="submit"
                      className="btn btn-md btn-outline-primary"
                    >
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
          <thead>
            <tr>
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
                      disabled={p.entregado === "Sí"}
                      checked={p.entregado === "Sí"}
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
      <footer className="text-center mt-5 mb-3">
        &copy; {new Date().getFullYear()} Mi Aplicación de Préstamos
      </footer>
    </>
  );
};

export default Prestamo;
