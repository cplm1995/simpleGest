import { useEffect, useState, useCallback } from "react";
import { FaBox, FaChartLine, FaCheckToSlot, FaFileLines, FaRotate } from "react-icons/fa6";

interface Articulo {
  _id: string;
  nombreArticulo: string;
  descripcion?: string;
  stock: number;
}

interface User {
  nombrecompleto: string;
  username: string;
  email?: string;
  rol?: string;
}

const Dashboard = () => {
  const [resumen, setResumen] = useState({
    totalArticulos: 0,
    totalSolicitudes: 0,
    prestamosPendientes: 0,
    entregados: 0,
  });

  const [bajoStock, setBajoStock] = useState<Articulo[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const UMBRAL_MINIMO = 5;

  // cargar resumen
  const fetchResumen = useCallback(async () => {
    try {
      const response = await fetch(
        "http://simplegest.com:3000/api/dashboard/resumen"
      );
      if (!response.ok) throw new Error("Error en la petición");
      const data = await response.json();
      setResumen(data);
    } catch (error) {
      console.error("Error al cargar resumen:", error);
    }
  }, []);

  // cargar artículos y filtrar próximos a agotarse
  const fetchArticulos = useCallback(async () => {
    try {
      const response = await fetch("http://simplegest.com:3000/api/articulos");
      if (!response.ok) throw new Error("Error al cargar artículos");
      const data = await response.json();
      const proximos = data.filter((a: Articulo) => a.stock <= UMBRAL_MINIMO);
      setBajoStock(proximos);
    } catch (error) {
      console.error("Error al cargar artículos:", error);
    }
  }, []);

  useEffect(() => {
    fetchResumen();
    fetchArticulos();

    // Recuperar usuario de localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [fetchResumen, fetchArticulos]);

  return (
    <>
      <div className="container mt-5 dashboard-background">

        {/*Bienvenida al usuario logeado */}
        {user && (
          <div className="alert alert-info mb-3 text-center">
            Bienvenido<b style={{ marginLeft: 10 }}>{user.nombrecompleto}</b>
          </div>
        )}

        <div className="row text-center g-3">
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm" style={{ border: 'none' }}>
              <div className="card-body">
                <h5 className="card-title text-success" ><FaBox style={{ color: 'green', marginRight: 10 }} /> Artículos</h5>
                <p className="card-text fs-4 fw-bold text-success">{resumen.totalArticulos}</p>
                <a href="/registro" className="btn btn-success btn-sm">Ver artículos</a>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm" style={{ border: 'none' }}>
              <div className="card-body">
                <h5 className="card-title text-warning"> <FaFileLines style={{ color: '#ffcc00', marginRight: 10 }} /> Solicitudes</h5>
                <p className="card-text fs-4 fw-bold text-warning">{resumen.totalSolicitudes}</p>
                <a href="/lista-solicitudes" className="btn btn-warning btn-sm">Gestionar</a>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm" style={{ border: 'none' }}>
              <div className="card-body">
                <h5 className="card-title text-danger"><FaRotate style={{ color: 'red', marginRight: 10,  }} /> Préstamos Pendientes</h5>
                <p className="card-text fs-4 fw-bold text-danger">{resumen.prestamosPendientes}</p>
                <a href="/prestamos" className="btn btn-danger btn-sm">Revisar</a>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm" style={{ border: 'none' }}>
              <div className="card-body">
                <h5 className="card-title text-primary">
                  <FaCheckToSlot style={{ color: 'blue', marginRight: 10 }} /> Préstamos Entregados
                </h5>
                <p className="card-text fs-4 fw-bold text-primary">{resumen.entregados}</p>
                <a href="/prestamos" className="btn btn-primary btn-sm">Ver entregados</a>
              </div>
            </div>
          </div>
        </div>
        {/*Sección de artículos con bajo stock */}
        <div className="mt-4">
          <h4><FaChartLine style={{ marginRight: 10 }} /> Artículos próximos a agotarse</h4>
          {bajoStock.length === 0 ? (
            <p className="text-success"><FaCheckToSlot style={{ fontSize: 25, marginRight: 10 }} />Todos los artículos tienen stock suficiente</p>
          ) : (
            <table className="table table-sm table-hover mt-3">
              <thead>
                <tr>
                  <th>Artículo</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {bajoStock.map((art) => (
                  <tr key={art._id} className={art.stock === 0 ? "table-danger" : "table-warning"}>
                    <td>{art.nombreArticulo} - {art.descripcion || "Sin descripción"}</td>
                    <td>{art.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <img src="/simpleGest.png" className="img-fluid" alt="" id="imgDash" />
      </div>
    </>
  );
};

export default Dashboard;
