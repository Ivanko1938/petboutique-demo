import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        },
      );

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", data.role);
        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/inicio");
        }
      } else {
        setError("Email o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error de conexión");
    }
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
            Iniciar sesión
          </h2>
          <p style={{ color: "#666", marginBottom: "32px" }}>
            Accede a tu cuenta de PetBoutique
          </p>
          {error && (
            <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: "1px solid #d9cbbb",
                  background: "#fffaf3",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: "1px solid #d9cbbb",
                  background: "#fffaf3",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
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
              Entrar
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "24px", color: "#666" }}>
            ¿No tienes cuenta?{" "}
            <Link
              to="/registro"
              style={{ color: "#1f1f1f", fontWeight: "700" }}
            >
              Regístrate
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
