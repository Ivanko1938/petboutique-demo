import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import AdminHeader from "../../components/AdminHeader";
import Swal from "sweetalert2";

function AdminClientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cargarClientes = () => {
    fetch(`${API_URL}/users/`)
      .then((r) => r.json())
      .then((d) => setClientes(d))
      .catch(console.error);
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const abrirModalEditar = (c) => {
    setEditando(c.id);
    setFirstName(c.first_name);
    setLastName(c.last_name);
    setEmail(c.email);
    setPhone(c.phone || "");
    setAddress(c.address || "");
    setShowModal(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `${API_URL}/users/${editando}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address,
          password: "unchanged",
        }),
      },
    );
    if (res.ok) {
      Swal.fire("Guardado", "Cliente actualizado correctamente", "success");
      setShowModal(false);
      cargarClientes();
    } else {
      Swal.fire("Error", "No se pudo actualizar el cliente", "error");
    }
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E76F51",
      cancelButtonColor: "#8b7355",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    const res = await fetch(
      `${API_URL}/users/${id}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
    );
    if (res.ok) {
      Swal.fire("Eliminado", "Cliente eliminado correctamente", "success");
      cargarClientes();
    } else {
      Swal.fire("Error", "No se pudo eliminar el cliente", "error");
    }
  };

  const clientesFiltrados = clientes.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.email} ${c.phone}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
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
        <h2
          style={{ fontSize: isMobile ? "28px" : "40px", marginBottom: "40px" }}
        >
          Gestión de Clientes
        </h2>

        <div style={{ marginBottom: "32px" }}>
          <label style={labelStyle}>Buscar cliente</label>
          <input
            type="text"
            placeholder="Nombre, email o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ ...inputStyle, maxWidth: isMobile ? "100%" : "400px" }}
          />
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
            clientesFiltrados.length === 0 ? (
              <p
                style={{ padding: "32px", textAlign: "center", color: "#666" }}
              >
                No hay clientes
              </p>
            ) : (
              clientesFiltrados.map((c) => (
                <div
                  key={c.id}
                  style={{ padding: "16px", borderBottom: "1px solid #eadfce" }}
                >
                  <div style={{ marginBottom: "4px" }}>
                    <strong>
                      {c.first_name} {c.last_name}
                    </strong>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#888",
                      marginBottom: "8px",
                    }}
                  >
                    {c.email} · {c.phone}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => abrirModalEditar(c)}
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
                      onClick={() => handleEliminar(c.id)}
                      style={{
                        background: "#E76F51",
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
                  <th style={{ padding: "16px", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Teléfono
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: "32px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      No hay clientes
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((c) => (
                    <tr
                      key={c.id}
                      style={{ borderBottom: "1px solid #eadfce" }}
                    >
                      <td style={{ padding: "14px 16px" }}>{c.id}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {c.first_name} {c.last_name}
                      </td>
                      <td style={{ padding: "14px 16px" }}>{c.email}</td>
                      <td style={{ padding: "14px 16px" }}>{c.phone}</td>
                      <td
                        style={{
                          padding: "14px 16px",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() => abrirModalEditar(c)}
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
                          onClick={() => handleEliminar(c.id)}
                          style={{
                            background: "#E76F51",
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
              <h3 style={{ fontSize: "28px", margin: 0 }}>Editar cliente</h3>
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
              <div style={{ marginBottom: "28px" }}>
                <label style={labelStyle}>Dirección</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={inputStyle}
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
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default AdminClientes;
