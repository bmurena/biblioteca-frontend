import { useEffect, useState } from "react";
import api from "../services/api";

function Catalogo() {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [documentoGarantia, setDocumentoGarantia] = useState("CEDULA");
  const [enviando, setEnviando] = useState(false);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    try {
      const respuesta = await api.get("/libros");
      setLibros(respuesta.data);
    } catch {
      alert("No se pudieron cargar los libros.");
    } finally {
      setCargando(false);
    }
  };

  const calcularCosto = (costo) => {
    if (usuario.rol === "PROFESOR") {
      return 0;
    }

    if (usuario.rol === "ESTUDIANTE") {
      return costo * 0.5;
    }

    return costo;
  };

  const textoBeneficio = () => {
    if (usuario.rol === "PROFESOR") {
      return "Préstamo gratuito para profesores.";
    }

    if (usuario.rol === "ESTUDIANTE") {
      return "Descuento del 50% para estudiantes.";
    }

    return "Costo normal del préstamo.";
  };

  const abrirSolicitud = (libro) => {
    setLibroSeleccionado(libro);
    setDocumentoGarantia("CEDULA");
  };

  const cerrarSolicitud = () => {
    if (!enviando) {
      setLibroSeleccionado(null);
    }
  };

  const confirmarPrestamo = async () => {
    if (!libroSeleccionado) return;

    setEnviando(true);

    try {
      await api.post("/prestamos/solicitar", {
        usuarioId: usuario.id,
        libroId: libroSeleccionado.id,
        documentoGarantia,
      });

      alert("Préstamo realizado correctamente.");

      setLibroSeleccionado(null);
      await cargarLibros();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "No se pudo realizar el préstamo."
      );
    } finally {
      setEnviando(false);
    }
  };

  const librosFiltrados = libros.filter((libro) => {
    const texto = busqueda.toLowerCase();

    return (
      libro.titulo.toLowerCase().includes(texto) ||
      libro.autor.toLowerCase().includes(texto) ||
      libro.editorial.toLowerCase().includes(texto) ||
      String(libro.anio).includes(texto)
    );
  });

  if (cargando) {
    return <p>Cargando catálogo...</p>;
  }

  return (
    <section>
      <div className="cliente-page-header">
        <h1>Catálogo de libros</h1>
        <p>
          Bienvenido, {usuario.nombre}. {textoBeneficio()}
        </p>
      </div>

      <input
        className="buscador-libros"
        type="text"
        placeholder="Buscar por título, autor, editorial o año..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {librosFiltrados.length === 0 ? (
        <div className="empty-state">
          <h3>No se encontraron libros</h3>
          <p>Prueba con otra búsqueda.</p>
        </div>
      ) : (
        <div className="catalogo-grid">
          {librosFiltrados.map((libro) => {
            const costoFinal = calcularCosto(libro.costoPrestamo);

            return (
              <article className="libro-card" key={libro.id}>
                <div className="libro-card-body">
                  <h2>{libro.titulo}</h2>

                  <p>
                    <strong>Autor:</strong> {libro.autor}
                  </p>

                  <p>
                    <strong>Editorial:</strong> {libro.editorial}
                  </p>

                  <p>
                    <strong>Año:</strong> {libro.anio}
                  </p>

                  <p>
                    <strong>Precio normal:</strong>{" "}
                    ${Number(libro.costoPrestamo).toFixed(2)}
                  </p>

                  <p>
                    <strong>Costo para usted:</strong>{" "}
                    ${costoFinal.toFixed(2)}
                  </p>

                  <span
                    className={
                      libro.disponibilidad
                        ? "estado-libro disponible"
                        : "estado-libro prestado"
                    }
                  >
                    {libro.disponibilidad
                      ? "Disponible"
                      : "Prestado"}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!libro.disponibilidad}
                  onClick={() => abrirSolicitud(libro)}
                >
                  {libro.disponibilidad
                    ? "Solicitar préstamo"
                    : "No disponible"}
                </button>
              </article>
            );
          })}
        </div>
      )}

      {libroSeleccionado && (
        <div className="modal-fondo" onClick={cerrarSolicitud}>
          <div
            className="modal-prestamo"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Confirmar préstamo</h2>

            <div className="modal-datos">
              <p>
                <strong>Libro:</strong> {libroSeleccionado.titulo}
              </p>

              <p>
                <strong>Autor:</strong> {libroSeleccionado.autor}
              </p>

              <p>
                <strong>Costo final:</strong> $
                {calcularCosto(
                  libroSeleccionado.costoPrestamo
                ).toFixed(2)}
              </p>

              <p>
                <strong>Plazo:</strong> 10 días
              </p>
            </div>

            <label className="campo-modal">
              Documento de garantía

              <select
                value={documentoGarantia}
                onChange={(e) =>
                  setDocumentoGarantia(e.target.value)
                }
              >
                <option value="CEDULA">Cédula</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="LICENCIA">Licencia</option>
                <option value="CARNET_ESTUDIANTIL">
                  Carnet estudiantil
                </option>
              </select>
            </label>

            <div className="modal-acciones">
              <button
                type="button"
                className="btn-cancelar"
                onClick={cerrarSolicitud}
                disabled={enviando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-confirmar"
                onClick={confirmarPrestamo}
                disabled={enviando}
              >
                {enviando ? "Procesando..." : "Confirmar préstamo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Catalogo;