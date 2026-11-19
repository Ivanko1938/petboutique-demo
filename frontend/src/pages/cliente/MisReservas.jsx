import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cargarReservas = () => {
    const url = userId
      ? `${API_URL}/bookings/?user_id=${userId}`
      : `${API_URL}/bookings/`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setReservas(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    cargarReservas();
    const urlPets = userId
      ? `${API_URL}/pets/?owner_id=${userId}`
      : `${API_URL}/pets/`;
    fetch(urlPets)
      .then((r) => r.json())
      .then((d) => setMascotas(d))
      .catch((err) => console.error(err));
    fetch(`${API_URL}/services/`)
      .then((r) => r.json())
      .then((d) => setServicios(d))
      .catch((err) => console.error(err));
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

  const handleBorrar = async (ids) => {
    const result = await Swal.fire({
      title: "¿Cancelar reserva?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E76F51",
      cancelButtonColor: "#8b7355",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, volver",
    });
    if (!result.isConfirmed) return;
    try {
      for (const id of ids) {
        await fetch(`${API_URL}/bookings/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      Swal.fire("Cancelada", "Tu reserva ha sido cancelada", "success");
      cargarReservas();
    } catch (err) {
      Swal.fire("Error", "Error de conexión", "error");
    }
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

  const reservasAgrupadas = agruparReservas();

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
            Mis Reservas
          </h2>
          <Link to="/reservar" className="btn btn-primary">
            + Nueva reserva
          </Link>
        </div>

        {reservasAgrupadas.length === 0 ? (
          <p style={{ color: "#666" }}>No tienes reservas todavía</p>
        ) : isMobile ? (
          // Vista móvil — tarjetas
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {reservasAgrupadas.map((r) => (
              <div
                key={r.ids.join("-")}
                style={{
                  background: "white",
                  border: "1px solid #eadfce",
                  borderRadius: "20px",
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
                  <strong>
                    {mascotas.find((m) => m.id === r.pet_id)?.name || r.pet_id}
                  </strong>
                  <span
                    style={{
                      background:
                        r.status === "confirmed"
                          ? "#d4edda"
                          : r.status === "cancelled"
                            ? "#f8d7da"
                            : "#fff3cd",
                      color:
                        r.status === "confirmed"
                          ? "#155724"
                          : r.status === "cancelled"
                            ? "#721c24"
                            : "#856404",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {traducirEstado(r.status)}
                  </span>
                </div>
                <div
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginBottom: "8px",
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
                    fontSize: "14px",
                    color: "#444",
                    marginBottom: "12px",
                  }}
                >
                  <span>Inicio: {formatFecha(r.start_date)}</span>
                  {r.end_date && (
                    <span style={{ marginLeft: "12px" }}>
                      Fin: {formatFecha(r.end_date)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleBorrar(r.ids)}
                  style={{
                    background: "#E76F51",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    width: "100%",
                  }}
                >
                  Cancelar
                </button>
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
                {reservasAgrupadas.map((r) => (
                  <tr
                    key={r.ids.join("-")}
                    style={{ borderBottom: "1px solid #eadfce" }}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      {mascotas.find((m) => m.id === r.pet_id)?.name ||
                        r.pet_id}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {r.services.map((sid) => (
                        <span
                          key={sid}
                          style={{ display: "block", fontSize: "14px" }}
                        >
                          • {servicios.find((s) => s.id === sid)?.name || sid}
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
                    <td style={{ padding: "14px 16px" }}>
                      <button
                        onClick={() => handleBorrar(r.ids)}
                        style={{
                          background: "#E76F51",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Cancelar
                      </button>
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

export default MisReservas;
