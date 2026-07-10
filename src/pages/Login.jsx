import { useState } from "react";
import api from "../services/api";

function Login({ setUsuario }) {
  const [registrando, setRegistrando] = useState(false);

  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("CLIENTE");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "usuario",
        JSON.stringify(res.data.usuario)
      );

      setUsuario(res.data.usuario);
    } catch {
      setError("Correo o contraseña incorrectos");
    }
  };

  const registrar = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    try {
      await api.post("/auth/register", {
        nombre,
        email,
        password,
        rol,
      });

      setMensaje("Usuario registrado correctamente.");

      setRegistrando(false);

      setNombre("");
      setEmail("");
      setPassword("");
      setRol("CLIENTE");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo registrar."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Sistema de Biblioteca</h2>

        {!registrando ? (
          <>
            <p>Inicie sesión para continuar</p>

            <form onSubmit={iniciarSesion}>

              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <p className="error">{error}</p>}

              {mensaje && (
                <p style={{ color: "green" }}>
                  {mensaje}
                </p>
              )}

              <button type="submit">
                Ingresar
              </button>

            </form>

            <p
              style={{
                marginTop: 20,
                textAlign: "center",
              }}
            >
              ¿No tienes cuenta?
            </p>

            <button
              onClick={() => {
                setRegistrando(true);
                setError("");
                setMensaje("");
              }}
            >
              Registrarse
            </button>
          </>
        ) : (
          <>
            <p>Crear una cuenta</p>

            <form onSubmit={registrar}>

              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
                required
              />

              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <select
                value={rol}
                onChange={(e) =>
                  setRol(e.target.value)
                }
              >
                <option value="CLIENTE">
                  Cliente
                </option>

                <option value="ESTUDIANTE">
                  Estudiante
                </option>

                <option value="PROFESOR">
                  Profesor
                </option>
              </select>

              {error && <p className="error">{error}</p>}

              {mensaje && (
                <p style={{ color: "green" }}>
                  {mensaje}
                </p>
              )}

              <button type="submit">
                Crear cuenta
              </button>

            </form>

            <p
              style={{
                marginTop: 20,
                textAlign: "center",
              }}
            >
              ¿Ya tienes una cuenta?
            </p>

            <button
              onClick={() => {
                setRegistrando(false);
                setError("");
                setMensaje("");
              }}
            >
              Iniciar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;