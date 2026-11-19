export default function PremiumExperience() {
  return (
    <section className="premium">
      <div className="premium__content">
        <span className="premium__label">Experiencia boutique</span>

        <h2>Una estancia pensada para el bienestar real de cada mascota</h2>

        <p>
          PetBoutique combina alojamiento, cuidados personalizados, servicios
          adicionales y seguimiento digital para que cada dueño pueda gestionar
          la experiencia de su mascota con confianza.
        </p>

        <div className="premium__features">
          <div>
            <strong>Atención personalizada</strong>
            <span>Adaptada al perfil y necesidades de cada mascota.</span>
          </div>

          <div>
            <strong>Servicios premium</strong>
            <span>
              Peluquería, lavado y fotografía vinculados a la reserva.
            </span>
          </div>

          <div>
            <strong>Gestión digital</strong>
            <span>Reservas, extras y tienda desde una única plataforma.</span>
          </div>
        </div>
      </div>

      <div className="premium__visual">
        <div className="premium__box premium__box--main">
          <span>🐾</span>
          <h3>PetBoutique Care</h3>
          <p>Seguimiento, confort y servicios exclusivos.</p>
        </div>

        <div className="premium__box premium__box--small">
          <strong>+ Servicios</strong>
          <span>Peluquería · Fotos · Lavado</span>
        </div>
      </div>
    </section>
  );
}
