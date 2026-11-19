import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

function CheckoutReserva() {
  const [deposito, setDeposito] = useState(0);
  const [servicios, setServicios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pago, setPago] = useState("");
  const [cargando, setCargando] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setDeposito(parseFloat(localStorage.getItem("reserva_deposito") || 0));
    setServicios(JSON.parse(localStorage.getItem("reserva_servicios") || "[]"));
    const userId = localStorage.getItem("user_id");
    fetch(`${API_URL}/users/${userId}`)
      .then((r) => r.json())
      .then((d) => {
        setNombre(`${d.first_name} ${d.last_name}`);
        setTelefono(d.phone || "");
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setTimeout(() => {
      localStorage.removeItem("reserva_deposito");
      localStorage.removeItem("reserva_servicios");
      Swal.fire({
        icon: "success",
        title: "¡Reserva confirmada!",
        text: `Se ha realizado el pago del depósito de ${deposito}€. El resto se abonará en el momento de entrega de tu mascota.`,
        confirmButtonColor: "#2D6A4F",
      }).then(() => navigate("/mis-reservas"));
    }, 1500);
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
  const cardStyle = {
    background: "white",
    border: "1px solid #eadfce",
    borderRadius: "24px",
    padding: isMobile ? "20px" : "32px",
    marginBottom: "24px",
  };

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
        <Link
          to="/reservar"
          style={{
            color: "#8b7355",
            fontSize: "14px",
            fontWeight: "600",
            display: "block",
            marginBottom: "24px",
          }}
        >
          ← Volver a reservas
        </Link>
        <h2
          style={{ fontSize: isMobile ? "28px" : "40px", marginBottom: "40px" }}
        >
          Pago de Reserva
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 0.5fr",
            gap: "32px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={cardStyle}>
              <h4 style={{ marginBottom: "24px" }}>Datos de contacto</h4>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Nombre completo</label>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <input
                  type="tel"
                  placeholder="Teléfono de contacto"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={cardStyle}>
              <h4 style={{ marginBottom: "24px" }}>Método de pago</h4>
              {["tarjeta", "paypal", "transferencia"].map((metodo) => (
                <div
                  key={metodo}
                  style={{
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <input
                    type="radio"
                    name="pago"
                    id={metodo}
                    value={metodo}
                    onChange={(e) => setPago(e.target.value)}
                    required
                  />
                  <label htmlFor={metodo} style={{ fontWeight: "600" }}>
                    {metodo === "tarjeta"
                      ? "Tarjeta de crédito/débito"
                      : metodo === "paypal"
                        ? "PayPal"
                        : "Transferencia bancaria"}
                  </label>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={cargando}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                fontSize: "16px",
                opacity: cargando ? 0.6 : 1,
              }}
            >
              {cargando ? "Procesando..." : `Pagar ${deposito}€`}
            </button>
          </form>

          <div
            style={{
              background: "white",
              border: "1px solid #eadfce",
              borderRadius: "24px",
              padding: isMobile ? "20px" : "32px",
              height: "fit-content",
            }}
          >
            <h4 style={{ fontSize: "24px", marginBottom: "20px" }}>Resumen</h4>
            {servicios.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  fontSize: "14px",
                }}
              >
                <span>• {s}</span>
              </div>
            ))}
            <div
              style={{
                borderTop: "1px solid #eadfce",
                marginTop: "16px",
                paddingTop: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  color: "#666",
                }}
              >
                <span>Depósito (20%)</span>
                <span style={{ color: "#E76F51", fontWeight: "700" }}>
                  {deposito}€
                </span>
              </div>
              <div
                style={{
                  background: "#f0faf5",
                  border: "1px solid #2D6A4F",
                  borderRadius: "12px",
                  padding: "12px",
                  marginTop: "12px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#2D6A4F",
                    lineHeight: "1.6",
                  }}
                >
                  El resto del importe se abonará en el momento de entrega de tu
                  mascota.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CheckoutReserva;
