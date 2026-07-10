import { NavLink } from "react-router-dom";

function AdminSidebar({ usuario, cerrarSesion }) {
  const esAdministrador = usuario.rol === "ADMIN";

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-sidebar-title">
          Biblioteca
        </div>

        <div className="admin-user">
          <strong>{usuario.nombre}</strong>
          <span>
            {esAdministrador
              ? "Administrador"
              : "Bibliotecario"}
          </span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/" end>
            Inicio
          </NavLink>

          {esAdministrador && (
            <NavLink to="/usuarios">
              Usuarios
            </NavLink>
          )}

          <NavLink to="/libros">
            Libros
          </NavLink>

          <NavLink to="/prestamos">
            Préstamos y devoluciones
          </NavLink>

          <NavLink to="/multas">
            Multas
          </NavLink>
        </nav>
      </div>

      <button
        type="button"
        className="admin-logout"
        onClick={cerrarSesion}
      >
        Cerrar sesión
      </button>
    </aside>
  );
}

export default AdminSidebar;