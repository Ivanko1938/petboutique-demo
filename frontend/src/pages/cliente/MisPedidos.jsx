import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";

function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/orders/?user_id=${userId}`)
      .then((r) => r.json())
      .then((d) => setPedidos(d))
      .catch(console.error);
  }, []);

  const traducirEstado = (status) => {
    if (status === "pending") return "Pendiente";
    if (status === "confirmed") return "Confirmado";
    if (status === "shipped") return "Enviado";
    if (status === "delivered") return "Entregado";
    if (status === "cancelled") return "Cancelado";
    return status;
  };

  const colorEstado = (status) => {
    if (status === "confirmed")
      return { background: "#d4edda", color: "#155724" };
    if (status === "shipped")
      return { background: "#cce5ff", color: "#004085" };
    if (status === "delivered")
      return { background: "#d1ecf1", color: "#0c5460" };
    if (status === "cancelled")
      return { background: "#f8d7da", color: "#721c24" };
    return { background: "#fff3cd", color: "#856404" };
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
          to="/inicio"
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <h2 style={{ fontSize: isMobile ? "28px" : "40px", margin: 0 }}>
            Mis Pedidos
          </h2>
          <Link to="/tienda" className="btn btn-primary">
            + Ir a la tienda
          </Link>
        </div>

        {pedidos.length === 0 ? (
          <p style={{ color: "#666" }}>No tienes pedidos todavía</p>
        ) : isMobile ? (
          // Vista móvil — tarjetas
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {pedidos.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "white",
                  border: "1px solid #eadfce",
                  borderRadius: "16px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <strong>Pedido #{p.id}</strong>
                  <span
                    style={{
                      ...colorEstado(p.status),
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {traducirEstado(p.status)}
                  </span>
                </div>
                <p
                  style={{ color: "#666", fontSize: "13px", margin: "0 0 8px" }}
                >
                  {new Date(p.order_date).toLocaleDateString("es-ES")}
                </p>
                <div style={{ marginBottom: "8px" }}>
                  {p.items.map((item) => (
                    <div
                      key={item.id}
                      style={{ fontSize: "13px", color: "#666" }}
                    >
                      Producto #{item.product_id} x{item.cantidad}
                    </div>
                  ))}
                </div>
                <strong>{Number(p.total).toFixed(2)}€</strong>
              </div>
            ))}
          </div>
        ) : (
          // Vista escritorio — tabla
          <div
            style={{
              background: "white",
              border: "1px solid #eadfce",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#1f1f1f", color: "white" }}>
                <tr>
                  <th style={{ padding: "16px", textAlign: "left" }}>Pedido</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Fecha</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Productos
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Total</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #eadfce" }}>
                    <td style={{ padding: "14px 16px" }}>#{p.id}</td>
                    <td style={{ padding: "14px 16px" }}>
                      {new Date(p.order_date).toLocaleDateString("es-ES")}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {p.items.map((item) => (
                        <div
                          key={item.id}
                          style={{ fontSize: "13px", color: "#666" }}
                        >
                          Producto #{item.product_id} x{item.cantidad}
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: "700" }}>
                      {Number(p.total).toFixed(2)}€
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          ...colorEstado(p.status),
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {traducirEstado(p.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default MisPedidos;
