import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

function AdminLayout({ usuario, setUsuario }) {
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        usuario={usuario}
        cerrarSesion={cerrarSesion}
      />

      <div className="admin-main">
        <AdminNavbar usuario={usuario} />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;