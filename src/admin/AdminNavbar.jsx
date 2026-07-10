function AdminNavbar({ usuario }) {
  return (
    <header className="admin-navbar">
      <div>
        <h1>Gestión de biblioteca</h1>

        <p>
          Administración de libros, usuarios y préstamos
        </p>
      </div>

      <div className="admin-navbar-user">
        <strong>{usuario.nombre}</strong>

        <span>
          {usuario.rol === "ADMIN"
            ? "Administrador"
            : "Bibliotecario"}
        </span>
      </div>
    </header>
  );
}

export default AdminNavbar;