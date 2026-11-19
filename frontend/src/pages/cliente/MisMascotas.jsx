import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

function MisMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [notas, setNotas] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cargarMascotas = () => {
    const url = userId
      ? `${API_URL}/pets/?owner_id=${userId}`
      : `${API_URL}/pets/`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setMascotas(data))
      .catch(console.error);
  };

  useEffect(() => {
    cargarMascotas();
  }, []);

  const abrirModalEditar = (mascota) => {
    setEditando(mascota.id);
    setNombre(mascota.name);
    setEspecie(mascota.species);
    setRaza(mascota.breed || "");
    setEdad(mascota.age || "");
    setPeso(mascota.weight || "");
    setNotas(mascota.notes || "");
    setShowModal(true);
  };

  const abrirModalNueva = () => {
    setEditando(null);
    setNombre("");
    setEspecie("");
    setRaza("");
    setEdad("");
    setPeso("");
    setNotas("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const body = {
      name: nombre,
      species: especie,
      breed: raza,
      age: edad ? parseInt(edad) : null,
      weight: peso ? parseFloat(peso) : null,
      notes: notas,
    };
    try {
      const url = editando
        ? `${API_URL}/pets/${editando}`
        : `${API_URL}/pets/?owner_id=${userId}`;
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
        setShowModal(false);
        cargarMascotas();
      } else {
        const data = await res.json();
        setError(
          typeof data.detail === "string" ? data.detail : "Error al guardar",
        );
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    }
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar mascota?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E76F51",
      cancelButtonColor: "#8b7355",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    const res = await fetch(`${API_URL}/pets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      Swal.fire("Eliminada", "La mascota ha sido eliminada", "success");
      cargarMascotas();
    } else {
      Swal.fire("Error", "No se pudo eliminar la mascota", "error");
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
  const labelStyle = {
    display: "block",
    fontWeight: "700",
    marginBottom: "8px",
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
          <Link
            to="/inicio"
            style={{ color: "#8b7355", fontSize: "14px", fontWeight: "600" }}
          >
            ← Volver al inicio
          </Link>
          <h2 style={{ fontSize: isMobile ? "28px" : "40px", margin: 0 }}>
            Mis Mascotas
          </h2>
          <button className="btn btn-primary" onClick={abrirModalNueva}>
            + Añadir mascota
          </button>
        </div>

        {mascotas.length === 0 ? (
          <p style={{ color: "#666" }}>
            No tienes mascotas registradas todavía
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            {mascotas.map((mascota) => (
              <div
                key={mascota.id}
                style={{
                  background: "white",
                  border: "1px solid #eadfce",
                  borderRadius: "24px",
                  padding: "28px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    background: "#1f1f1f",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "700",
                    fontSize: "22px",
                    marginBottom: "16px",
                  }}
                >
                  {mascota.name[0]}
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: "22px" }}>
                  {mascota.name}
                </h3>
                <p style={{ color: "#666", margin: "0 0 6px" }}>
                  <strong>Especie:</strong> {mascota.species}
                </p>
                <p style={{ color: "#666", margin: "0 0 6px" }}>
                  <strong>Raza:</strong> {mascota.breed}
                </p>
                <p style={{ color: "#666", margin: "0 0 6px" }}>
                  <strong>Edad:</strong> {mascota.age} años
                </p>
                <p style={{ color: "#666", margin: "0 0 16px" }}>
                  <strong>Notas:</strong> {mascota.notes}
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => abrirModalEditar(mascota)}
                    style={{
                      background: "#1f1f1f",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "13px",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(mascota.id)}
                    style={{
                      background: "#E76F51",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
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
            ))}
          </div>
        )}

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
                  {editando ? "Editar mascota" : "Añadir mascota"}
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
              {error && (
                <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre de tu mascota"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Especie</label>
                  <select
                    value={especie}
                    onChange={(e) => setEspecie(e.target.value)}
                    style={inputStyle}
                    required
                  >
                    <option value="">-- Selecciona especie --</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Raza</label>
                  <input
                    type="text"
                    placeholder="Raza de tu mascota"
                    value={raza}
                    onChange={(e) => setRaza(e.target.value)}
                    style={inputStyle}
                  />
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
                    <label style={labelStyle}>Edad (años)</label>
                    <input
                      type="number"
                      placeholder="Edad"
                      value={edad}
                      onChange={(e) => setEdad(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Peso (kg)</label>
                    <input
                      type="number"
                      placeholder="Peso"
                      step="0.1"
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "28px" }}>
                  <label style={labelStyle}>Observaciones</label>
                  <textarea
                    placeholder="Alergias, enfermedades..."
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    style={{ ...inputStyle, minHeight: "80px" }}
                  ></textarea>
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
                  {editando ? "Guardar cambios" : "Guardar mascota"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default MisMascotas;
