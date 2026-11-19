import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import AdminHeader from "../../components/AdminHeader";
import Swal from "sweetalert2";

function AdminReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [servicios, setServicios] = useState([]);
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
    fetch(`${API_URL}/bookings/`)
      .then((r) => r.json())
      .then((d) => setReservas(d))
      .catch(console.error);
    fetch(`${API_URL}/pets/`)
      .then((r) => r.json())
      .then((d) => setMascotas(d))
      .catch(console.error);
    fetch(`${API_URL}/services/`)
      .then((r) => r.json())
      .then((d) => setServicios(d))
      .catch(console.error);
    fetch(`${API_URL}/users/`)
      .then((r) => r.json())
      .then((d) => setUsuarios(d))
      .catch(console.error);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const agruparReservas = () => {
    const grupos = {};
    for (const r of reservas) {
      const key = `${r.pet_id}_${r.start_date}`;
      if (!grupos[key]) {
        grupos[key] = { ...r, ids: [r.id], services: [r.service_id] };
      } else {
        grupos[key].ids.push(r.id);
        grupos[key].services.push(r.service_id);
      }
    }
    return Object.values(grupos);
  };

  const handleEstado = async (ids, nuevoEstado) => {
    for (const id of ids) {
      await fetch(
        `${API_URL}/bookings/${id}/status?status=${nuevoEstado}`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } },
      );
    }
    cargarDatos();
  };

  const handleBorrar = async (ids) => {
    const result = await Swal.fire({
      title: "¿Eliminar reserva?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E76F51",
      cancelButtonColor: "#8b7355",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    for (const id of ids) {
      await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    Swal.fire("Eliminada", "La reserva ha sido eliminada", "success");
    cargarDatos();
  };

  const traducirEstado = (status) => {
    if (status === "pending") return "Pendiente";
    if (status === "confirmed") return "Confirmada";
    if (status === "cancelled") return "Cancelada";
    return status;
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-ES");
  };

  const reservasAgrupadas = agruparReservas().filter(
    (r) => filtroEstado === "" || r.status === filtroEstado,
  );

  const btnStyle = (bg) => ({
    background: bg,
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  });

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
          Gestión de Reservas
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
          <p style={{ fontWeight: "700", margin: 0 }}>Filtrar por estado:</p>
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
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
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
            reservasAgrupadas.length === 0 ? (
              <p
                style={{ padding: "32px", textAlign: "center", color: "#666" }}
              >
                No hay reservas
              </p>
            ) : (
              reservasAgrupadas.map((r) => {
                const usuario = usuarios.find((u) => u.id === r.user_id);
                const mascota = mascotas.find((m) => m.id === r.pet_id);
                return (
                  <div
                    key={r.ids.join("-")}
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
                        {usuario
                          ? `${usuario.first_name} ${usuario.last_name}`
                          : r.user_id}
                      </strong>
                      <span>{traducirEstado(r.status)}</span>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#888",
                        marginBottom: "4px",
                      }}
                    >
                      🐾 {mascota?.name || r.pet_id}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      {r.services.map((sid) => (
                        <span key={sid} style={{ display: "block" }}>
                          • {servicios.find((s) => s.id === sid)?.name || sid}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#888",
                        marginBottom: "12px",
                      }}
                    >
                      {formatFecha(r.start_date)} — {formatFecha(r.end_date)}
                    </div>
                    <div
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                    >
                      {r.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleEstado(r.ids, "confirmed")}
                            style={btnStyle("#2D6A4F")}
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => handleEstado(r.ids, "cancelled")}
                            style={btnStyle("#1f1f1f")}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleBorrar(r.ids)}
                        style={btnStyle("#c0392b")}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#1f1f1f", color: "white" }}>
                <tr>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Usuario
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Mascota
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Servicios
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Fecha inicio
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Fecha fin
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Estado</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservasAgrupadas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: "32px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      No hay reservas
                    </td>
                  </tr>
                ) : (
                  reservasAgrupadas.map((r) => {
                    const usuario = usuarios.find((u) => u.id === r.user_id);
                    const mascota = mascotas.find((m) => m.id === r.pet_id);
                    return (
                      <tr
                        key={r.ids.join("-")}
                        style={{ borderBottom: "1px solid #eadfce" }}
                      >
                        <td style={{ padding: "14px 16px" }}>
                          {usuario
                            ? `${usuario.first_name} ${usuario.last_name}`
                            : r.user_id}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {mascota?.name || r.pet_id}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {r.services.map((sid) => (
                            <span
                              key={sid}
                              style={{ display: "block", fontSize: "14px" }}
                            >
                              •{" "}
                              {servicios.find((s) => s.id === sid)?.name || sid}
                            </span>
                          ))}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {formatFecha(r.start_date)}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {formatFecha(r.end_date)}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {traducirEstado(r.status)}
                        </td>
                        <td
                          style={{
                            padding: "14px 16px",
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          {r.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleEstado(r.ids, "confirmed")}
                                style={btnStyle("#2D6A4F")}
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => handleEstado(r.ids, "cancelled")}
                                style={btnStyle("#1f1f1f")}
                              >
                                Cancelar
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleBorrar(r.ids)}
                            style={btnStyle("#c0392b")}
                          >
                            Eliminar
                          </button>
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

export default AdminReservas;
