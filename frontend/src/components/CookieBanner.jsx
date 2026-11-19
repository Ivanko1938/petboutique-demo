import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cookiesChoice = localStorage.getItem("petboutique-cookies");

    if (!cookiesChoice) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice) => {
    localStorage.setItem("petboutique-cookies", choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <div className="cookie-banner-text">
          <h4>Cookies y privacidad</h4>

          <p>
            Utilizamos cookies para mejorar la experiencia de navegación y
            ofrecer funcionalidades básicas de la plataforma.
          </p>
        </div>

        <div className="cookie-banner-buttons">
          <button
            className="btn btn-outline"
            onClick={() => handleChoice("rejected")}
          >
            Rechazar
          </button>

          <button
            className="btn btn-primary"
            onClick={() => handleChoice("accepted")}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}