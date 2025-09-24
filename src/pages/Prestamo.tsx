import React, { useEffect, useState } from "react";

interface Prestamo {
  codigoPrestamo: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  nombre: string;
  entregado: string;
  articulo: string;
}

function Prestamo() {
  // 📌 Estado para el formulario (un solo préstamo)
  const [prestamo, setPrestamo] = useState<Prestamo>({
    codigoPrestamo: "",
    fechaPrestamo: "",
    articulo: "",
    fechaDevolucion: "",
    nombre: "",
    entregado: "",
  });

  // 📌 Estado para la lista de préstamos
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 5;

  // 🔎 Filtrar resultados
  const filtrados = prestamos.filter((p) => {
    const query = busqueda.toLowerCase();
    return (
      p.codigoPrestamo.toLowerCase().includes(query) ||
      p.fechaPrestamo.toLowerCase().includes(query) ||
      p.articulo.toLowerCase().includes(query) ||
      p.nombre.toLowerCase().includes(query)
    );
  });

  // 📌 Paginación
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
  const filasActuales = filtrados.slice(indicePrimeraFila, indiceUltimaFila);
  const totalPaginas = Math.ceil(filtrados.length / filasPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const datosPrestamoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setPrestamo({
      ...prestamo,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardarClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/prestamos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prestamo), // 👈 enviar el objeto, no la interfaz
      });

      if (!response.ok) {
        throw new Error("Error al guardar los datos");
      }

      const data = await response.json();
      console.log("Datos guardados:", data);

      // Agregar el nuevo préstamo a la lista
      setPrestamos([...prestamos, data]);

      alert("Datos guardados correctamente");
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert("Error al guardar los datos");
    }
  };

  const limpiarFormulario = () => {
    setPrestamo({
      codigoPrestamo: "",
      fechaPrestamo: "",
      fechaDevolucion: "",
      nombre: "",
      entregado: "",
      articulo: "",
    });
  };

  return (
    <>
      <div className="container-sm mt-5 text-center">
        <h1>Prestamo</h1>
        <hr />
        <br />
        <div className="card">
          <div className="card-body shadow">
            <div className="card-title text-start fw-bold">
              Nueva solicitud de prestamo
            </div>
            <div className="card-text mt-5">
              <form onSubmit={handleGuardarClick}>
                <div className="row text-start">
                  <div className="col-sm-6">
                    <label htmlFor="codigoPrestamo" className="form-label">
                      Código de prestamo
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
                  <div className="col-sm-6">
                    <label htmlFor="articulo">Articulo</label>
                    <input
                      value={prestamo.articulo}
                      onChange={datosPrestamoChange}
                      name="articulo"
                      className="form-control mt-2"
                      id="articulo"
                    />
                  </div>
                </div>

                <div className="row text-start mt-3">
                  <div className="col-sm-6">
                    <label htmlFor="fechaPrestamo" className="form-label">
                      Fecha de prestamo
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
                  <div className="col-sm-6">
                    <label htmlFor="fechaDevolucion">Fecha devolución</label>
                    <input
                      type="date"
                      name="fechaDevolucion"
                      className="form-control mt-2"
                      id="fechaDevolucion"
                      value={prestamo.fechaDevolucion}
                      onChange={datosPrestamoChange}
                    />
                  </div>
                </div>

                <div className="row text-start mt-3">
                  <div className="col-sm-6">
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
                  <div className="col-sm-6">
                    <label htmlFor="entregado" className="form-label">
                      ¿Entregado?
                    </label>
                    <select
                      className="form-select"
                      name="entregado"
                      value={prestamo.entregado}
                      onChange={datosPrestamoChange}
                    >
                      <option value="">[Seleccione]</option>
                      <option value="Si">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-sm-12 text-end">
                    <button type="submit" className="btn btn-primary">
                      Guardar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <br />
        <br />
        <h2>Lista de Solicitudes</h2>
        <input
          type="text"
          placeholder="Buscar..."
          className="form-control mb-3"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th>Código</th>
              <th>Fecha de préstamo</th>
              <th>Artículo</th>
              <th>Nombre</th>
              <th>Entregado</th>
            </tr>
          </thead>
          <tbody>
            {filasActuales.length === 0 ? (
              <tr>
                <td colSpan={5}>No hay solicitudes</td>
              </tr>
            ) : (
              filasActuales.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.codigoPrestamo}</td>
                  <td>{p.fechaPrestamo}</td>
                  <td>{p.articulo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.entregado}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 📌 Controles de paginación */}
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
      <br />
      <footer className="text-center">
        <h1>&copy; 2024 SimpleGest. Todos los derechos reservados.</h1>
      </footer>
    </>
  );
}

export default Prestamo;
