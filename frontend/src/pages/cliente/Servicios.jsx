import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarCliente from "../../components/NavbarCliente";
import Footer from "../../components/Footer";

const servicios = [
  {
    id: 1,
    nombre: "Guardería",
    descripcion:
      "Cuidamos de tu mascota mientras no estás. Espacios amplios, personal cualificado y atención personalizada.",
    items: [
      "Estancias de día o noche",
      "Atención 24 horas",
      "Actividades y juegos",
    ],
    slug: "guarderia",
  },
  {
    id: 2,
    nombre: "Peluquería",
    descripcion:
      "Tu mascota siempre guapa y bien cuidada con nuestros profesionales especializados.",
    items: ["Baño y secado", "Corte de pelo", "Corte de uñas"],
    slug: "peluqueria",
  },
  {
    id: 3,
    nombre: "Veterinario Básico",
    descripcion:
      "Revisiones y cuidados básicos de salud para mantener a tu mascota en perfecto estado.",
    items: ["Revisiones generales", "Vacunaciones", "Desparasitación"],
    slug: "veterinario",
  },
  {
    id: 4,
    nombre: "Adiestrador",
    descripcion:
      "Educación y entrenamiento personalizado para una convivencia feliz.",
    items: [
      "Obediencia básica",
      "Corrección de conductas",
      "Sesiones individuales y grupales",
    ],
    slug: "adiestrador",
  },
];

function Servicios() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <div className="section-heading">
          <span>Nuestros servicios</span>
          <h2>Todo lo que tu mascota necesita</h2>
          <p>
            Ofrecemos servicios premium para el cuidado y bienestar de tu
            mascota.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "24px",
            marginTop: "40px",
          }}
        >
          {servicios.map((servicio) => (
            <div key={servicio.id} className="extra-service-card">
              <h3>{servicio.nombre}</h3>
              <p>{servicio.descripcion}</p>
              <ul
                style={{
                  marginTop: "12px",
                  paddingLeft: "20px",
                  color: "#666",
                }}
              >
                {servicio.items.map((item) => (
                  <li key={item} style={{ marginBottom: "6px" }}>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to={`/reservar?servicio=${servicio.slug}`}
                className="btn btn-primary"
                style={{ marginTop: "20px", display: "inline-block" }}
              >
                Reservar
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Servicios;
