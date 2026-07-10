import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Usuarios from "./admin/Usuarios";
import Libros from "./admin/Libros";
import Prestamos from "./admin/Prestamos";

import ClienteLayout from "./cliente/ClienteLayout";
import Catalogo from "./cliente/Catalogo";
import MisPrestamos from "./cliente/MisPrestamos";

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");

    if (guardado) {
      setUsuario(JSON.parse(guardado));
    }
  }, []);

  if (!usuario) {
    return <Login setUsuario={setUsuario} />;
  }

  const esAdmin =
    usuario.rol === "ADMIN" ||
    usuario.rol === "BIBLIOTECARIO";

  return (
    <BrowserRouter>

      <Routes>

        {esAdmin ? (

          <Route
            path="/"
            element={
              <AdminLayout
                usuario={usuario}
                setUsuario={setUsuario}
              />
            }
          >

            <Route index element={<Dashboard />} />

            {usuario.rol === "ADMIN" && (
              <Route
                path="usuarios"
                element={<Usuarios />}
              />
            )}

            <Route
              path="libros"
              element={<Libros />}
            />

            <Route
              path="prestamos"
              element={<Prestamos />}
            />

          </Route>

        ) : (

          <Route
            path="/"
            element={
              <ClienteLayout
                usuario={usuario}
                setUsuario={setUsuario}
              />
            }
          >

            <Route
              index
              element={<Catalogo />}
            />

            <Route
              path="mis-prestamos"
              element={<MisPrestamos />}
            />

          </Route>

        )}

        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;