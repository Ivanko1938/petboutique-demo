import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function Registro() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: telefono,
          password: password,
        }),
      });

      if (res.ok) {
        navigate("/login");
      } else {
        const data = await res.json();
        setError(
          typeof data.detail === "string"
            ? data.detail
            : "Error al registrarse",
        );
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d9cbbb",
    background: "#fffaf3",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "700",
    marginBottom: "8px",
  };

  return (
    <div className="home-page">
      <Navbar />
      <main
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "90px 16px" : "90px 64px",
          background: "#fffaf3",
        }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #eadfce",
            borderRadius: "28px",
            padding: isMobile ? "28px 20px" : "48px",
            width: "100%",
            maxWidth: "480px",
            boxShadow: "0 14px 36px rgba(0,0,0,0.05)",
          }}
        >
          <Link
            to="/"
            style={{
              color: "#8b7355",
              fontSize: "14px",
              fontWeight: "600",
              display: "block",
              marginBottom: "24px",
            }}
          >
            ← Volver al inicio
          </Link>
          <h2
            style={{
              fontSize: isMobile ? "24px" : "32px",
              marginBottom: "8px",
            }}
          >
            Crear cuenta
          </h2>
          <p style={{ color: "#666", marginBottom: "32px" }}>
            Únete a PetBoutique
          </p>
          {error && (
            <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Apellidos</label>
              <input
                type="text"
                placeholder="Tus apellidos"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Teléfono</label>
              <input
                type="tel"
                placeholder="Tu teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Contraseña</label>
              <input
                type="password"
                placeholder="Crea una contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Confirmar contraseña</label>
              <input
                type="password"
                placeholder="Repite la contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                fontSize: "16px",
              }}
            >
              Registrarse
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "24px", color: "#666" }}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" style={{ color: "#1f1f1f", fontWeight: "700" }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Registro;
