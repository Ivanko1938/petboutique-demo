import { API_URL } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";
import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";

function Reservar() {
  const [servicios, setServicios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [petId, setPetId] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hora, setHora] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categorias = {
    guarderia: "Guardería",
    peluqueria: "Peluquería",
    veterinario: "Veterinario",
    adiestrador: "Adiestrador",
  };

  const esGuarderia = categoriaSeleccionada === "guarderia";
  const esEstanciaPremium = serviciosSeleccionados.some((s) =>
    s.name.toLowerCase().includes("estancia premium"),
  );
  const esFinDeSemana = serviciosSeleccionados.some((s) =>
    s.name.toLowerCase().includes("fin de semana"),
  );
  const mostrarFechaFin = esEstanciaPremium || esFinDeSemana;
  const esPeluqueria = categoriaSeleccionada === "peluqueria";

  useEffect(() => {
    fetch(`${API_URL}/services/`)
      .then((r) => r.json())
      .then((d) => setServicios(d))
      .catch((err) => console.error(err));

    const userId = localStorage.getItem("user_id");
    fetch(`${API_URL}/pets/?owner_id=${userId}`)
      .then((r) => r.json())
      .then((d) => setMascotas(d))
      .catch((err) => console.error(err));
  }, []);

  const serviciosPorCategoria = (cat) =>
    servicios.filter((s) => s.category === cat);

  const toggleServicio = (servicio) => {
    setServiciosSeleccionados((prev) => {
      const existe = prev.find((s) => s.id === servicio.id);
      if (existe) return prev.filter((s) => s.id !== servicio.id);
      return [...prev, servicio];
    });
  };

  const calcularPrecio = () => {
    if (serviciosSeleccionados.length === 0) return 0;
    let total = 0;
    const nombres = serviciosSeleccionados.map((s) => s.name.toLowerCase());
    const tieneOtroServicioPeluqueria =
      nombres.includes("corte") || nombres.includes("lavado");
    for (const s of serviciosSeleccionados) {
      const precio = parseFloat(s.price) || 0;
      if (s.name.toLowerCase() === "peinado" && tieneOtroServicioPeluqueria) {
        total += 5;
      } else if (
        esGuarderia &&
        s.category === "guarderia" &&
        s.name.toLowerCase().includes("estancia premium")
      ) {
        if (startDate && endDate) {
          const dias = Math.max(
            1,
            Math.ceil(
              (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24),
            ),
          );
          total += precio * dias;
        } else {
          total += precio;
        }
      } else {
        total += precio;
      }
    }
    return total;
  };

  const totalPrice = useMemo(
    () => Number(calcularPrecio()) || 0,
    [serviciosSeleccionados, startDate, endDate],
  );
  const deposito = (totalPrice * 0.2).toFixed(2);

  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
    setServiciosSeleccionados([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (serviciosSeleccionados.length === 0) {
      setMensaje("❌ Selecciona al menos un servicio");
      return;
    }
    const startDateTime = `${startDate}T${hora}:00`;
    const endDateTime = endDate ? `${endDate}T${hora}:00` : startDateTime;
    try {
      setCargando(true);
      for (const servicio of serviciosSeleccionados) {
        const body = {
          start_date: startDateTime,
          end_date: endDateTime,
          user_id: Number(localStorage.getItem("user_id")),
          pet_id: Number(petId),
          service_id: servicio.id,
          status: "pending",
        };
        await fetch(`${API_URL}/bookings/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      localStorage.setItem("reserva_deposito", deposito);
      localStorage.setItem(
        "reserva_servicios",
        JSON.stringify(serviciosSeleccionados.map((s) => s.name)),
      );
      navigate("/checkout-reserva");
    } catch (err) {
      setMensaje("❌ Error de conexión");
      setCargando(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d9cbbb",
    background: "#fffaf3",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const cardStyle = {
    background: "white",
    border: "1px solid #eadfce",
    borderRadius: "24px",
    padding: isMobile ? "20px" : "32px",
    marginBottom: "24px",
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

        <div className="section-heading">
          <span>Reservas</span>
          <h2>Hacer una Reserva</h2>
          <p>Selecciona tu mascota, el servicio y las fechas.</p>
        </div>

        {mensaje && (
          <p style={{ marginTop: "20px", fontWeight: "600" }}>{mensaje}</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 0.8fr",
            gap: "32px",
            marginTop: "40px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={cardStyle}>
              <h4 style={{ marginBottom: "20px" }}>Datos de la mascota</h4>
              <select
                value={petId}
                onChange={(e) => setPetId(e.target.value)}
                style={inputStyle}
                required
              >
                <option value="">-- Selecciona una mascota --</option>
                {mascotas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <Link
                to="/mis-mascotas"
                style={{
                  color: "#8b7355",
                  fontWeight: "600",
                  fontSize: "14px",
                  display: "block",
                  marginTop: "12px",
                }}
              >
                + Añadir nueva mascota
              </Link>
            </div>

            <div style={cardStyle}>
              <h4 style={{ marginBottom: "20px" }}>Tipo de servicio</h4>
              <select
                value={categoriaSeleccionada}
                onChange={handleCategoriaChange}
                style={inputStyle}
                required
              >
                <option value="">-- Selecciona una categoría --</option>
                {Object.entries(categorias).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {categoriaSeleccionada && (
              <div style={cardStyle}>
                <h4 style={{ marginBottom: "20px" }}>
                  {esPeluqueria
                    ? "Selecciona los servicios (puedes combinar)"
                    : "Selecciona el servicio"}
                </h4>
                {serviciosPorCategoria(categoriaSeleccionada).map((s) => (
                  <label
                    key={s.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginBottom: "12px",
                      cursor: "pointer",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: `2px solid ${serviciosSeleccionados.find((x) => x.id === s.id) ? "#2D6A4F" : "#eadfce"}`,
                      background: serviciosSeleccionados.find(
                        (x) => x.id === s.id,
                      )
                        ? "#f0faf5"
                        : "white",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <input
                        type={esPeluqueria ? "checkbox" : "radio"}
                        name="servicio"
                        checked={
                          !!serviciosSeleccionados.find((x) => x.id === s.id)
                        }
                        onChange={() => {
                          if (esPeluqueria) {
                            toggleServicio(s);
                          } else {
                            setServiciosSeleccionados([s]);
                          }
                        }}
                      />
                      <span style={{ fontWeight: "600" }}>{s.name}</span>
                      {s.name.toLowerCase() === "peinado" && (
                        <span style={{ fontSize: "12px", color: "#888" }}>
                          (5€ combinado)
                        </span>
                      )}
                    </div>
                    <span style={{ color: "#E76F51", fontWeight: "700" }}>
                      {s.name.toLowerCase() === "peinado" &&
                      serviciosSeleccionados.find(
                        (x) =>
                          x.name.toLowerCase() === "corte" ||
                          x.name.toLowerCase() === "lavado",
                      )
                        ? "5€"
                        : `${s.price}€`}
                      {s.name.toLowerCase().includes("estancia premium")
                        ? "/día"
                        : ""}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {esGuarderia && serviciosSeleccionados.length > 0 && (
              <div style={cardStyle}>
                <h4 style={{ marginBottom: "20px" }}>Extras</h4>
                {servicios
                  .filter((s) =>
                    s.name.toLowerCase().includes("alimentación especial"),
                  )
                  .map((s) => (
                    <label
                      key={s.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginBottom: "12px",
                        cursor: "pointer",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: `2px solid ${serviciosSeleccionados.find((x) => x.id === s.id) ? "#2D6A4F" : "#eadfce"}`,
                        background: serviciosSeleccionados.find(
                          (x) => x.id === s.id,
                        )
                          ? "#f0faf5"
                          : "white",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={
                            !!serviciosSeleccionados.find((x) => x.id === s.id)
                          }
                          onChange={() => toggleServicio(s)}
                        />
                        <span style={{ fontWeight: "600" }}>
                          Alimentación especial
                        </span>
                      </div>
                      <span style={{ color: "#E76F51", fontWeight: "700" }}>
                        18€
                      </span>
                    </label>
                  ))}
              </div>
            )}

            <div style={cardStyle}>
              <h4 style={{ marginBottom: "20px" }}>Servicios adicionales</h4>
              {[
                { id: "extra-fotos", name: "Sesión de fotos", price: 45 },
                { id: "extra-recogida", name: "Recogida y entrega", price: 35 },
              ].map((s) => (
                <label
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginBottom: "12px",
                    cursor: "pointer",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: `2px solid ${serviciosSeleccionados.find((x) => x.id === s.id) ? "#2D6A4F" : "#eadfce"}`,
                    background: serviciosSeleccionados.find(
                      (x) => x.id === s.id,
                    )
                      ? "#f0faf5"
                      : "white",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        !!serviciosSeleccionados.find((x) => x.id === s.id)
                      }
                      onChange={() => toggleServicio(s)}
                    />
                    <span style={{ fontWeight: "600" }}>{s.name}</span>
                  </div>
                  <span style={{ color: "#E76F51", fontWeight: "700" }}>
                    {s.price}€
                  </span>
                </label>
              ))}
            </div>

            <div style={cardStyle}>
              <h4 style={{ marginBottom: "20px" }}>Fecha y hora</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : mostrarFechaFin
                      ? "1fr 1fr 1fr"
                      : "1fr 1fr",
                  gap: "16px",
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
                    Fecha inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      const fecha = e.target.value;
                      setStartDate(fecha);
                      if (esFinDeSemana && fecha) {
                        const viernes = new Date(fecha);
                        const diaSemana = viernes.getDay();
                        if (diaSemana === 5) {
                          const lunes = new Date(viernes);
                          lunes.setDate(lunes.getDate() + 3);
                          setEndDate(lunes.toISOString().split("T")[0]);
                        } else {
                          setEndDate("");
                          Swal.fire({
                            icon: "warning",
                            title: "Día incorrecto",
                            text: "Por favor selecciona un viernes.",
                            confirmButtonColor: "#2D6A4F",
                          });
                          setStartDate("");
                        }
                      }
                    }}
                    style={inputStyle}
                    required
                  />
                  {esFinDeSemana && endDate && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#E76F51",
                        marginTop: "8px",
                        fontWeight: "600",
                      }}
                    >
                      ⚠️ Recogida máximo el lunes a las 12:00
                    </p>
                  )}
                </div>
                {mostrarFechaFin && (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontWeight: "700",
                        marginBottom: "8px",
                      }}
                    >
                      Fecha fin
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) =>
                        !esFinDeSemana && setEndDate(e.target.value)
                      }
                      style={{
                        ...inputStyle,
                        background: esFinDeSemana ? "#f0f0f0" : "#fffaf3",
                        cursor: esFinDeSemana ? "not-allowed" : "pointer",
                      }}
                      readOnly={esFinDeSemana}
                    />
                  </div>
                )}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    Hora
                  </label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={cargando}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                fontSize: "16px",
                opacity: cargando ? 0.6 : 1,
              }}
            >
              {cargando ? "Enviando..." : "Confirmar reserva"}
            </button>
          </form>

          <div
            style={{
              ...cardStyle,
              marginBottom: 0,
              height: "fit-content",
              position: isMobile ? "static" : "sticky",
              top: "24px",
            }}
          >
            <span className="summary-label">Resumen</span>
            <h3 style={{ fontSize: "28px", margin: "12px 0" }}>Tu reserva</h3>
            {serviciosSeleccionados.length === 0 ? (
              <p style={{ color: "#666", lineHeight: "1.6" }}>
                Selecciona un servicio para ver el resumen.
              </p>
            ) : (
              <>
                <div
                  style={{
                    borderTop: "1px solid #eadfce",
                    paddingTop: "16px",
                    marginTop: "16px",
                  }}
                >
                  {serviciosSeleccionados.map((s) => {
                    const nombres = serviciosSeleccionados.map((x) =>
                      x.name.toLowerCase(),
                    );
                    const esPeinadoCombinado =
                      s.name.toLowerCase() === "peinado" &&
                      (nombres.includes("corte") || nombres.includes("lavado"));
                    const precio = esPeinadoCombinado ? 5 : s.price;
                    return (
                      <div
                        key={s.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <span style={{ color: "#444" }}>{s.name}</span>
                        <span style={{ fontWeight: "700" }}>{precio}€</span>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    borderTop: "2px solid #2D6A4F",
                    paddingTop: "16px",
                    marginTop: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontWeight: "700", fontSize: "18px" }}>
                      Total
                    </span>
                    <span
                      style={{
                        fontWeight: "700",
                        fontSize: "18px",
                        color: "#E76F51",
                      }}
                    >
                      {totalPrice.toFixed(2)}€
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    background: "#f0faf5",
                    border: "1px solid #2D6A4F",
                    borderRadius: "12px",
                    padding: "16px",
                    marginTop: "16px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#2D6A4F",
                      lineHeight: "1.6",
                    }}
                  >
                    <strong>💳 Reserva con el {deposito}€</strong> (20% del
                    total). El resto se abona en el momento de entrega.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Reservar;
