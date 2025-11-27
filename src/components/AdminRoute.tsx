import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user || user.rol !== "admin") {
    return <Navigate to="/nueva-solicitud" replace />;
  }

  return children;
};
