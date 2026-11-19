import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const extraServices = [
  {
    id: "peluqueria",
    name: "Peluquería",
    description: "Corte, cepillado y cuidado estético antes de volver a casa.",
    price: 35,
    image: "/service-peluqueria.jpg",
  },
  {
    id: "lavado",
    name: "Lavado",
    description: "Baño completo adaptado al tipo de pelaje de cada mascota.",
    price: 22,
    image: "/service-lavado.jpg",
  },
  {
    id: "fotos",
    name: "Sesión de fotos",
    description: "Recuerdos digitales de la experiencia en PetBoutique.",
    price: 45,
    image: "/service-fotos.jpg",
  },
  {
    id: "alimentacion",
    name: "Alimentación especial",
    description: "Plan adaptado a necesidades concretas de alimentación.",
    price: 18,
    image: "/service-alimentacion.jpg",
  },
  {
    id: "recogida",
    name: "Recogida y entrega",
    description: "Servicio cómodo para facilitar la llegada y salida.",
    price: 30,
    image: "/service-recogida.jpg",
  },
  {
    id: "cuidado",
    name: "Cuidado adicional",
    description:
      "Atención personalizada para mascotas con necesidades concretas.",
    price: 28,
    image: "/service-cuidado.jpg",
  },
];

export default function AdditionalServices({ onAddService }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="additional-services" id="servicios-extra">
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginBottom: "40px",
          gap: isMobile ? "24px" : "60px",
        }}
      >
        <div className="section-heading">
          <span className="section-tag">Opcionales</span>
          <h2>Personaliza la experiencia de tu mascota</h2>
          <p>
            Añade servicios complementarios a la estancia para crear una reserva
            más completa y adaptada.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <div
            style={{
              background: "white",
              border: "1px solid #eadfce",
              borderRadius: "20px",
              padding: isMobile ? "20px" : "32px",
              flexGrow: 1,
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              marginTop: isMobile ? "0" : "40px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div>
              <h4 style={{ color: "#2D6A4F", marginBottom: "8px" }}>
                🛒 Nuestra tienda
              </h4>
              <p
                style={{
                  color: "#666",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  margin: 0,
                }}
              >
                Descubre nuestros productos para tu mascota. ¡Sin necesidad de
                registro!
              </p>
            </div>
            <Link
              to="/tienda"
              className="btn btn-primary"
              style={{ whiteSpace: "nowrap", flexShrink: 0 }}
            >
              Ver tienda
            </Link>
          </div>
        </div>
      </div>
      <div className="extra-services-grid">
        {extraServices.map((service) => (
          <article className="extra-service-card" key={service.id}>
            <img
              src={service.image}
              alt={service.name}
              className="extra-service-image"
            />
            <div className="extra-service-content">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
