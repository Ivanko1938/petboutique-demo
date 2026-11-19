import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
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
        <a href="#servicios-extra">Servicios</a>
        <a href="#como-funciona">Cómo funciona</a>
        <a href="#contacto">Contacto</a>
        <Link to="/tienda">Tienda</Link>
      </nav>

      {/* Acciones escritorio */}
      <div
        className="navbar__actions"
        style={{ display: window.innerWidth < 768 ? "none" : "flex" }}
      >
        <Link to="/login" className="btn btn-secondary">
          Acceso
        </Link>
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
          <a
            href="#servicios-extra"
            onClick={() => setMenuAbierto(false)}
            style={{
              fontWeight: "600",
              color: "#1f1f1f",
              textDecoration: "none",
            }}
          >
            Servicios
          </a>
          <a
            href="#como-funciona"
            onClick={() => setMenuAbierto(false)}
            style={{
              fontWeight: "600",
              color: "#1f1f1f",
              textDecoration: "none",
            }}
          >
            Cómo funciona
          </a>
          <a
            href="#contacto"
            onClick={() => setMenuAbierto(false)}
            style={{
              fontWeight: "600",
              color: "#1f1f1f",
              textDecoration: "none",
            }}
          >
            Contacto
          </a>
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
          <Link
            to="/login"
            className="btn btn-secondary"
            style={{ textAlign: "center" }}
            onClick={() => setMenuAbierto(false)}
          >
            Acceso
          </Link>
        </div>
      )}
    </header>
  );
}
