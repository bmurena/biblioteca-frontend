import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Libros from "./pages/Libros";
import Prestamos from "./pages/Prestamos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="libros" element={<Libros />} />
          <Route path="prestamos" element={<Prestamos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;