import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";

function Inicio() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="home-page">
      <NavbarCliente />
      <main
        style={{
          padding: isMobile ? "90px 16px" : "90px 64px",
          background: "#fffaf3",
          minHeight: "80vh",
        }}
      >
        <div className="section-heading">
          <span>Mi área</span>
          <h2>Bienvenido a PetBoutique</h2>
          <p>Gestiona tus mascotas, reservas y servicios desde aquí.</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "24px",
            marginTop: "40px",
          }}
        >
          <Link
            to="/mis-mascotas"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="extra-service-card">
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>🐾</div>
              <h3>Mis Mascotas</h3>
              <p>Gestiona el perfil de tus mascotas.</p>
            </div>
          </Link>
          <Link
            to="/mis-reservas"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="extra-service-card">
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>📅</div>
              <h3>Mis Reservas</h3>
              <p>Consulta y gestiona tus reservas.</p>
            </div>
          </Link>
          <Link
            to="/reservar"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="extra-service-card">
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>✨</div>
              <h3>Nueva Reserva</h3>
              <p>Reserva un servicio para tu mascota.</p>
            </div>
          </Link>
          <Link
            to="/servicios"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="extra-service-card">
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>🏥</div>
              <h3>Servicios</h3>
              <p>Consulta todos nuestros servicios disponibles.</p>
            </div>
          </Link>
          <Link
            to="/tienda"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="extra-service-card">
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>🛒</div>
              <h3>Tienda</h3>
              <p>Productos de calidad para tu mascota.</p>
            </div>
          </Link>
          <Link
            to="/mis-pedidos"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="extra-service-card">
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>📦</div>
              <h3>Mis Pedidos</h3>
              <p>Consulta el historial de tus compras.</p>
            </div>
          </Link>
          <Link
            to="/mi-perfil"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="extra-service-card">
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>👤</div>
              <h3>Mi Perfil</h3>
              <p>Edita tus datos personales.</p>
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Inicio;
