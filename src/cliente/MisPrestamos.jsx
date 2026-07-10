import { useEffect, useState } from "react";
import api from "../services/api";

function MisPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      const respuesta = await api.get("/prestamos");

      const propios = respuesta.data.filter(
        (prestamo) => prestamo.usuarioId === usuario.id
      );

      setPrestamos(propios);
    } catch {
      setError("No se pudieron cargar los préstamos.");
    } finally {
      setCargando(false);
    }
  };

  const devolverPrestamo = async (id) => {
    const confirmar = window.confirm(
      "¿Desea devolver este libro?"
    );

    if (!confirmar) return;

    try {
      await api.patch(`/prestamos/${id}/devolver`);

      alert("Libro devuelto correctamente.");

      await cargarPrestamos();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "No se pudo devolver el libro."
      );
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-EC");
  };

  if (cargando) {
    return <p>Cargando préstamos...</p>;
  }

  return (
    <section>
      <div className="cliente-page-header">
        <div>
          <h1>Mis préstamos</h1>
          <p>Consulta los libros que has solicitado.</p>
        </div>
      </div>

      {error && <div className="mensaje-error">{error}</div>}

      {prestamos.length === 0 ? (
        <div className="empty-state">
          <h3>No tienes préstamos registrados</h3>
          <p>Los libros que solicites aparecerán en esta sección.</p>
        </div>
      ) : (
        <div className="prestamos-cliente-grid">
          {prestamos.map((prestamo) => (
            <article className="prestamo-cliente-card" key={prestamo.id}>
              <div className="prestamo-card-header">
                <h3>
                  {prestamo.libros
                    ?.map((detalle) => detalle.libro.titulo)
                    .join(", ")}
                </h3>

                <span
                  className={`estado-prestamo estado-${prestamo.estado.toLowerCase()}`}
                >
                  {prestamo.estado.replaceAll("_", " ")}
                </span>
              </div>

              <div className="prestamo-info">
                <p>
                  <strong>Fecha del préstamo:</strong>{" "}
                  {formatearFecha(prestamo.fechaPrestamo)}
                </p>

                <p>
                  <strong>Fecha máxima:</strong>{" "}
                  {formatearFecha(prestamo.fechaMaxDevolucion)}
                </p>

                <p>
                  <strong>Costo:</strong> $
                  {Number(prestamo.totalCosto).toFixed(2)}
                </p>

                <p>
                  <strong>Multa:</strong> $
                  {Number(prestamo.multaAcumulada).toFixed(2)}
                </p>

                {prestamo.fechaDevolucionAt && (
                  <p>
                    <strong>Devuelto el:</strong>{" "}
                    {formatearFecha(prestamo.fechaDevolucionAt)}
                  </p>
                )}

                {prestamo.estado === "ACTIVO" && (
                  <button
                    type="button"
                    className="btn-devolver"
                    onClick={() => devolverPrestamo(prestamo.id)}
                  >
                    Devolver libro
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MisPrestamos;