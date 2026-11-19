import { Link } from "react-router-dom";
export default function Hero() {
  return (
    <section className="hero hero-image">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <span className="hero-badge">Hotel premium para mascotas</span>

        <h1>Cuidado boutique para mascotas felices</h1>

        <p>
          Reserva estancias, añade servicios exclusivos y gestiona el bienestar
          de tu mascota desde una plataforma sencilla, elegante y segura.
        </p>

        <div className="hero-buttons">
          <Link to="/registro" className="btn btn-primary">
            Reserva
          </Link>
        </div>
      </div>
    </section>
  );
}
