import { NavLink } from "react-router-dom";

function Sidebar({ usuario, cerrarSesion }) {

  return (
    <aside className="sidebar">

      <div className="sidebar-title">
        Biblioteca
      </div>

      <nav className="sidebar-nav">

        <NavLink to="/" end>
          Inicio
        </NavLink>

        {(usuario.rol === "ADMIN" ||
          usuario.rol === "BIBLIOTECARIO") && (
          <>
            <NavLink to="/libros">
              Libros
            </NavLink>

            <NavLink to="/prestamos">
              Préstamos
            </NavLink>
          </>
        )}

        {usuario.rol === "ADMIN" && (
          <NavLink to="/usuarios">
            Usuarios
          </NavLink>
        )}

        {(usuario.rol === "CLIENTE" ||
          usuario.rol === "ESTUDIANTE" ||
          usuario.rol === "PROFESOR") && (
          <>
            <NavLink to="/libros">
              Catálogo
            </NavLink>

            <NavLink to="/prestamos">
              Mis préstamos
            </NavLink>
          </>
        )}

      </nav>

      <button
        className="logout-btn"
        onClick={cerrarSesion}
      >
        Cerrar sesión
      </button>

    </aside>
  );
}

export default Sidebar;