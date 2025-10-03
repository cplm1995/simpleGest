"use client";

import { useEffect, useState } from "react";
import { FaLock, FaRightToBracket, FaUser } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Manejo de cambios en inputs
  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //Quitar scroll solo en login
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  // Manejo de submit
  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error desconocido");
      }

      console.log("Usuario logueado correctamente", data);

      // Guardar token
      localStorage.setItem("token", data.token);

      // Guardar datos del usuario (para mostrar en la barra)
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.user?.username || form.username,
          rol: data.user?.rol || "usuario",
        })
      );

      // Mostrar mensaje de éxito
      toast.success(
        "Login exitoso, bienvenido " +
        (data.user?.username || form.username)
      );

      // Redirigir al Dashboard después de 1 segundo
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      toast.error("No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="login-container">
          {/* Panel Izquierdo */}
          <div className="left-panel">
            <div className="logo">
              <div className="logo-form">
                <img
                  src="/logo2.png"
                  width={"60%"}
                  height={"60%"}
                  alt="Logo SimpleGest"
                />
              </div>
            </div>
          </div>

          {/* Panel Derecho */}
          <div className="right-panel col-sm-6 text-center">
            <form
              className="login-form d-flex flex-column justify-content-center"
              onSubmit={handleSubmitForm}
            >
              <h2>Iniciar sesión</h2>

              {/* Usuario */}
              <div className="input-group mb-3">
                <span className="input-group-text bg-white">
                  <FaUser className="text-primary" />
                </span>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  name="username"
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
                  id="password"
                  className="form-control"
                  name="password"
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
