import { useEffect, useState, useCallback } from "react";
import { FaBox, FaChartLine, FaCheckToSlot, FaFileLines, FaRotate } from "react-icons/fa6";
import { apiFetch } from "../utils/apiFetch";

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
      const data = await apiFetch(
        "/api/dashboard/resumen"
      );
      setResumen(data);
    } catch (error) {
      console.error("Error al cargar resumen:", error);
    }
  }, []);

  // cargar artículos y filtrar próximos a agotarse
  const fetchArticulos = useCallback(async () => {
    try {
      const data = await apiFetch("/api/articulos");
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
                <h5 className="card-title text-muted" ><FaBox style={{ color: 'gray', marginRight: 10 }} /> Artículos</h5>
                <p className="card-text fs-4 fw-bold text-muted">{resumen.totalArticulos}</p>
                <a href="/registro" className="btn btn-outline-secondary btn-sm w-100">Ver artículos</a>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm" style={{ border: 'none' }}>
              <div className="card-body">
                <h5 className="card-title text-muted"> <FaFileLines style={{ color: 'gray', marginRight: 10 }} /> Solicitudes</h5>
                <p className="card-text fs-4 fw-bold text-muted">{resumen.totalSolicitudes}</p>
                <a href="/autorizacion" className="btn btn-outline-secondary btn-sm w-100">Gestionar</a>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm" style={{ border: 'none' }}>
              <div className="card-body">
                <h5 className="card-title text-muted"><FaRotate style={{ color: 'gray', marginRight: 10,  }} /> Préstamos Pendientes</h5>
                <p className="card-text fs-4 fw-bold text-muted">{resumen.prestamosPendientes}</p>
                <a href="/prestamos" className="btn btn-outline-secondary btn-sm w-100">Revisar</a>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm" style={{ border: 'none' }}>
              <div className="card-body">
                <h5 className="card-title text-muted">
                  <FaCheckToSlot style={{ color: 'gray', marginRight: 10 }} /> Préstamos Entregados
                </h5>
                <p className="card-text fs-4 fw-bold text-muted">{resumen.entregados}</p>
                <a href="/prestamos" className="btn btn-outline-secondary btn-sm w-100">Ver entregados</a>
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
      </div>
    </>
  );
};

export default Dashboard;
