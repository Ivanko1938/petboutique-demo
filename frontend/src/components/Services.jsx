const services = [
  {
    title: "Hotel y estancias",
    text: "Reservas por días u horas con disponibilidad organizada y experiencia premium.",
  },
  {
    title: "Peluquería y lavado",
    text: "Servicios extra para que tu mascota vuelva limpia, cuidada y feliz.",
  },
  {
    title: "Sesiones de fotos",
    text: "Recuerdos profesionales para dueños que quieren una experiencia única.",
  },
  {
    title: "Tienda boutique",
    text: "Productos y accesorios seleccionados para una mascota bien atendida.",
  },
];

export default function Services() {
  return (
    <section className="services" id="servicios">
      <div className="section-heading">
        <span>Servicios</span>
        <h2>Todo lo que necesita tu mascota en un solo lugar</h2>
        <p>
          PetBoutique integra reservas, extras premium y tienda en una misma experiencia digital.
        </p>
      </div>

      <div className="services__grid">
        {services.map((service) => (
          <article className="service-card" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}