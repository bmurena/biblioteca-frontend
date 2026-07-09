import { useEffect, useState } from "react";
import api from "../services/api";

function Libros() {
  const [libros, setLibros] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    anio: "",
    editorial: "",
    disponibilidad: true,
    costoPrestamo: "",
  });

  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    const respuesta = await api.get("/libros");
    setLibros(respuesta.data);
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const guardarLibro = async (e) => {
    e.preventDefault();

    await api.post("/libros", {
      ...form,
      anio: Number(form.anio),
      costoPrestamo: Number(form.costoPrestamo),
    });

    setForm({
      titulo: "",
      autor: "",
      anio: "",
      editorial: "",
      disponibilidad: true,
      costoPrestamo: "",
    });

    cargarLibros();
  };

  const eliminarLibro = async (id) => {
    await api.delete(`/libros/${id}`);
    cargarLibros();
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Libros</h2>
          <p>Registro y control de libros disponibles.</p>
        </div>
      </div>

      <div className="form-card">
        <h5>Nuevo libro</h5>

        <form onSubmit={guardarLibro} className="form-grid">
          <input name="titulo" value={form.titulo} onChange={manejarCambio} placeholder="Título" required />
          <input name="autor" value={form.autor} onChange={manejarCambio} placeholder="Autor" required />
          <input name="anio" value={form.anio} onChange={manejarCambio} placeholder="Año" type="number" required />
          <input name="editorial" value={form.editorial} onChange={manejarCambio} placeholder="Editorial" required />
          <input name="costoPrestamo" value={form.costoPrestamo} onChange={manejarCambio} placeholder="Costo préstamo" type="number" step="0.01" required />

          <label className="checkbox-field">
            <input type="checkbox" name="disponibilidad" checked={form.disponibilidad} onChange={manejarCambio} />
            Disponible
          </label>

          <button className="btn btn-dark">Guardar libro</button>
        </form>
      </div>

      <div className="card mt-4">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Año</th>
              <th>Editorial</th>
              <th>Estado</th>
              <th>Costo</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {libros.map((libro) => (
              <tr key={libro.id}>
                <td>{libro.titulo}</td>
                <td>{libro.autor}</td>
                <td>{libro.anio}</td>
                <td>{libro.editorial}</td>
                <td>{libro.disponibilidad ? "Disponible" : "Prestado"}</td>
                <td>${libro.costoPrestamo}</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarLibro(libro.id)}>
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

export default Libros;