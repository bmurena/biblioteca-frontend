import { useEffect, useState } from "react";
import api from "../services/api";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "CLIENTE",
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const respuesta = await api.get("/usuarios");
      setUsuarios(respuesta.data);
    } catch {
      setError("No se pudieron cargar los usuarios.");
    }
  };

  const manejarCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setForm({
      nombre: "",
      email: "",
      password: "",
      rol: "CLIENTE",
    });
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    try {
      if (editandoId) {
        const datos = {
          nombre: form.nombre,
          email: form.email,
          rol: form.rol,
        };

        if (form.password.trim()) {
          datos.password = form.password;
        }

        await api.patch(`/usuarios/${editandoId}`, datos);
        setMensaje("Usuario actualizado correctamente.");
      } else {
        await api.post("/usuarios", form);
        setMensaje("Usuario creado correctamente.");
      }

      limpiarFormulario();
      await cargarUsuarios();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo guardar el usuario."
      );
    }
  };

  const editarUsuario = (usuario) => {
    setEditandoId(usuario.id);

    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol,
    });

    setMensaje("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const eliminarUsuario = async (usuario) => {
    const confirmar = window.confirm(
      `¿Está seguro de eliminar al usuario "${usuario.nombre}"?`
    );

    if (!confirmar) return;

    try {
      await api.delete(`/usuarios/${usuario.id}`);

      setMensaje("Usuario eliminado correctamente.");
      setError("");

      if (editandoId === usuario.id) {
        limpiarFormulario();
      }

      await cargarUsuarios();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo eliminar el usuario."
      );
    }
  };

  const mostrarRol = (rol) => {
    const nombres = {
      CLIENTE: "Cliente",
      ESTUDIANTE: "Estudiante",
      PROFESOR: "Profesor",
      BIBLIOTECARIO: "Bibliotecario",
      ADMIN: "Administrador",
    };

    return nombres[rol] || rol;
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Usuarios</h2>
          <p>Administración de cuentas y roles del sistema.</p>
        </div>
      </div>

      {mensaje && (
        <div className="mensaje-exito">{mensaje}</div>
      )}

      {error && (
        <div className="mensaje-error">{error}</div>
      )}

      <div className="form-card">
        <h5>
          {editandoId ? "Editar usuario" : "Nuevo usuario"}
        </h5>

        <form
          onSubmit={guardarUsuario}
          className="form-grid"
        >
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={manejarCambio}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={manejarCambio}
            required
          />

          <input
            type="password"
            name="password"
            placeholder={
              editandoId
                ? "Nueva contraseña (opcional)"
                : "Contraseña"
            }
            value={form.password}
            onChange={manejarCambio}
            required={!editandoId}
          />

          <select
            name="rol"
            value={form.rol}
            onChange={manejarCambio}
          >
            <option value="CLIENTE">Cliente</option>
            <option value="ESTUDIANTE">Estudiante</option>
            <option value="PROFESOR">Profesor</option>
            <option value="BIBLIOTECARIO">
              Bibliotecario
            </option>
            <option value="ADMIN">Administrador</option>
          </select>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-dark"
            >
              {editandoId
                ? "Guardar cambios"
                : "Crear usuario"}
            </button>

            {editandoId && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card mt-4">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4"
                  >
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <span className="rol-badge">
                        {mostrarRol(usuario.rol)}
                      </span>
                    </td>

                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() =>
                          editarUsuario(usuario)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          eliminarUsuario(usuario)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Usuarios;