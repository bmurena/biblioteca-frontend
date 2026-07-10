import { NavLink } from "react-router-dom";

function ClienteSidebar({ usuario, cerrarSesion }) {

  return (
    <aside className="sidebar">

      <h2 className="sidebar-title">
        Biblioteca
      </h2>

      <nav className="sidebar-nav">

        <NavLink to="/">
          Catálogo
        </NavLink>

        <NavLink to="/mis-prestamos">
          Mis préstamos
        </NavLink>

      </nav>

      <div style={{ marginTop: "auto" }}>

        <p
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          {usuario.nombre}
          <br />
          {usuario.rol}
        </p>

        <button
          className="logout-btn"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>

      </div>

    </aside>
  );
}

export default ClienteSidebar;