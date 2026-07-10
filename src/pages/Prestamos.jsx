import { useEffect, useState } from "react";
import api from "../services/api";

function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);

  const [form, setForm] = useState({
    usuarioId: "",
    fechaMaxDevolucion: "",
    documentoGarantia: "",
    libroIds: [],
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const resPrestamos = await api.get("/prestamos");
    const resUsuarios = await api.get("/usuarios");
    const resLibros = await api.get("/libros");

    setPrestamos(resPrestamos.data);
    setUsuarios(resUsuarios.data);
    setLibros(resLibros.data);
  };

  const manejarCambio = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const manejarLibro = (id) => {
    if (form.libroIds.includes(id)) {
      setForm({
        ...form,
        libroIds: form.libroIds.filter((libroId) => libroId !== id),
      });
    } else {
      setForm({
        ...form,
        libroIds: [...form.libroIds, id],
      });
    }
  };

  const guardarPrestamo = async (e) => {
    e.preventDefault();

    await api.post("/prestamos", form);

    setForm({
      usuarioId: "",
      fechaMaxDevolucion: "",
      documentoGarantia: "",
      libroIds: [],
    });

    cargarDatos();
  };

  const devolverPrestamo = async (id) => {
    await api.patch(`/prestamos/${id}/devolver`);
    cargarDatos();
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Préstamos</h2>
          <p>Registro de préstamos y devoluciones.</p>
        </div>
      </div>

      <div className="form-card">
        <h5>Nuevo préstamo</h5>

        <form onSubmit={guardarPrestamo} className="form-grid">
          <select name="usuarioId" value={form.usuarioId} onChange={manejarCambio} required>
            <option value="">Seleccione un usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="fechaMaxDevolucion"
            value={form.fechaMaxDevolucion}
            onChange={manejarCambio}
            required
          />

          <select
           name="documentoGarantia"
          value={form.documentoGarantia}
          onChange={manejarCambio}
          required
          >
          <option value="">Seleccione un documento en garantía</option>
          <option value="CEDULA">Cédula de identidad</option>
          <option value="PASAPORTE">Pasaporte</option>
          <option value="LICENCIA">Licencia de conducir</option>
         <option value="CARNET_ESTUDIANTIL">Carnet estudiantil</option>
          </select>

          <div className="books-select">
            {libros
              .filter((libro) => libro.disponibilidad)
              .map((libro) => (
                <label key={libro.id}>
                  <input
                    type="checkbox"
                    checked={form.libroIds.includes(libro.id)}
                    onChange={() => manejarLibro(libro.id)}
                  />
                  {libro.titulo}
                </label>
              ))}
          </div>

          <button className="btn btn-dark">Guardar préstamo</button>
        </form>
      </div>

      <div className="card mt-4">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Libros</th>
              <th>Fecha préstamo</th>
              <th>Fecha máxima</th>
              <th>Estado</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {prestamos.map((prestamo) => (
              <tr key={prestamo.id}>
                <td>{prestamo.usuario?.nombre}</td>
                <td>
                  {prestamo.libros?.map((detalle) => detalle.libro.titulo).join(", ")}
                </td>
                <td>{new Date(prestamo.fechaPrestamo).toLocaleDateString()}</td>
                <td>{new Date(prestamo.fechaMaxDevolucion).toLocaleDateString()}</td>
                <td>{prestamo.estado}</td>
                <td>${prestamo.totalCosto}</td>
                <td>
                  {prestamo.estado === "ACTIVO" && (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => devolverPrestamo(prestamo.id)}>
                      Devolver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Prestamos;