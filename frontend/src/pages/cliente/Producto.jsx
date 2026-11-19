import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

function Producto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((r) => r.json())
      .then((d) => setProducto(d))
      .catch((err) => console.error(err));
  }, [id]);

  if (!producto) return <div style={{ padding: "90px 64px" }}>Cargando...</div>;

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
          to="/tienda"
          style={{
            color: "#8b7355",
            fontSize: "14px",
            fontWeight: "600",
            display: "block",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          ← Volver a la tienda
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "24px" : "48px",
          }}
        >
          <div
            style={{
              background: "#f2ece3",
              borderRadius: "24px",
              minHeight: isMobile ? "200px" : "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "80px", overflow: "hidden",
            }}
          >
            {producto.image_url ? (<img src={producto.image_url} alt={producto.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />) : "🐾"}
          </div>

          <div>
            <p
              style={{
                color: "#8b7355",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              {producto.brand}
            </p>
            <h2
              style={{
                fontSize: isMobile ? "28px" : "40px",
                marginBottom: "8px",
              }}
            >
              {producto.name}
            </h2>
            <p
              style={{
                fontSize: isMobile ? "22px" : "28px",
                fontWeight: "700",
                margin: "16px 0",
              }}
            >
              {producto.price}€
            </p>
            <p
              style={{ color: "#666", lineHeight: "1.7", marginBottom: "24px" }}
            >
              {producto.description}
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "flex-end",
                marginBottom: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "700",
                    marginBottom: "8px",
                  }}
                >
                  Cantidad
                </label>
                <input
                  type="number"
                  defaultValue="1"
                  min="1"
                  style={{
                    width: "80px",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #d9cbbb",
                    background: "#fffaf3",
                    fontSize: "15px",
                  }}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  flex: isMobile ? "1" : "none",
                }}
                onClick={() => {
                  const cantidad =
                    parseInt(
                      document.querySelector('input[type="number"]').value,
                    ) || 1;
                  const carrito = JSON.parse(
                    localStorage.getItem("carrito") || "[]",
                  );
                  const existe = carrito.find(
                    (item) => item.id === producto.id,
                  );
                  if (existe) {
                    existe.cantidad += cantidad;
                  } else {
                    carrito.push({
                      id: producto.id,
                      name: producto.name,
                      price: producto.price,
                      brand: producto.brand,
                      cantidad: cantidad,
                    });
                  }
                  localStorage.setItem("carrito", JSON.stringify(carrito));
                  Swal.fire({
                    title: "¡Añadido!",
                    text: `${producto.name} se ha añadido al carrito`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                  });
                }}
              >
                Añadir al carrito
              </button>
            </div>
            <Link
              to="/carrito"
              className="btn btn-secondary"
              style={{
                display: "block",
                textAlign: "center",
                padding: "12px",
                borderRadius: "12px",
              }}
            >
              Ver carrito
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Producto;
