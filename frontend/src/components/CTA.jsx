import { Link } from "react-router-dom";
export default function CTA() {
  return (
    <section className="cta">
      <div className="cta__container">
        <h2>Reserva una experiencia premium</h2>
        <p>Sin llamadas, sin complicaciones. Todo desde una sola plataforma.</p>

        <div className="cta__buttons">
          <Link to="/registro" className="btn btn-primary">
            Regístrate
          </Link>
        </div>
      </div>
    </section>
  );
}
