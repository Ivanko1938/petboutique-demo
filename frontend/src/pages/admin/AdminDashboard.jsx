import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import AdminHeader from "../../components/AdminHeader";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    pets: 0,
    services: 0,
    appointments: 0,
  });
  const [reservas, setReservas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/users/`)
      .then((r) => r.json())
      .then((d) => setStats((s) => ({ ...s, users: d.length })));
    fetch(`${API_URL}/pets/`)
      .then((r) => r.json())
      .then((d) => {
        setStats((s) => ({ ...s, pets: d.length }));
        setMascotas(d);
      });
    fetch(`${API_URL}/orders/`)
      .then((r) => r.json())
      .then((d) => setPedidos(d.filter((p) => p.status === "pending")));
    fetch(`${API_URL}/services/`)
      .then((r) => r.json())
      .then((d) => {
        setStats((s) => ({ ...s, services: d.length }));
        setServicios(d);
      });
    fetch(`${API_URL}/bookings/`)
      .then((r) => r.json())
      .then((d) => {
        setStats((s) => ({ ...s, appointments: d.length }));
        const filtradas = d.filter(
          (r) => r.status === "pending" || r.status === "confirmed",
        );
        const grupos = {};
        for (const r of filtradas) {
          const key = `${r.pet_id}_${r.start_date}`;
          if (!grupos[key]) {
            grupos[key] = { ...r, ids: [r.id], services: [r.service_id] };
          } else {
            grupos[key].ids.push(r.id);
            grupos[key].services.push(r.service_id);
          }
        }
        setReservas(Object.values(grupos).slice(0, 5));
      });
  }, []);

  const traducirEstado = (status) => {
    if (status === "pending") return "Pendiente";
    if (status === "confirmed") return "Confirmada";
    if (status === "cancelled") return "Cancelada";
    return status;
  };

  const statItems = [
    { label: "Clientes registrados", value: stats.users },
    { label: "Mascotas registradas", value: stats.pets },
    { label: "Servicios disponibles", value: stats.services },
    { label: "Citas totales", value: stats.appointments },
    { label: "Pedidos pendientes", value: pedidos.length },
  ];

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
          Panel de Control
        </h2>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
            gap: "20px",
            marginBottom: "48px",
          }}
        >
          {statItems.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "white",
                border: "1px solid #eadfce",
                borderRadius: "20px",
                padding: "28px",
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                borderLeft: "4px solid #1f1f1f",
              }}
            >
              <p
                style={{ color: "#666", fontSize: "13px", marginBottom: "8px" }}
              >
                {stat.label}
              </p>
              <p style={{ fontSize: "2.5rem", fontWeight: "700", margin: 0 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Reservas recientes */}
        <h4 style={{ fontSize: "24px", marginBottom: "20px" }}>
          Reservas recientes
        </h4>
        <div
          style={{
            background: "white",
            border: "1px solid #eadfce",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {isMobile ? (
            // Vista móvil — tarjetas
            reservas.length === 0 ? (
              <p
                style={{ padding: "32px", textAlign: "center", color: "#666" }}
              >
                No hay reservas
              </p>
            ) : (
              reservas.map((r) => (
                <div
                  key={r.ids.join("-")}
                  style={{ padding: "16px", borderBottom: "1px solid #eadfce" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <strong>
                      {mascotas.find((m) => m.id === r.pet_id)?.name ||
                        r.pet_id}
                    </strong>
                    <span>{traducirEstado(r.status)}</span>
                  </div>
                  <div style={{ fontSize: "14px", color: "#666" }}>
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
                      marginTop: "8px",
                    }}
                  >
                    {new Date(r.start_date).toLocaleDateString("es-ES")} —{" "}
                    {r.end_date
                      ? new Date(r.end_date).toLocaleDateString("es-ES")
                      : "-"}
                  </div>
                </div>
              ))
            )
          ) : (
            // Vista escritorio — tabla
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#1f1f1f", color: "white" }}>
                <tr>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Mascota
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Servicio
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Fecha inicio
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>
                    Fecha fin
                  </th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
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
                  reservas.map((r) => (
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
                        {new Date(r.start_date).toLocaleDateString("es-ES")}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {r.end_date
                          ? new Date(r.end_date).toLocaleDateString("es-ES")
                          : "-"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {traducirEstado(r.status)}
                      </td>
                    </tr>
                  ))
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

export default AdminDashboard;
