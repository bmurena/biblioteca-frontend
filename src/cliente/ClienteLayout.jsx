import { Outlet } from "react-router-dom";
import ClienteSidebar from "./ClienteSidebar";

function ClienteLayout({ usuario, setUsuario }) {

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <div className="cliente-layout">

      <ClienteSidebar
        usuario={usuario}
        cerrarSesion={cerrarSesion}
      />

      <main className="cliente-content">
        <Outlet />
      </main>

    </div>
  );
}

export default ClienteLayout;