import React, { forwardRef } from "react";

interface Props {
  autorizaciones: any[];
}

const ReporteAutorizaciones = forwardRef<HTMLDivElement, Props>(
  ({ autorizaciones }, ref) => {
    const td: React.CSSProperties = {
      border: "1px solid #ccc",
      padding: "6px 8px",
      fontSize: "12px",
      verticalAlign: "top",
    };

    const th: React.CSSProperties = {
      ...td,
      background: "#f2f2f2",
      fontWeight: "bold",
    };

    return (
      <div
        ref={ref}
        style={{
          padding: "30px",
          fontFamily: "Arial, sans-serif",
          color: "#333",
        }}
      >
        {/* ENCABEZADO */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img
            src="/simpleGest.png"
            alt="Logo"
            style={{ width: "90px", marginRight: "20px" }}
          />

          <div>
            <h2 style={{ margin: 0 }}>Reporte de Autorizaciones</h2>
            <p style={{ margin: 0, fontSize: "12px" }}>
              Generado el: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* TABLA */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr>
              {[
                "N°",
                "Solicitante",
                "Área",
                "Artículos",
                "Descripción",
                "Cantidad",
                "Fecha",
                "Estado",
              ].map((col) => (
                <th key={col} style={th}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {autorizaciones.map((a, index) => (
              <tr key={a._id}>
                <td style={td}>{index + 1}</td>

                {/* Solicitante */}
                <td style={td}>{a.nombreSolicitante}</td>

                {/* Área */}
                <td style={td}>{a.areaSolicitante}</td>

                {/* Artículos */}
                <td style={td}>
                  {a.materiales.map((m: any, i: number) => (
                    <div key={i}>
                      {typeof m.codigoArticulo === "string"
                        ? m.codigoArticulo
                        : m.codigoArticulo?.nombreArticulo ?? "—"}
                    </div>
                  ))}
                </td>

                {/* Descripción */}
                <td style={td}>
                  {a.materiales.map((m: any, i: number) => (
                    <div key={i}>
                      {typeof m.codigoArticulo === "object"
                        ? m.codigoArticulo?.descripcion
                        : "—"}
                    </div>
                  ))}
                </td>

                {/* Cantidad */}
                <td style={td}>
                  {a.materiales.map((m: any, i: number) => (
                    <div key={i}>{m.cantidad}</div>
                  ))}
                </td>

                {/* Fecha */}
                <td style={td}>
                  {new Date(a.fechaSolicitud).toLocaleDateString()}
                </td>

                {/* Estado */}
                <td style={td}>{a.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PIE DE PÁGINA PARA IMPRESIÓN */}
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            width: "100%",
            textAlign: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          Página <span className="pageNumber"></span> de{" "}
          <span className="totalPages"></span>
        </div>

        <style>
          {`
            @media print {
              @page {
                margin: 20mm;
              }

              .pageNumber:before {
                counter-increment: page;
                content: counter(page);
              }

              .totalPages:before {
                content: counter(pages);
              }
            }
          `}
        </style>
      </div>
    );
  }
);

export default ReporteAutorizaciones;
