import { useEffect, useState, type Key } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Articulo {
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
    const [mensaje, setMensaje] = useState("");

    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const filasPorPagina = 5;

    // 🔎 Filtrar resultados por búsqueda
    const filtrados = articulos.filter((articulo) => {
        const query = busqueda.toLowerCase();
        return (
            articulo.codigoArticulo.toLowerCase().includes(query) ||
            articulo.nombreArticulo.toLowerCase().includes(query) ||
            articulo.descripcion.toLowerCase().includes(query) ||
            articulo.tipoRegistro.toLowerCase().includes(query)
        );
    });

    // 📌 Paginación con base en resultados filtrados
    const indiceUltimaFila = paginaActual * filasPorPagina;
    const indicePrimeraFila = indiceUltimaFila - filasPorPagina;
    const filasActuales = filtrados.slice(indicePrimeraFila, indiceUltimaFila);
    const totalPaginas = Math.ceil(filtrados.length / filasPorPagina);

    // Reiniciar a página 1 cuando cambie la búsqueda
    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda]);

    // Montamos la lista de articulos al cargar el componente
    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/articulos");
                const data = await response.json();
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
        stock: ""
    });

    const handleGuardarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/articulos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosRegistro),
            });
            if (!response.ok) {
                throw new Error("Error al guardar los datos");
            }

            const data = await response.json();
            console.log("Datos guardados:", data);

            // Actualizamos lista de productos en pantalla
            setArticulos((prev) => [...prev, data]);
            limpiarFormulario();
            setMensaje("Datos guardados correctamente");
        } catch (error) {
            console.error(error);
            setMensaje("Error al guardar los datos");
        }
    };

    const datosRegistroArticulosChange = (
        e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>
    ): void => {
        setDatosRegistro({
            ...datosRegistro,
            [e.target.name]: e.target.value,
        });
    };

    // limpiar formulario
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
                <p>Esta es la página de registro.</p>
                {mensaje && <p className="alert alert-info mt-3">{mensaje}</p>}
                <form onSubmit={handleGuardarDatos}>
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-4">
                                    <label htmlFor="tipoRegistro" className="form-label">
                                        Tipo de registro
                                    </label>
                                    <select
                                        className="form-select"
                                        id="tipoRegistro"
                                        name="tipoRegistro"
                                        value={tipoRegistro}
                                        onChange={(e) => {
                                            setTipoRegistro(e.target.value);
                                            datosRegistroArticulosChange(e);
                                        }}
                                    >
                                        <option value="">[Seleccione uno de la lista]</option>
                                        <option value="Material">Material</option>
                                        <option value="Herramienta">Herramienta</option>
                                    </select>
                                </div>
                                <div className="col-sm-4">
                                    <label htmlFor="codigoArticulo" className="form-label">
                                        ID articulo
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="codigoArticulo"
                                        name="codigoArticulo"
                                        value={datosRegistro.codigoArticulo}
                                        onChange={datosRegistroArticulosChange}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <label htmlFor="nombreArticulo" className="form-label">
                                        Nombre articulo{" "}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombreArticulo"
                                        name="nombreArticulo"
                                        value={datosRegistro.nombreArticulo}
                                        onChange={datosRegistroArticulosChange}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-sm-4">
                                    <label htmlFor="descripcion" className="form-label">
                                        Descripción
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="descripcion"
                                        name="descripcion"
                                        value={datosRegistro.descripcion}
                                        onChange={datosRegistroArticulosChange}
                                    />
                                </div>
                                <div className="col-sm-4">
                                    <label htmlFor="stock" className="form-label">
                                        Cantidad
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="stock"
                                        name="stock"
                                        value={datosRegistro.stock}
                                        onChange={datosRegistroArticulosChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="botones__registro text-end mb-3">
                            <button type="submit" className="btn btn-primary m-3">
                                Guardar
                            </button>
                            <button type="button" className="btn btn-secondary m-3">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
                {/* 🔍 Buscador */}
                <div className="mt-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por código, nombre, descripción o tipo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {/* 📋 Tabla */}
                <table className="table table-responsive table-striped mt-4 text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>Codigo Artículo</th>
                            <th>Nombre Artículo</th>
                            <th>Descripción</th>
                            <th>Tipo de Artículo</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filasActuales.length === 0 ? (
                            <tr>
                                <td colSpan={6}>No hay artículos que coincidan</td>
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
                                        <button className="btn btn-sm btn-warning me-2">
                                            <FaEdit />
                                        </button>
                                        <button className="btn btn-sm btn-danger">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* 📌 Paginación */}
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
                                <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}

                        <li
                            className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}
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
                <footer>
                    <p className="text-center mt-5">
                        &copy; 2024 SimpleGest. Todos los derechos reservados.
                    </p>
                </footer>
            </div>
        </>
    );
};

export default Registro;
