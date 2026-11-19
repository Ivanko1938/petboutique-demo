import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import AdminHeader from "../../components/AdminHeader";
import Swal from "sweetalert2";

function AdminPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cargarDatos = () => {
    fetch(`${API_URL}/orders/`)
      .then((r) => r.json())
      .then((d) => setPedidos(d))
      .catch(console.error);
    fetch(`${API_URL}/users/`)
      .then((r) => r.json())
      .then((d) => setUsuarios(d))
      .catch(console.error);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleEstado = async (id, nuevoEstado) => {
    const res = await fetch(
      `${API_URL}/orders/${id}/status?status=${nuevoEstado}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (res.ok) {
      cargarDatos();
    } else {
      Swal.fire("Error", "No se pudo actualizar el estado", "error");
    }
  };

  const traducirEstado = (status) => {
    if (status === "pending") return "Pendiente";
    if (status === "confirmed") return "Confirmado";
    if (status === "shipped") return "Enviado";
    if (status === "delivered") return "Entregado";
    if (status === "cancelled") return "Cancelado";
    return status;
  };

  const pedidosFiltrados = pedidos.filter(
    (p) => filtroEstado === "" || p.status === filtroEstado,
  );

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
        <h2
          style={{ fontSize: isMobile ? "28px" : "40px", marginBottom: "40px" }}
        >
          Gestión de Pedidos
        </h2>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "32px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontWeight: "700", margin: 0 }}>Filtrar por:</p>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid #d9cbbb",
              background: "#fffaf3",
              fontSize: "15px",
            }}
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmado</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
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
            pedidosFiltrados.length === 0 ? (
              <p
                style={{ padding: "32px", textAlign: "center", color: "#666" }}
              >
                No hay pedidos
              </p>
            ) : (
              pedidosFiltrados.map((p) => {
                const usuario = usuarios.find((u) => u.id === p.user_id);
                return (
                  <div
                    key={p.id}
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid #eadfce",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <strong>
                        #{p.id} —{" "}
                        {usuario
                          ? `${usuario.first_name} ${usuario.last_name}`
                          : p.nombre || "Invitado"}
                      </strong>
                      <strong>{Number(p.total).toFixed(2)}€</strong>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#888",
                        marginBottom: "8px",
                      }}
                    >
                      {p.telefono} · {p.direccion}, {p.ciudad}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        marginBottom: "8px",
                      }}
                    >
                      {p.items.map((item) => (
                        <div key={item.id}>
                          Producto #{item.product_id} x{item.cantidad}
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{traducirEstado(p.status)}</span>
                      <select
                        value={p.status}
                        onChange={(e) => handleEstado(p.id, e.target.value)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid #d9cbbb",
                          background: "#fffaf3",
                          fontSize: "13px",
                        }}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#1f1f1f", color: "white" }}>
                <tr>
                  <th style={{ padding: "16px", textAlign: "left" }}>ID</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Cliente
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Fecha</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Productos
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Total</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Estado</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: "32px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      No hay pedidos
                    </td>
                  </tr>
                ) : (
                  pedidosFiltrados.map((p) => {
                    const usuario = usuarios.find((u) => u.id === p.user_id);
                    return (
                      <tr
                        key={p.id}
                        style={{ borderBottom: "1px solid #eadfce" }}
                      >
                        <td style={{ padding: "14px 16px" }}>#{p.id}</td>
                        <td style={{ padding: "14px 16px" }}>
                          {usuario
                            ? `${usuario.first_name} ${usuario.last_name}`
                            : p.nombre || "Invitado"}
                          <div style={{ fontSize: "12px", color: "#888" }}>
                            {p.telefono}
                          </div>
                          <div style={{ fontSize: "12px", color: "#888" }}>
                            {p.direccion}, {p.ciudad}
                          </div>
                        </td>
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
                          {traducirEstado(p.status)}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <select
                            value={p.status}
                            onChange={(e) => handleEstado(p.id, e.target.value)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: "8px",
                              border: "1px solid #d9cbbb",
                              background: "#fffaf3",
                              fontSize: "13px",
                              cursor: "pointer",
                            }}
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdminPedidos;
