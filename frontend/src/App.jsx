import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/cliente/Login";
import Registro from "./pages/cliente/Registro";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReservas from "./pages/admin/AdminReservas";
import AdminClientes from "./pages/admin/AdminClientes";
import AdminProductos from "./pages/admin/AdminProductos";
import MisMascotas from "./pages/cliente/MisMascotas";
import Inicio from "./pages/cliente/Inicio";
import MisReservas from "./pages/cliente/MisReservas";
import Reservar from "./pages/cliente/Reservar";
import Servicios from "./pages/cliente/Servicios";
import Tienda from "./pages/cliente/Tienda";
import Producto from "./pages/cliente/Producto";
import Carrito from "./pages/cliente/Carrito";
import Checkout from "./pages/cliente/Checkout";
import MiPerfil from "./pages/cliente/MiPerfil";
import MisPedidos from "./pages/cliente/MisPedidos";
import AdminPedidos from "./pages/admin/AdminPedidos";
import CheckoutReserva from "./pages/cliente/CheckoutReserva";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/reservas" element={<AdminReservas />} />
      <Route path="/admin/clientes" element={<AdminClientes />} />
      <Route path="/admin/productos" element={<AdminProductos />} />
      <Route path="/mis-mascotas" element={<MisMascotas />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/mis-reservas" element={<MisReservas />} />
      <Route path="/reservar" element={<Reservar />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/tienda" element={<Tienda />} />
      <Route path="/producto/:id" element={<Producto />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/mi-perfil" element={<MiPerfil />} />
      <Route path="/mis-pedidos" element={<MisPedidos />} />
      <Route path="/admin/pedidos" element={<AdminPedidos />} />
      <Route path="/checkout-reserva" element={<CheckoutReserva />} />
    </Routes>
  );
}

export default App;
