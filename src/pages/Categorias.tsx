

const Categorias = () => {
  return (
    <>
        <div className="container mt-4">
            <h1>Categorías</h1>
            <hr />
            <form action="">
                <div className="row">
                    <div className="col-sm-4">
                        <label htmlFor="id" className="form-label">ID</label>
                        <input type="text" className="form-control" id="id" />
                    </div>
                    <div className="col-sm-4">
                        <label htmlFor="nombreCategoria" className="form-label">Nombre categoria</label>
                        <input type="text" className="form-control" id="nombreCategoria" />
                    </div>
                    <div className="col-sm-4">
                        <input type="submit" className="btn btn-primary" value="Agregar" id="agregarCategoria" />
                    </div>
                </div>
            </form>
            <div className="card mt-4 text-start sm-6">
                <div className="card-body">
                    <div className="card-title">Lista de Categorías</div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Materiales</td>
                                <td>Todo lo relacionado con materiales</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Servicios</td>
                                <td>Servicios generales</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
  )
}

export default Categorias