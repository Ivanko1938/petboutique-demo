import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

function Checkout() {
  const [carrito, setCarrito] = useState([]);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [cp, setCp] = useState("");
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
    const data = JSON.parse(localStorage.getItem("carrito") || "[]");
    setCarrito(data);
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetch(`${API_URL}/users/${userId}`)
        .then((r) => r.json())
        .then((d) => {
          setNombre(`${d.first_name} ${d.last_name}`);
          setTelefono(d.phone || "");
          setDireccion(d.address || "");
        })
        .catch(console.error);
    }
  }, []);

  const subtotal = carrito.reduce(
    (acc, item) => acc + Number(item.price) * item.cantidad,
    0,
  );
  const envio = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + envio;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      Swal.fire(
        "Carrito vacío",
        "Añade productos antes de confirmar",
        "warning",
      );
      return;
    }
    const userId = localStorage.getItem("user_id");
    setCargando(true);
    const body = {
      nombre,
      direccion,
      ciudad,
      cp,
      telefono,
      metodo_pago: pago,
      total,
      user_id: userId ? parseInt(userId) : null,
      items: carrito.map((item) => ({
        product_id: item.id,
        cantidad: item.cantidad,
        precio: Number(item.price),
      })),
    };
    try {
      const res = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        localStorage.removeItem("carrito");
        Swal.fire(
          "¡Pedido confirmado!",
          "Tu pedido ha sido recibido correctamente",
          "success",
        ).then(() => {
          navigate(userId ? "/mis-pedidos" : "/");
        });
      } else {
        Swal.fire("Error", "No se pudo confirmar el pedido", "error");
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
  const cardStyle = {
    background: "white",
    border: "1px solid #eadfce",
    borderRadius: "24px",
    padding: isMobile ? "20px" : "32px",
    marginBottom: "24px",
  };

  return (
    <div className="home-page">
      {localStorage.getItem("token") ? <NavbarCliente /> : <Navbar />}
      <main
        style={{
          padding: isMobile ? "90px 16px" : "90px 64px",
          background: "#fffaf3",
          minHeight: "80vh",
        }}
      >
        <Link
          to="/carrito"
          style={{
            color: "#8b7355",
            fontSize: "14px",
            fontWeight: "600",
            display: "block",
            marginBottom: "24px",
          }}
        >
          ← Volver al carrito
        </Link>
        <h2
          style={{ fontSize: isMobile ? "28px" : "40px", marginBottom: "40px" }}
        >
          Finalizar Compra
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
              <h4 style={{ marginBottom: "24px" }}>Datos de envío</h4>
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
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Dirección</label>
                <input
                  type="text"
                  placeholder="Calle y número"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label style={labelStyle}>Ciudad</label>
                  <input
                    type="text"
                    placeholder="Ciudad"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Código postal</label>
                  <input
                    type="text"
                    placeholder="Código postal"
                    value={cp}
                    onChange={(e) => setCp(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
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
                    required={metodo === "tarjeta"}
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
              {cargando ? "Procesando..." : "Confirmar pedido"}
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
            <h4 style={{ fontSize: "24px", marginBottom: "20px" }}>
              Resumen del pedido
            </h4>
            {carrito.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  fontSize: "14px",
                }}
              >
                <span>
                  {item.name} x{item.cantidad}
                </span>
                <span>{(Number(item.price) * item.cantidad).toFixed(2)}€</span>
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
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  color: "#666",
                }}
              >
                <span>Gastos de envío</span>
                <span>{envio.toFixed(2)}€</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Total</strong>
                <strong>{total.toFixed(2)}€</strong>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Checkout;
