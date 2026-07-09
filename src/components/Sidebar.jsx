import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Biblioteca</div>

      <nav className="sidebar-nav">
        <NavLink to="/" end>
          Inicio
        </NavLink>

        <NavLink to="/usuarios">
          Usuarios
        </NavLink>

        <NavLink to="/libros">
          Libros
        </NavLink>

        <NavLink to="/prestamos">
          Préstamos
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;