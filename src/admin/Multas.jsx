import { useEffect, useState } from "react";
import api from "../services/api";

function Multas() {
  const [prestamos, setPrestamos] = useState([]);
  const [valoresMulta, setValoresMulta] = useState({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const cargarPrestamos = async () => {
    try {
      const respuesta = await api.get("/prestamos");

      setPrestamos(respuesta.data);

      const valoresIniciales = {};

      respuesta.data.forEach((prestamo) => {
        valoresIniciales[prestamo.id] = prestamo.multaAcumulada;
      });

      setValoresMulta(valoresIniciales);
    } catch {
      setError("No se pudieron cargar las multas.");
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (id, valor) => {
    setValoresMulta({
      ...valoresMulta,
      [id]: valor,
    });
  };

  const actualizarMulta = async (prestamo) => {
    const nuevaMulta = Number(valoresMulta[prestamo.id]);

    if (Number.isNaN(nuevaMulta) || nuevaMulta < 0) {
      setError("Ingrese una multa válida.");
      setMensaje("");
      return;
    }

    try {
      await api.patch(`/prestamos/${prestamo.id}`, {
        multaAcumulada: nuevaMulta,
      });

      setMensaje("Multa actualizada correctamente.");
      setError("");

      await cargarPrestamos();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se pudo actualizar la multa."
      );
      setMensaje("");
    }
  };

  const prestamosConMulta = prestamos.filter(
    (prestamo) => Number(prestamo.multaAcumulada) > 0
  );

  const totalMultas = prestamos.reduce(
    (total, prestamo) =>
      total + Number(prestamo.multaAcumulada),
    0
  );

  if (cargando) {
    return <p>Cargando multas...</p>;
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h2>Multas</h2>
          <p>Consulta y administración de multas por retrasos.</p>
        </div>
      </div>

      {mensaje && (
        <div className="mensaje-exito">{mensaje}</div>
      )}

      {error && (
        <div className="mensaje-error">{error}</div>
      )}

      <div className="stats-grid multas-resumen">
        <div className="stat-card">
          <span>Préstamos con multa</span>
          <strong>{prestamosConMulta.length}</strong>
        </div>

        <div className="stat-card">
          <span>Total acumulado</span>
          <strong>${totalMultas.toFixed(2)}</strong>
        </div>
      </div>

      <div className="card mt-4">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Libro</th>
                <th>Fecha máxima</th>
                <th>Estado</th>
                <th>Multa</th>
                <th className="text-end">Acción</th>
              </tr>
            </thead>

            <tbody>
              {prestamos.map((prestamo) => (
                <tr key={prestamo.id}>
                  <td>{prestamo.usuario?.nombre}</td>

                  <td>
                    {prestamo.libros
                      ?.map(
                        (detalle) => detalle.libro.titulo
                      )
                      .join(", ")}
                  </td>

                  <td>
                    {new Date(
                      prestamo.fechaMaxDevolucion
                    ).toLocaleDateString("es-EC")}
                  </td>

                  <td>{prestamo.estado}</td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={valoresMulta[prestamo.id] ?? 0}
                      onChange={(e) =>
                        manejarCambio(
                          prestamo.id,
                          e.target.value
                        )
                      }
                      className="input-multa"
                    />
                  </td>

                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        actualizarMulta(prestamo)
                      }
                    >
                      Guardar multa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Multas;