import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const links = [
    { to: "/admin/dashboard", label: "Inicio" },
    { to: "/admin/reservas", label: "Reservas" },
    { to: "/admin/clientes", label: "Clientes" },
    { to: "/admin/productos", label: "Productos" },
    { to: "/admin/pedidos", label: "Pedidos" },
  ];

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
        {links.map((l) => (
          <Link key={l.to} to={l.to}>
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Acciones escritorio */}
      <div
        className="navbar__actions"
        style={{ display: window.innerWidth < 768 ? "none" : "flex" }}
      >
        <button className="btn btn-secondary" onClick={cerrarSesion}>
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
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuAbierto(false)}
              style={{
                fontWeight: "600",
                color: "#1f1f1f",
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
          <button
            className="btn btn-secondary"
            style={{ width: "100%" }}
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
}
