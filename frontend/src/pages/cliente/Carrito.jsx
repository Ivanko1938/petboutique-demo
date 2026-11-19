import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
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
  }, []);

  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const cambiarCantidad = (id, delta) => {
    const nuevo = carrito.map((item) =>
      item.id === id
        ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
        : item,
    );
    actualizarCarrito(nuevo);
  };

  const eliminarItem = (id) => {
    actualizarCarrito(carrito.filter((item) => item.id !== id));
  };

  const subtotal = carrito.reduce(
    (acc, item) => acc + item.price * item.cantidad,
    0,
  );
  const envio = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + envio;

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
          to="/tienda"
          style={{
            color: "#8b7355",
            fontSize: "14px",
            fontWeight: "600",
            display: "block",
            marginBottom: "24px",
          }}
        >
          ← Seguir comprando
        </Link>
        <h2
          style={{ fontSize: isMobile ? "28px" : "40px", marginBottom: "40px" }}
        >
          Mi Carrito
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 0.5fr",
            gap: "32px",
          }}
        >
          {/* Productos */}
          {isMobile ? (
            // Vista móvil — tarjetas
            <div>
              {carrito.length === 0 ? (
                <p
                  style={{
                    color: "#666",
                    textAlign: "center",
                    padding: "32px",
                  }}
                >
                  Tu carrito está vacío
                </p>
              ) : (
                carrito.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "white",
                      border: "1px solid #eadfce",
                      borderRadius: "16px",
                      padding: "16px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <div>
                        <strong>{item.name}</strong>
                        <p
                          style={{
                            color: "#8b7355",
                            fontSize: "13px",
                            margin: 0,
                          }}
                        >
                          {item.brand}
                        </p>
                      </div>
                      <strong>{Number(item.price).toFixed(2)}€</strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() => cambiarCantidad(item.id, -1)}
                          style={{
                            background: "#f0ebe3",
                            border: "none",
                            borderRadius: "6px",
                            width: "28px",
                            height: "28px",
                            cursor: "pointer",
                            fontWeight: "700",
                          }}
                        >
                          -
                        </button>
                        <span>{item.cantidad}</span>
                        <button
                          onClick={() => cambiarCantidad(item.id, 1)}
                          style={{
                            background: "#f0ebe3",
                            border: "none",
                            borderRadius: "6px",
                            width: "28px",
                            height: "28px",
                            cursor: "pointer",
                            fontWeight: "700",
                          }}
                        >
                          +
                        </button>
                        <span style={{ color: "#666", fontSize: "13px" }}>
                          = {(Number(item.price) * item.cantidad).toFixed(2)}€
                        </span>
                      </div>
                      <button
                        onClick={() => eliminarItem(item.id)}
                        style={{
                          background: "#c0392b",
                          color: "white",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Vista escritorio — tabla
            <div
              style={{
                background: "white",
                border: "1px solid #eadfce",
                borderRadius: "24px",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#1f1f1f", color: "white" }}>
                  <tr>
                    <th style={{ padding: "16px", textAlign: "left" }}>
                      Producto
                    </th>
                    <th style={{ padding: "16px", textAlign: "left" }}>
                      Precio
                    </th>
                    <th style={{ padding: "16px", textAlign: "left" }}>
                      Cantidad
                    </th>
                    <th style={{ padding: "16px", textAlign: "left" }}>
                      Subtotal
                    </th>
                    <th style={{ padding: "16px", textAlign: "left" }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          padding: "32px",
                          textAlign: "center",
                          color: "#666",
                        }}
                      >
                        Tu carrito está vacío
                      </td>
                    </tr>
                  ) : (
                    carrito.map((item) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: "1px solid #eadfce" }}
                      >
                        <td style={{ padding: "14px 16px" }}>
                          <strong>{item.name}</strong>
                          <p
                            style={{
                              color: "#8b7355",
                              fontSize: "13px",
                              margin: 0,
                            }}
                          >
                            {item.brand}
                          </p>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {Number(item.price).toFixed(2)}€
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <button
                              onClick={() => cambiarCantidad(item.id, -1)}
                              style={{
                                background: "#f0ebe3",
                                border: "none",
                                borderRadius: "6px",
                                width: "28px",
                                height: "28px",
                                cursor: "pointer",
                                fontWeight: "700",
                              }}
                            >
                              -
                            </button>
                            <span>{item.cantidad}</span>
                            <button
                              onClick={() => cambiarCantidad(item.id, 1)}
                              style={{
                                background: "#f0ebe3",
                                border: "none",
                                borderRadius: "6px",
                                width: "28px",
                                height: "28px",
                                cursor: "pointer",
                                fontWeight: "700",
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {(Number(item.price) * item.cantidad).toFixed(2)}€
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <button
                            onClick={() => eliminarItem(item.id)}
                            style={{
                              background: "#c0392b",
                              color: "white",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Resumen */}
          <div
            style={{
              background: "white",
              border: "1px solid #eadfce",
              borderRadius: "24px",
              padding: "32px",
              height: "fit-content",
            }}
          >
            <h4 style={{ fontSize: "24px", marginBottom: "20px" }}>
              Resumen del pedido
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
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
                marginBottom: "20px",
                color: "#666",
              }}
            >
              <span>Gastos de envío</span>
              <span>{envio.toFixed(2)}€</span>
            </div>
            <div
              style={{
                borderTop: "1px solid #eadfce",
                paddingTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <strong>Total</strong>
              <strong>{total.toFixed(2)}€</strong>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="btn btn-primary"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                padding: "14px",
                borderRadius: "14px",
                fontSize: "16px",
              }}
            >
              Finalizar compra
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Carrito;
