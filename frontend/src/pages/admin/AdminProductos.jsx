import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import AdminHeader from "../../components/AdminHeader";
import Swal from "sweetalert2";

function AdminProductos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cargarProductos = () => {
    fetch(`${API_URL}/products/`)
      .then((r) => r.json())
      .then((d) => setProductos(d))
      .catch(console.error);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const abrirModalNuevo = () => {
    setEditando(null);
    setNombre("");
    setMarca("");
    setPrecio("");
    setStock("");
    setDescripcion("");
    setCategoria("");
    setShowModal(true);
  };

  const abrirModalEditar = (p) => {
    setEditando(p.id);
    setNombre(p.name);
    setMarca(p.brand || "");
    setPrecio(p.price);
    setStock(p.stock);
    setDescripcion(p.description || "");
    setCategoria(p.category || "");
    setShowModal(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const body = {
      name: nombre,
      brand: marca,
      price: parseFloat(precio),
      stock: parseInt(stock),
      description: descripcion,
      category: categoria,
    };
    const url = editando
      ? `${API_URL}/products/${editando}`
      : `${API_URL}/products/`;
    const method = editando ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      Swal.fire(
        "Guardado",
        editando ? "Producto actualizado" : "Producto creado",
        "success",
      );
      setShowModal(false);
      cargarProductos();
    } else {
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    }
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c0392b",
      cancelButtonColor: "#8b7355",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    const res = await fetch(
      `${API_URL}/products/${id}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
    );
    if (res.ok) {
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
      cargarProductos();
    } else {
      Swal.fire("Error", "No se pudo eliminar el producto", "error");
    }
  };

  const categorias = [
    ...new Set(productos.map((p) => p.category?.trim()).filter(Boolean)),
  ];
  const productosFiltrados = productos.filter(
    (p) =>
      p.name.toLowerCase().includes(busqueda.toLowerCase()) &&
      (filtroCategoria === "" || p.category === filtroCategoria),
  );

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
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
      <AdminHeader />
      <main
        style={{
          padding: isMobile ? "32px 16px" : "64px",
          background: "#fffaf3",
          minHeight: "80vh",
        }}
      >
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
            Gestión de Productos
          </h2>
          <button className="btn btn-primary" onClick={abrirModalNuevo}>
            + Añadir producto
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "32px",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={labelStyle}>Buscar producto</label>
            <input
              type="text"
              placeholder="Nombre del producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Categoría</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #d9cbbb",
                background: "#fffaf3",
                fontSize: "15px",
              }}
            >
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #eadfce",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {isMobile ? (
            productosFiltrados.length === 0 ? (
              <p
                style={{ padding: "32px", textAlign: "center", color: "#666" }}
              >
                No hay productos
              </p>
            ) : (
              productosFiltrados.map((p) => (
                <div
                  key={p.id}
                  style={{ padding: "16px", borderBottom: "1px solid #eadfce" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <strong>{p.name}</strong>
                    <strong>{p.price}€</strong>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#888",
                      marginBottom: "8px",
                    }}
                  >
                    {p.brand} · {p.category} · Stock: {p.stock}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => abrirModalEditar(p)}
                      style={{
                        background: "#1f1f1f",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(p.id)}
                      style={{
                        background: "#c0392b",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#1f1f1f", color: "white" }}>
                <tr>
                  <th style={{ padding: "16px", textAlign: "left" }}>ID</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Nombre</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Marca</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Categoría
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Precio</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Stock</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: "32px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      No hay productos
                    </td>
                  </tr>
                ) : (
                  productosFiltrados.map((p) => (
                    <tr
                      key={p.id}
                      style={{ borderBottom: "1px solid #eadfce" }}
                    >
                      <td style={{ padding: "14px 16px" }}>{p.id}</td>
                      <td style={{ padding: "14px 16px" }}>{p.name}</td>
                      <td style={{ padding: "14px 16px" }}>{p.brand}</td>
                      <td style={{ padding: "14px 16px" }}>{p.category}</td>
                      <td style={{ padding: "14px 16px" }}>{p.price}€</td>
                      <td style={{ padding: "14px 16px" }}>{p.stock}</td>
                      <td
                        style={{
                          padding: "14px 16px",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() => abrirModalEditar(p)}
                          style={{
                            background: "#1f1f1f",
                            color: "white",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "13px",
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(p.id)}
                          style={{
                            background: "#c0392b",
                            color: "white",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "13px",
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
          )}
        </div>
      </main>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: isMobile ? "16px" : "0",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "28px",
              padding: isMobile ? "28px 20px" : "48px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "32px",
              }}
            >
              <h3 style={{ fontSize: "28px", margin: 0 }}>
                {editando ? "Editar producto" : "Añadir producto"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleGuardar}>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Marca</label>
                <input
                  type="text"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  style={{ ...inputStyle, minHeight: "80px" }}
                ></textarea>
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
                  <label style={labelStyle}>Precio (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
              <div style={{ marginBottom: "28px" }}>
                <label style={labelStyle}>Categoría</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">-- Selecciona categoría --</option>
                  <option value="alimentacion">Alimentación</option>
                  <option value="juguetes">Juguetes</option>
                  <option value="accesorios">Accesorios</option>
                  <option value="higiene">Higiene</option>
                </select>
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
                {editando ? "Guardar cambios" : "Guardar producto"}
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default AdminProductos;
