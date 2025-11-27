import { useEffect, useState, type Key } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaRegFloppyDisk, FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { apiFetch } from "../utils/apiFetch";

interface Articulo {
  _id?: string; // importante para editar/eliminar
  [x: string]: Key | null | undefined;
  codigoArticulo: string;
  tipoRegistro: string;
  nombreArticulo: string;
  descripcion: string;
  stock: number;
}

const Registro = () => {
  const [tipoRegistro, setTipoRegistro] = useState("");
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 5;

  //  Filtrar resultados
  const filtrados = articulos.filter((articulo) => {
    const query = busqueda.toLowerCase();
    return (
      articulo.codigoArticulo?.toLowerCase().includes(query) ||
      articulo.nombreArticulo?.toLowerCase().includes(query) ||
      articulo.descripcion?.toLowerCase().includes(query) ||
      articulo.tipoRegistro?.toLowerCase().includes(query)
    );
  });

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/dashboard"); // redirige al Dashboard
  };

  //  Paginación
  const indiceUltimaFila = paginaActual * filasPorPagina;
  const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
  const filasActuales = filtrados.slice(indicePrimeraFila, indiceUltimaFila);
  const totalPaginas = Math.ceil(filtrados.length / filasPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // Cargar artículos al iniciar
  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const data = await apiFetch("/api/articulos");
        setArticulos(data);
      } catch (error) {
        console.error("Error al obtener los artículos:", error);
      }
    };
    fetchArticulos();
  }, []);

  const [datosRegistro, setDatosRegistro] = useState({
    tipoRegistro: "",
    codigoArticulo: "",
    nombreArticulo: "",
    descripcion: "",
    stock: "",
  });

  //  Guardar o actualizar artículo
  const handleGuardarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editandoId) {
        const updatedArticulo = await apiFetch(`/api/articulos/${editandoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosRegistro),
        });

        toast.success("Artículo actualizado correctamente");

        setArticulos((prev) =>
          prev.map((a) => (a._id === editandoId ? updatedArticulo : a))
        );

        setEditandoId(null);
      } else {
        // CREAR
        const newArticulo = await apiFetch("/api/articulos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosRegistro),
        });

        toast.success("Artículo guardado correctamente");

        setArticulos((prev) => [...prev, newArticulo]);
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar los datos");
    }
  };

  //Editar (cargar datos al formulario)
  const handleEditar = (articulo: Articulo) => {
    setDatosRegistro({
      tipoRegistro: articulo.tipoRegistro,
      codigoArticulo: articulo.codigoArticulo,
      nombreArticulo: articulo.nombreArticulo,
      descripcion: articulo.descripcion,
      stock: articulo.stock.toString(),
    });
    toast.info("Artículo seleccionado para editar");
    setTipoRegistro(articulo.tipoRegistro);
    setEditandoId(articulo._id || null);
  };

  // Eliminar artículo
  const handleEliminar = (id: string | undefined) => {
    if (!id) return;

    toast.info(
      <div>
        <p>¿Seguro que quieres eliminar este artículo?</p>
        <div className="mt-2 d-flex justify-content-end">
          <button
            className="btn btn-sm btn-danger me-2"
            onClick={async () => {
              try {

                toast.dismiss(); // cerrar confirmación
                toast.warning("Artículo eliminado correctamente");

                setArticulos((prev) => prev.filter((a) => a._id !== id));
              } catch (error) {
                console.error(error);
                toast.error("Error al eliminar artículo");
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

  const datosRegistroArticulosChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ): void => {
    setDatosRegistro({
      ...datosRegistro,
      [e.target.name]: e.target.value,
    });
  };

  const limpiarFormulario = () => {
    setDatosRegistro({
      tipoRegistro: "",
      codigoArticulo: "",
      nombreArticulo: "",
      descripcion: "",
      stock: "",
    });
    setTipoRegistro("");
  };

  return (
    <>
      <div className="container mt-5">
        <h1>Registro</h1>
        {/*Formulario */}
        <form onSubmit={handleGuardarDatos}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-4">
                  <label htmlFor="tipoRegistro" className="form-label">
                    Tipo de registro <span className="text-danger">*</span>
                  </label>
                  <select
                    id="tipoRegistro"
                    className="form-select"
                    name="tipoRegistro"
                    value={tipoRegistro}
                    onChange={(e) => {
                      setTipoRegistro(e.target.value);
                      datosRegistroArticulosChange(e);
                    }}
                    required
                  >
                    <option value="">[Seleccione]</option>
                    <option value="Material">Material</option>
                    <option value="Herramienta">Herramienta</option>
                  </select>
                </div>
                <div className="col-sm-4">
                  <label htmlFor="codigoArticulo" className="form-label">
                    ID artículo <span className="text-danger">*</span>
                  </label>
                  <input
                    id="codigoArticulo"
                    type="text"
                    className="form-control"
                    name="codigoArticulo"
                    value={datosRegistro.codigoArticulo}
                    onChange={datosRegistroArticulosChange}
                    required
                  />
                </div>
                <div className="col-sm-4">
                  <label htmlFor="nombreArticulo" className="form-label">
                    Nombre artículo <span className="text-danger">*</span>
                  </label>
                  <input
                    id="nombreArticulo"
                    type="text"
                    className="form-control"
                    name="nombreArticulo"
                    value={datosRegistro.nombreArticulo}
                    onChange={datosRegistroArticulosChange}
                    required
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-sm-4">
                  <label htmlFor="descripcion" className="form-label">
                    Descripción
                  </label>
                  <input
                    id="descripcion"
                    type="text"
                    className="form-control"
                    name="descripcion"
                    value={datosRegistro.descripcion}
                    onChange={datosRegistroArticulosChange}
                  />
                </div>
                <div className="col-sm-4">
                  <label htmlFor="stock" className="form-label">
                    Cantidad <span className="text-danger">*</span>
                  </label>
                  <input
                    id="stock"
                    type="number"
                    className="form-control"
                    name="stock"
                    value={datosRegistro.stock}
                    onChange={datosRegistroArticulosChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="text-end mb-3">
              <button
                type="submit"
                className="btn btn-primary m-3"
                id="btnGeneral"
              >
                <FaRegFloppyDisk
                  style={{ marginRight: "5px", marginTop: -3 }}
                />{" "}
                {editandoId ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                id="btnGeneralCancelar"
                className="btn btn-secondary m-3"
                onClick={handleCancel}
              >
                <FaXmark style={{ marginRight: "5px", marginTop: -3 }} />{" "}
                Cancelar
              </button>
            </div>
          </div>
        </form>

        {/* Buscador */}
        <div className="mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Tabla */}
        <div className="table-responsive mt-4">
          <table className="table table-striped mt-4 text-center">
            <thead className="table-dark">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filasActuales.length === 0 ? (
                <tr>
                  <td colSpan={6}>No hay artículos</td>
                </tr>
              ) : (
                filasActuales.map((articulo, idx) => (
                  <tr key={idx}>
                    <td>{articulo.codigoArticulo}</td>
                    <td>{articulo.nombreArticulo}</td>
                    <td>{articulo.descripcion}</td>
                    <td>{articulo.tipoRegistro}</td>
                    <td>{articulo.stock}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditar(articulo)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleEliminar(articulo._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Registro;
