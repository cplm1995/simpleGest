"use client";

import { useState } from "react"
import { FaLock, FaRightToBracket, FaUser } from "react-icons/fa6";


const Login = () => {
    const [form, setForm] = useState({
        username: "",
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    //Manejo en los cambios de los input
    const hanleChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const hanleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);

        //Llamamos la api para iniciar sesión
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error desconocido');
            }

            console.log("Usuario logueado correctamente", data);

            //Guardar el token 
            localStorage.setItem('token', data.token);

            //Redirigimo al Dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            setError((err as Error).message);
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
                                <img src="../src/assets/img/logo2.png" width={"60%"} height={"60%"} alt="Logo SimpleGest" />
                            </div>
                        </div>
                    </div>
                    {/* Panel Derecho */}
                    <div className="right-panel col-sm-6 text-center">
                        <form className="login-form d-flex flex-column justify-content-center" onSubmit={hanleSubmitForm}>
                            <h2>Iniciar sesión</h2>

                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className="form-group">
                                <FaUser style={{
                                    position: "absolute",
                                    top: '1px',
                                    left: '150px',
                                    fontSize: '25px',
                                    transform: "translateY(-10%)",
                                    margin: '10px',
                                    color: '#3267f8ff'
                                }} />
                                <input
                                    type="text"
                                    id="username"
                                    className="form-control ps-5"
                                    name="username"
                                    value={form.username}
                                    onChange={hanleChangeForm}
                                    placeholder="Ingrese su usuario"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <FaLock style={{
                                    position: "absolute",
                                    top: '1px',
                                    left: '280px',
                                    fontSize: '25px',
                                    transform: "translateY(-10%)",
                                    margin: '10px',
                                    color: '#3267f8ff'
                                }} />
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    name="password"
                                    value={form.password}
                                    onChange={hanleChangeForm}
                                    placeholder="Ingrese su contraseña"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                                <FaRightToBracket style={{ marginRight: 5 }} />
                                {loading ? 'Cargando...' : 'Entrar'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
