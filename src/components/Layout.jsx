import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ usuario, setUsuario }) {

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <div className="app-layout">

      <Sidebar
        usuario={usuario}
        cerrarSesion={cerrarSesion}
      />

      <div className="main-area">

        <Navbar usuario={usuario} />

        <main className="content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default Layout;