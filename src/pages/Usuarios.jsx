import { useEffect, useState } from "react";
import api from "../services/api";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

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
    const respuesta = await api.get("/usuarios");
    setUsuarios(respuesta.data);
  };

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (editandoId) {
      const datos = { ...form };

      if (!datos.password) {
        delete datos.password;
      }

      await api.patch(`/usuarios/${editandoId}`, datos);
    } else {
      await api.post("/usuarios", form);
    }

    limpiarFormulario();
    cargarUsuarios();
  };

  const editarUsuario = (usuario) => {
    setEditandoId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol,
    });
  };

  const eliminarUsuario = async (id) => {
    const confirmar = confirm("¿Desea eliminar este usuario?");
    if (!confirmar) return;

    await api.delete(`/usuarios/${id}`);
    cargarUsuarios();
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

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Usuarios</h2>
          <p>Administración de usuarios registrados.</p>
        </div>
      </div>

      <div className="form-card">
        <h5>{editandoId ? "Editar usuario" : "Nuevo usuario"}</h5>

        <form onSubmit={guardarUsuario} className="form-grid">
          <input
            name="nombre"
            value={form.nombre}
            onChange={manejarCambio}
            placeholder="Nombre"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={manejarCambio}
            placeholder="Correo"
            type="email"
            required
          />

          <input
            name="password"
            value={form.password}
            onChange={manejarCambio}
            placeholder={editandoId ? "Nueva contraseña (opcional)" : "Contraseña"}
            required={!editandoId}
          />

          <select name="rol" value={form.rol} onChange={manejarCambio}>
            <option value="CLIENTE">Cliente</option>
            <option value="ESTUDIANTE">Estudiante</option>
            <option value="PROFESOR">Profesor</option>
            <option value="BIBLIOTECARIO">Bibliotecario</option>
            <option value="ADMIN">Administrador</option>
          </select>

          <div className="form-actions">
          <button type="submit" className="btn btn-dark">
          {editandoId ? "Guardar cambios" : "Guardar usuario"}
        </button>

         {editandoId && (
         <button type="button" className="btn btn-outline-secondary" onClick={limpiarFormulario}>
         Cancelar
        </button>
          )}
        </div>
        </form>
      </div>

      <div className="card mt-4">
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
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => editarUsuario(usuario)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => eliminarUsuario(usuario.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Usuarios;