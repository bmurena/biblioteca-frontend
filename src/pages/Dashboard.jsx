import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const resUsuarios = await api.get("/usuarios");
    const resLibros = await api.get("/libros");
    const resPrestamos = await api.get("/prestamos");

    setUsuarios(resUsuarios.data);
    setLibros(resLibros.data);
    setPrestamos(resPrestamos.data);
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Inicio</h2>
          <p>Resumen general del sistema bibliotecario.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Usuarios</span>
          <strong>{usuarios.length}</strong>
        </div>

        <div className="stat-card">
          <span>Libros</span>
          <strong>{libros.length}</strong>
        </div>

        <div className="stat-card">
          <span>Préstamos</span>
          <strong>{prestamos.length}</strong>
        </div>

        <div className="stat-card">
          <span>Libros disponibles</span>
          <strong>{libros.filter((libro) => libro.disponibilidad).length}</strong>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;