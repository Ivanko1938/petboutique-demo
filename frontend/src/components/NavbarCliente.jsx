import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavbarCliente() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="navbar" style={{ position: "relative" }}>
      <img
        src="/logo_petboutique_carles.png"
        alt="PetBoutique"
        style={{ height: "80px" }}
      />

      {/* Menú escritorio */}
      <nav
        className="navbar__menu"
        style={{ display: window.innerWidth < 768 ? "none" : "flex" }}
      >
        <Link to="/inicio">Inicio</Link>
        <Link to="/mis-mascotas">Mis mascotas</Link>
        <Link to="/mis-reservas">Mis reservas</Link>
        <Link to="/mis-pedidos">Mis pedidos</Link>
        <Link to="/tienda">Tienda</Link>
      </nav>

      {/* Acciones escritorio */}
      <div
        className="navbar__actions"
        style={{ display: window.innerWidth < 768 ? "none" : "flex" }}
      >
        <button
          className="btn btn-secondary"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Botón hamburguesa móvil */}
      {window.innerWidth < 768 && (
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          style={{
            background: "none",
            border: "none",
            fontSize: "28px",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          {menuAbierto ? "✕" : "☰"}
        </button>
      )}

      {/* Menú móvil desplegable */}
      {menuAbierto && window.innerWidth < 768 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            borderBottom: "1px solid #eadfce",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            zIndex: 1000,
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Link
            to="/inicio"
            onClick={() => setMenuAbierto(false)}
            style={{
              fontWeight: "600",
              color: "#1f1f1f",
              textDecoration: "none",
            }}
          >
            Inicio
          </Link>
          <Link
            to="/mis-mascotas"
            onClick={() => setMenuAbierto(false)}
            style={{
              fontWeight: "600",
              color: "#1f1f1f",
              textDecoration: "none",
            }}
          >
            Mis mascotas
          </Link>
          <Link
            to="/mis-reservas"
            onClick={() => setMenuAbierto(false)}
            style={{
              fontWeight: "600",
              color: "#1f1f1f",
              textDecoration: "none",
            }}
          >
            Mis reservas
          </Link>
          <Link
            to="/mis-pedidos"
            onClick={() => setMenuAbierto(false)}
            style={{
              fontWeight: "600",
              color: "#1f1f1f",
              textDecoration: "none",
            }}
          >
            Mis pedidos
          </Link>
          <Link
            to="/tienda"
            onClick={() => setMenuAbierto(false)}
            style={{
              fontWeight: "600",
              color: "#1f1f1f",
              textDecoration: "none",
            }}
          >
            Tienda
          </Link>
          <button
            className="btn btn-secondary"
            style={{ width: "100%" }}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}
