import { useEffect, useState, useCallback } from "react";

const Dashboard = () => {
  const [resumen, setResumen] = useState({
    totalArticulos: 0,
    totalSolicitudes: 0,
    prestamosPendientes: 0,
    entregados: 0,
  });

  // 👇 función para actualizar resumen
  const fetchResumen = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/dashboard/resumen");
      if (!response.ok) throw new Error("Error en la petición");
      const data = await response.json();
      setResumen(data);
    } catch (error) {
      console.error("Error al cargar resumen:", error);
    }
  }, []);

  useEffect(() => {
    fetchResumen();
  }, [fetchResumen]);

  return (
    <>
      <div className="container mt-5">
        <div className="row text-center g-3">

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">📦 Artículos</h5>
                <p className="card-text fs-4 fw-bold">{resumen.totalArticulos}</p>
                <a href="/registro" className="btn btn-primary btn-sm">Ver artículos</a>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">📑 Solicitudes</h5>
                <p className="card-text fs-4 fw-bold">{resumen.totalSolicitudes}</p>
                <a href="/lista-solicitudes" className="btn btn-warning btn-sm">Gestionar</a>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">🔄 Prestamos Pendientes</h5>
                <p className="card-text fs-4 fw-bold">{resumen.prestamosPendientes}</p>
                <a href="/prestamos" className="btn btn-danger btn-sm">Revisar</a>
              </div>
            </div>
          </div>
        </div>

        <img src="../src/assets/img/logo1.png" className="img-fluid text-muted mt-1" alt="" />

      </div>
    </>
  );
};

export default Dashboard;
