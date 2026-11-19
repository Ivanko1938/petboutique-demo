import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

function Tienda() {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/products/`)
      .then((r) => r.json())
      .then((d) => setProductos(d))
      .catch((err) => console.error(err));
  }, []);

  const productosFiltrados = productos.filter((p) => {
    if (categoria && p.category !== categoria) return false;
    return true;
  });

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
          to={localStorage.getItem("token") ? "/inicio" : "/"}
          style={{
            color: "#8b7355",
            fontSize: "14px",
            fontWeight: "600",
            display: "block",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          ← Volver al inicio
        </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <Link
            to="/carrito"
            className="btn btn-secondary"
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              fontSize: "14px",
            }}
          >
            🛒 Ver carrito
          </Link>
        </div>
        <div className="section-heading">
          <span>Tienda</span>
          <h2>Productos para tu mascota</h2>
          <p>
            Encuentra todo lo que necesita tu mascota en nuestra tienda online.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "250px 1fr",
            gap: "32px",
            marginTop: "40px",
          }}
        >
          <aside>
            <div
              style={{
                background: "white",
                border: "1px solid #eadfce",
                borderRadius: "24px",
                padding: "28px",
              }}
            >
              <h4 style={{ marginBottom: "20px" }}>Filtrar por</h4>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "700",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Categoría
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #d9cbbb",
                    background: "#fffaf3",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Todas</option>
                  <option value="alimentacion">Alimentación</option>
                  <option value="juguetes">Juguetes</option>
                  <option value="accesorios">Accesorios</option>
                  <option value="higiene">Higiene</option>
                </select>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px", borderRadius: "12px" }}
                onClick={() => setCategoria(categoria)}
              >
                Aplicar filtros
              </button>
            </div>
          </aside>

          <section>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: "20px",
              }}
            >
              {productosFiltrados.length === 0 ? (
                <p style={{ color: "#666" }}>No hay productos disponibles</p>
              ) : (
                productosFiltrados.map((producto) => (
                  <div
                    key={producto.id}
                    style={{
                      background: "white",
                      border: "1px solid #eadfce",
                      borderRadius: "24px",
                      padding: "24px",
                      textAlign: "center",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        height: "140px",
                        background: "#f2ece3",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "48px", overflow: "hidden",
                        marginBottom: "16px",
                      }}
                    >
                      {producto.image_url ? (<img src={producto.image_url} alt={producto.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />) : "🐾"}
                    </div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "16px" }}>
                      {producto.name}
                    </h4>
                    <p
                      style={{
                        color: "#8b7355",
                        fontSize: "13px",
                        margin: "0 0 8px",
                      }}
                    >
                      {producto.brand}
                    </p>
                    <p
                      style={{
                        color: "#666",
                        fontSize: "13px",
                        margin: "0 0 12px",
                      }}
                    >
                      {producto.description}
                    </p>
                    <p
                      style={{
                        fontWeight: "700",
                        fontSize: "18px",
                        margin: "0 0 16px",
                      }}
                    >
                      {producto.price}€
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        to={`/producto/${producto.id}`}
                        className="btn btn-secondary"
                        style={{
                          flex: 1,
                          textAlign: "center",
                          padding: "10px",
                          borderRadius: "12px",
                          fontSize: "13px",
                        }}
                      >
                        Ver detalle
                      </Link>
                      <button
                        className="btn btn-primary"
                        style={{ padding: "10px 14px", borderRadius: "12px" }}
                        onClick={() => {
                          const carrito = JSON.parse(
                            localStorage.getItem("carrito") || "[]",
                          );
                          const existe = carrito.find(
                            (item) => item.id === producto.id,
                          );
                          if (existe) {
                            existe.cantidad += 1;
                          } else {
                            carrito.push({
                              id: producto.id,
                              name: producto.name,
                              price: producto.price,
                              brand: producto.brand,
                              cantidad: 1,
                            });
                          }
                          localStorage.setItem(
                            "carrito",
                            JSON.stringify(carrito),
                          );
                          Swal.fire({
                            title: "¡Añadido!",
                            text: `${producto.name} se ha añadido al carrito`,
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                          });
                        }}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Tienda;
