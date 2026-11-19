import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

function MiPerfil() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [cargando, setCargando] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/users/${userId}`)
      .then((r) => r.json())
      .then((d) => {
        setFirstName(d.first_name);
        setLastName(d.last_name);
        setEmail(d.email);
        setPhone(d.phone || "");
        setAddress(d.address || "");
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    if (passwordNueva && passwordNueva !== passwordConfirmar) {
      Swal.fire("Error", "Las contraseñas nuevas no coinciden", "error");
      setCargando(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            address: address,
            password: passwordNueva || "unchanged",
          }),
        },
      );
      if (res.ok) {
        Swal.fire(
          "Guardado",
          "Tus datos han sido actualizados",
          "success",
        ).then(() => navigate("/inicio"));
      } else {
        Swal.fire("Error", "No se pudieron guardar los cambios", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Error de conexión", "error");
    } finally {
      setCargando(false);
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
      <NavbarCliente />
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
            maxWidth: "520px",
            boxShadow: "0 14px 36px rgba(0,0,0,0.05)",
          }}
        >
          <button
            onClick={() => navigate("/inicio")}
            style={{
              background: "none",
              border: "none",
              color: "#8b7355",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "16px",
              padding: 0,
            }}
          >
            ← Volver al inicio
          </button>
          <h2
            style={{
              fontSize: isMobile ? "24px" : "32px",
              marginBottom: "8px",
            }}
          >
            Mi Perfil
          </h2>
          <p style={{ color: "#666", marginBottom: "32px" }}>
            Actualiza tus datos personales
          </p>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label style={labelStyle}>Nombre</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Apellidos</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "32px" }}>
              <label style={labelStyle}>Dirección</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Cambiar contraseña */}
            <div
              style={{
                borderTop: "1px solid #eadfce",
                paddingTop: "28px",
                marginBottom: "28px",
              }}
            >
              <h4 style={{ fontSize: "18px", marginBottom: "20px" }}>
                Cambiar contraseña
              </h4>
              <p
                style={{
                  color: "#666",
                  fontSize: "13px",
                  marginBottom: "20px",
                }}
              >
                Deja estos campos vacíos si no quieres cambiar la contraseña.
              </p>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Contraseña actual</label>
                <input
                  type="password"
                  placeholder="Tu contraseña actual"
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Nueva contraseña</label>
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: "28px" }}>
                <label style={labelStyle}>Confirmar nueva contraseña</label>
                <input
                  type="password"
                  placeholder="Repite la nueva contraseña"
                  value={passwordConfirmar}
                  onChange={(e) => setPasswordConfirmar(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={cargando}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                fontSize: "16px",
                opacity: cargando ? 0.6 : 1,
              }}
            >
              {cargando ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MiPerfil;
