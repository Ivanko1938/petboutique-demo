const steps = [
  {
    number: "01",
    title: "Registra",
    text: "Registrate en nuestra pagina para acceder a todos los servidios disponibles.",
  },
  {
    number: "02",
    title: "Personaliza",
    text: "Añade servicios premium como peluquería, sesiones o cuidados especiales.",
  },
  {
    number: "03",
    title: "Reserva",
    text: "Selecciona fechas y disponibilidad en pocos clics desde la plataforma.",
  },
];

export default function HowItWorks() {
  return (
    <section className="how" id="como-funciona">
      <div className="section-heading">
        <span>Proceso</span>
        <h2>Cómo funciona PetBoutique</h2>
        <p>
          Un proceso simple diseñado para ofrecer la mejor experiencia tanto a
          dueños como a mascotas.
        </p>
      </div>

      <div className="how__grid">
        {steps.map((step) => (
          <div className="how__step" key={step.number}>
            <div className="how__number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
