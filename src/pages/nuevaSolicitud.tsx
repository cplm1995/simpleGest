import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { FaRegFloppyDisk, FaXmark } from "react-icons/fa6";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";

const NuevaSolicitud = () => {
  const [articulosDB, setArticulosDB] = useState<
    {
      _id: string;
      nombreArticulo: string;
      descripcion?: string;
      stock: number;
    }[]
  >([]);
  const [listaMateriales, setListaMateriales] = useState<
    {
      descripcion: string;
      codigoArticulo: string;
      material: string;
      cantidad: number;
    }[]
  >([]);

  const [datosMateriales, setDatosMateriales] = useState({
    codigoArticulo: "",
    material: "",
    descripcion: "",
    cantidad: 0,
  });

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/dashboard"); // redirige al Dashboard
  };

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        // apiFetch ya devuelve JSON, no Response
        const data = await apiFetch("/api/articulos");
        setArticulosDB(data);
      } catch (error) {
        console.error("Error al obtener los artículos:", error);
        toast.error("Error al obtener los artículos");
      }
    };
    fetchArticulos();
  }, []);

  // Agregar material
  const handleAgregarMaterial = () => {
    const { material, cantidad } = datosMateriales;

    if (!material || !cantidad) {
      toast.error("Debe escribir un material y una cantidad");
      return;
    }

    const texto = material.toLowerCase().trim();

    // Buscar coincidencia en inventario
    const articuloDB = articulosDB.find((a) => {
      const nombre = a.nombreArticulo.toLowerCase().trim();
      const descripcion = a.descripcion?.toLowerCase().trim() || "";
      const nombreCompleto = `${nombre} ${descripcion}`.trim();

      return (
        nombre.includes(texto) ||
        descripcion.includes(texto) ||
        nombreCompleto.includes(texto)
      );
    });

    console.log("Artículo encontrado:", articuloDB);

    if (!articuloDB) {
      toast.error("Material no encontrado en inventario");
      return;
    }

    if (cantidad > articuloDB.stock) {
      toast.error(`No hay suficiente stock para ${material}`);
      return;
    }

    const nuevoMaterial = {
      codigoArticulo: articuloDB._id,
      material: `${articuloDB.nombreArticulo} - ${articuloDB.descripcion}`,
      descripcion: articuloDB.descripcion || "",
      cantidad,
    };

    setListaMateriales([...listaMateriales, nuevoMaterial]);

    setDatosMateriales({
      codigoArticulo: "",
      material: "",
      descripcion: "",
      cantidad: 0,
    });

    toast.success(`${articuloDB.nombreArticulo} agregado a la lista`);
  };

  // Eliminar material
  const handleEliminarMaterial = (index: number) => {
    const nuevaLista = listaMateriales.filter((_, i) => i !== index);
    setListaMateriales(nuevaLista);
    toast.error(`eliminado a la lista`);
  };

  // Limpiar campos de material
  const limpiarCamposMaterial = () => {
    setDatosMateriales({
      codigoArticulo: "",
      material: "",
      descripcion: "",
      cantidad: 0,
    });
  };
  // Datos solicitante
  const [datosSolicitante, setDatosSolicitante] = useState({
    areaSolicitante: "",
    fechaSolicitud: "",
    torre: "",
    nombreSolicitante: "",
    piso: "",
    espacio: "",
    sedeAlterna: "",
    cualServicio: "",
    otroServicio: "",
  });

  // servicios
  const [serviciosSolicitados, setServiciosSolicitados] = useState<{
    servicios: string[];
    cual: string;
    descripcionProblema: string;
  }>({
    servicios: [],
    cual: "",
    descripcionProblema: "",
  });

  // Checkbox para servicios
  const handleServiciosChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    const { name } = e.target;

    const target = e.target as HTMLInputElement; // Cast to HTMLInputElement

    if (target.type === "checkbox") {
      setServiciosSolicitados((prev) => ({
        ...prev,
        servicios: target.checked
          ? [...prev.servicios, value]
          : prev.servicios.filter((servicio) => servicio !== value), // Use target.checked
      }));
    } else {
      // Para textareas o inputs de texto como 'cual' o 'descripcionProblema'
      setServiciosSolicitados((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Datos solicitante
  const datosSolicitanteChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault();
    setDatosSolicitante({
      ...datosSolicitante,
      [e.target.name]: e.target.value,
    });
  };

  // Guardar solicitud
  const guardarDatosSolicitante = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const datosFormulario = {
      ...datosSolicitante,
      ...serviciosSolicitados,
      materiales: listaMateriales.map((item) => ({
        codigoArticulo: item.codigoArticulo,
        cantidad: item.cantidad,
      })),
    };

    try {
      await apiFetch("/api/solicitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosFormulario),
      });

      toast.success("Datos guardados correctamente");

      // Limpiar campos al guardar
      setDatosSolicitante({
        areaSolicitante: "",
        fechaSolicitud: "",
        torre: "",
        nombreSolicitante: "",
        piso: "",
        espacio: "",
        sedeAlterna: "",
        cualServicio: "",
        otroServicio: "",
      });
      setServiciosSolicitados({
        servicios: [],
        cual: "",
        descripcionProblema: "",
      });
      setListaMateriales([]);
      limpiarCamposMaterial();
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      toast.error("Error al guardar los datos");
    }
  };

  return (
    <>
      <div className="container mt-5 text-center">
        <div className="card mt-4 text-start sm-6">
          <div className="card-body">
            <div className="card-title text-center fw-bold">
              Solicitud Servicio de Mantenimiento
            </div>
            {/* Aquí va TODO tu formulario: inputs, checkboxes, materiales, etc. */}
            <form onSubmit={guardarDatosSolicitante}>
              {/* Datos del solicitante */}
              <div className="row">
                <div className="col-sm-4">
                  <label htmlFor="areaSolicitante" className="form-label">
                    Aréa o centro solicitante{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="areaSolicitante"
                    required
                    name="areaSolicitante"
                    placeholder="Centro solicitante"
                    value={datosSolicitante.areaSolicitante}
                    onChange={datosSolicitanteChange}
                  />
                </div>
                <div className="col-sm-4">
                  <label htmlFor="fechaSolicitud" className="form-label">
                    Fecha de Solicitud <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control mb-1"
                    required
                    id="fechaSolicitud"
                    name="fechaSolicitud"
                    value={datosSolicitante.fechaSolicitud}
                    onChange={datosSolicitanteChange}
                  />
                </div>
                <div className="col-sm-4">
                  <label htmlFor="torre" className="form-label">
                    Torre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control mb-1"
                    id="torre"
                    name="torre"
                    placeholder="Ingrese número de torre"
                    value={datosSolicitante.torre}
                    onChange={datosSolicitanteChange}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-sm-4">
                  <label htmlFor="nombreSolicitante" className="form-label">
                    Nombre solicitante <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control mb-1"
                    id="nombreSolicitante"
                    name="nombreSolicitante"
                    placeholder="Nombre solicitante"
                    value={datosSolicitante.nombreSolicitante}
                    onChange={datosSolicitanteChange}
                  />
                </div>
                <div className="col-sm-4">
                  <label htmlFor="piso" className="form-label">
                    Piso <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="piso"
                    required
                    name="piso"
                    placeholder="Nombre"
                    value={datosSolicitante.piso}
                    onChange={datosSolicitanteChange}
                  />
                </div>
                <div className="col-sm-4">
                  <label htmlFor="piso" className="form-label">
                    Teléfono <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="telefono"
                    required
                    name="telefono"
                    placeholder="Teléfono"
                    value={datosSolicitante.piso}
                    onChange={datosSolicitanteChange}
                  />
                </div>
                <div className="col-sm-4">
                  <label htmlFor="espacio" className="form-label">
                    Espacio
                  </label>
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="espacio"
                    name="espacio"
                    placeholder="Nombre"
                    value={datosSolicitante.espacio}
                    onChange={datosSolicitanteChange}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-sm-4">
                  <label htmlFor="sedeAlterna" className="form-label">
                    Sede alterna
                  </label>
                  <input
                    type="text"
                    className="form-control mb-1"
                    id="sedeAlterna"
                    name="sedeAlterna"
                    placeholder="Sede alterna"
                    value={datosSolicitante.sedeAlterna}
                    onChange={datosSolicitanteChange}
                  />
                </div>
                <div className="form-check__otro col-sm-4">
                  <label htmlFor="cualServicio" className="form-label">
                    Otro
                  </label>
                  <input
                    type="radio"
                    id="otro"
                    name="otroServicio"
                    value="otroServicio"
                    checked={datosSolicitante.otroServicio === "otroServicio"}
                    onChange={datosSolicitanteChange}
                  />
                </div>
                {datosSolicitante.otroServicio === "otroServicio" && (
                  <div className="col-sm-4">
                    <label htmlFor="cualServicio" className="form-label">
                      Cual?
                    </label>
                    <input
                      type="text"
                      className="form-control mb-1"
                      id="cualServicio"
                      name="cualServicio"
                      placeholder="CualServicio?"
                      value={datosSolicitante.cualServicio}
                      onChange={datosSolicitanteChange}
                    />
                  </div>
                )}
              </div>
              <div className="alert alert-dark mt-3" role="alert">
                Servicio Solicitado
              </div>
              {/* Servicios */}
              <div className="row">
                <div className="col">
                  <div className="form-check__servicio">
                    <label htmlFor="mantenimiento" className="form-check-label">
                      Mantenimiento
                    </label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="mantenimiento"
                      value="Mantenimiento"
                      name="mantenimiento"
                      checked={serviciosSolicitados.servicios.includes(
                        "Mantenimiento"
                      )}
                      onChange={handleServiciosChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-check__servicio">
                    <label htmlFor="reparacion" className="form-check-label">
                      Reparación
                    </label>
                    <input
                      type="checkbox"
                      value="Reparación"
                      className="form-check-input"
                      id="reparacion"
                      name="reparacion"
                      checked={serviciosSolicitados.servicios.includes(
                        "Reparación"
                      )}
                      onChange={handleServiciosChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-check__servicio">
                    <label htmlFor="adecuacion" className="form-check-label">
                      Adecuación
                    </label>
                    <input
                      type="checkbox"
                      value="Adecuación"
                      className="form-check-input"
                      id="adecuacion"
                      name="adecuacion"
                      checked={serviciosSolicitados.servicios.includes(
                        "Adecuación"
                      )}
                      onChange={handleServiciosChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-check__servicio">
                    <label htmlFor="electrico" className="form-check-label">
                      Eléctrico
                    </label>
                    <input
                      type="checkbox"
                      value="Electrico"
                      className="form-check-input"
                      id="electrico"
                      name="electrico"
                      checked={serviciosSolicitados.servicios.includes(
                        "Electrico"
                      )}
                      onChange={handleServiciosChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-check__servicio">
                    <label htmlFor="plomeria" className="form-check-label">
                      Plomería
                    </label>
                    <input
                      type="checkbox"
                      value="Plomeria"
                      className="form-check-input"
                      id="plomeria"
                      name="plomeria"
                      checked={serviciosSolicitados.servicios.includes(
                        "Plomeria"
                      )}
                      onChange={handleServiciosChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-check__servicio">
                    <label htmlFor="albanil" className="form-check-label">
                      Albañilería
                    </label>
                    <input
                      type="checkbox"
                      value="Albanil"
                      className="form-check-input"
                      id="albanil"
                      name="albanil"
                      checked={serviciosSolicitados.servicios.includes(
                        "Albanil"
                      )}
                      onChange={handleServiciosChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-check__servicio">
                    <label htmlFor="pintura" className="form-check-label">
                      Pintura
                    </label>
                    <input
                      type="checkbox"
                      value="Pintura"
                      className="form-check-input"
                      id="pintura"
                      name="pintura"
                      checked={serviciosSolicitados.servicios.includes(
                        "Pintura"
                      )}
                      onChange={handleServiciosChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-check__servicio">
                    <label htmlFor="cerrajeria" className="form-check-label">
                      Cerrajería
                    </label>
                    <input
                      type="checkbox"
                      value="Cerrajeria"
                      className="form-check-input"
                      id="Cerrajeria"
                      name="cerrajeria"
                      checked={serviciosSolicitados.servicios.includes(
                        "Cerrajeria"
                      )}
                      onChange={handleServiciosChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-check__servicio">
                    <label htmlFor="carpinteria" className="form-check-label">
                      Carpintería
                    </label>
                    <input
                      type="checkbox"
                      value="Carpinteria"
                      className="form-check-input"
                      id="carpinteria"
                      name="carpinteria"
                      checked={serviciosSolicitados.servicios.includes(
                        "Carpinteria"
                      )}
                      onChange={handleServiciosChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-check__servicio">
                    <label
                      htmlFor="aireAcondicionado"
                      className="form-check-label"
                    >
                      Aire Acondicionado
                    </label>
                    <input
                      type="checkbox"
                      value="Aire acondicionado"
                      className="form-check-input"
                      id="aireAcondicionado"
                      name="aireAcondicionado"
                      checked={serviciosSolicitados.servicios.includes(
                        "Aire acondicionado"
                      )}
                      onChange={handleServiciosChange}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-check__servicio">
                    <label
                      htmlFor="otroSolicitado"
                      className="form-check-label"
                    >
                      Otro
                    </label>
                    <input
                      type="checkbox"
                      value="otroSolicitado"
                      className="form-check-input"
                      id="otroServicio"
                      name="otroSolicitado"
                      checked={serviciosSolicitados.servicios.includes(
                        "otroSolicitado"
                      )}
                      onChange={handleServiciosChange}
                    />
                  </div>
                </div>
                {/*Campo dinamico*/}
                {serviciosSolicitados.servicios.includes("otroSolicitado") && (
                  <div className="col">
                    <div className="form-check__servicio">
                      <label htmlFor="cual" className="form-check-label">
                        Cual?
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cual"
                        name="cual"
                        value={serviciosSolicitados.cual}
                        onChange={handleServiciosChange}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="alert alert-dark mt-3" role="alert">
                Descripción del servicio y motivos para la reparación
              </div>
              {/* Descripción del problema */}
              <div className="form-group">
                <label htmlFor="descripcionProblema" className="form-label">
                  Descripción <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  required
                  id="descripcionProblema"
                  name="descripcionProblema"
                  value={serviciosSolicitados.descripcionProblema}
                  onChange={handleServiciosChange}
                  rows={3}
                ></textarea>
              </div>
              <div className="alert alert-dark mt-3" role="alert">
                Materiales y herramientas a utilizar
              </div>

              {/* Selección de materiales */}
              <div className="row">
                <div className="form-group col-sm-6">
                  <label htmlFor="materialH" className="form-label">
                    Material <span className="text-danger">*</span>
                  </label>

                  {/*Mostrar input si el rol es usuario*/}
                  {user?.rol === "usuario" ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Escriba el nombre del material..."
                      title="Buscar"
                      value={datosMateriales.material}
                      onChange={(e) => {
                        const texto = e.target.value.toLocaleLowerCase().trim();

                        // Guarda lo que el usuario escribe
                        setDatosMateriales({
                          ...datosMateriales,
                          material: e.target.value,
                          descripcion: "",
                          codigoArticulo: "",
                        });

                        // Buscar coincidencia exacta por nombre
                        const articulo = articulosDB.find((a) =>{
                          const nombre = a.nombreArticulo.toLocaleLowerCase().trim();
                          const descripcion = a.descripcion?.toLocaleLowerCase().trim() || "";
                          const nombreCompleto = `${nombre} ${descripcion}`.trim();

                          return (
                            nombre === texto ||
                            descripcion === texto ||
                            nombreCompleto === texto
                          );
                        }
                        );
                        console.log("Articulo buscado:", articulo);
                        if (articulo) {
                          setDatosMateriales((prev) => ({
                            ...prev,
                            codigoArticulo: articulo._id,
                            descripcion: articulo.descripcion || "",
                          }));
                        }
                      }}
                    />
                  ) : (
                    /* AQUI DEJAS TU SELECT NORMAL PARA ADMIN */
                    <Select
                      id="materialH"
                      options={articulosDB.map((articulo) => ({
                        value: articulo._id,
                        label: articulo.nombreArticulo,
                        descripcion: articulo.descripcion,
                      }))}
                      isSearchable={true}
                      formatOptionLabel={(option: any) => (
                        <div>
                          <div style={{ fontWeight: "bold" }}>
                            {option.label}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {option.descripcion || "Sin descripción"}
                          </div>
                        </div>
                      )}
                      value={
                        datosMateriales.codigoArticulo
                          ? {
                              value: datosMateriales.codigoArticulo,
                              label: datosMateriales.material,
                              descripcion: datosMateriales.descripcion,
                            }
                          : null
                      }
                      onChange={(option) => {
                        const selected = articulosDB.find(
                          (a) => a._id === option?.value
                        );
                        setDatosMateriales({
                          ...datosMateriales,
                          codigoArticulo: option ? option.value : "",
                          material: selected?.nombreArticulo ?? "", // Asegúrate de que nombreArticulo no sea undefined
                          descripcion: selected?.descripcion ?? "",
                        });
                      }}
                      placeholder="Escriba para buscar..."
                      isClearable
                    />
                  )}
                </div>

                {/* Cantidad */}
                <div className="form-group col-sm-3">
                  <label htmlFor="cantidad" className="form-label">
                    Cantidad <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="cantidad"
                    name="cantidad"
                    value={datosMateriales.cantidad}
                    onChange={(e) =>
                      setDatosMateriales({
                        ...datosMateriales,
                        cantidad: Number(e.target.value),
                      })
                    }
                  />
                </div>

                {/* Botón guardar */}
                <div className="form-group col-sm-3 d-flex align-items-end">
                  <button
                    id="btnGeneral"
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleAgregarMaterial}
                  >
                    <FaPlusCircle
                      style={{ marginRight: "5px", marginTop: -3 }}
                    />{" "}
                    Agregar
                  </button>
                </div>
              </div>

              {/* Tabla de materiales */}
              <table className="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Cantidad</th>
                    <th className="no-print">Descripción</th>
                    <th className="no-print">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listaMateriales.map((item, index) => (
                    <tr key={index}>
                      <td>{item.material}</td>
                      <td>{item.cantidad}</td>
                      <td className="no-print">{item.descripcion}</td>
                      <td className="no-print">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleEliminarMaterial(index)}
                        >
                          <FaTrashAlt
                            style={{ marginRight: "1px", marginTop: -3 }}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <div className="botones d-grid gap-2 d-md-flex justify-content-md-end no-print">
                <button
                  type="submit"
                  id="btnGeneral"
                  className="btn btn-primary"
                >
                  <FaRegFloppyDisk
                    style={{ marginRight: "5px", marginTop: -3 }}
                  />
                  Registrar
                </button>
                <button
                  type="button"
                  id="btnGeneralCancelar"
                  className="btn btn-secondary"
                  onClick={() => handleCancel()}
                >
                  <FaXmark style={{ marginRight: "5px", marginTop: -3 }} />
                  Cancelar
                </button>
              </div>

              <br />
              <div className="card-footer text-center">
                <small className="text-muted">
                  Departamento de Mantenimiento
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default NuevaSolicitud;
