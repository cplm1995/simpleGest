"use client";

import { useEffect, useState } from "react";
import { FaLock, FaRightToBracket, FaUser } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiFetch } from "../utils/apiFetch";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Manejar cambios en los inputs
  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //  Quitar scroll solo en la pantalla de login
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  // Manejar el inicio de sesión
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Validación correcta
      if (!data.token || !data.user) {
        toast.error("Respuesta inválida del servidor");
        return;
      }

      // Guardar info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(
        `Bienvenido ${data.user.nombrecompleto || data.user.username}!`
      );

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      console.error("Error en login:", error);
      toast.error("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="login-container">
          {/*  Panel Izquierdo */}
          <div className="left-panel">
            <div className="logo text-center">
              <img
                src="/logo2.png"
                width="60%"
                height="60%"
                alt="Logo SimpleGest"
                className="mb-3"
              />
            </div>
          </div>

          {/*  Panel Derecho */}
          <div className="right-panel col-sm-6 text-center">
            <form
              className="login-form d-flex flex-column justify-content-center"
              onSubmit={handleSubmitForm}
            >
              <h2 className="mb-4">Iniciar sesión</h2>

              {/* Usuario */}
              <div className="input-group mb-3">
                <span className="input-group-text bg-white">
                  <FaUser className="text-primary" />
                </span>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={form.username}
                  onChange={handleChangeForm}
                  placeholder="Ingrese su usuario"
                  required
                />
              </div>

              {/* Contraseña */}
              <div className="input-group mb-3">
                <span className="input-group-text bg-white">
                  <FaLock className="text-primary" />
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChangeForm}
                  placeholder="Ingrese su contraseña"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-outline-primary mt-3"
                id="login-btn"
                disabled={loading}
              >
                <FaRightToBracket className="me-2" />
                {loading ? "Cargando..." : "Entrar"}
              </button>
            </form>

            <ToastContainer position="top-right" autoClose={4000} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
