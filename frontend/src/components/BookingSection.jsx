export default function BookingSection({
  petType,
  setPetType,
  entryDate,
  setEntryDate,
  exitDate,
  setExitDate,
  mainService,
  setMainService,
  selectedServices = [],
  onRemoveService,
}) {
  const basePrices = {
    "Estancia premium": 60,
    "Guardería de día": 35,
    "Estancia de fin de semana": 80,
  };

  const formatDate = (date) => {
    if (!date) return "Seleccionar";

    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  };

  const basePrice = basePrices[mainService] || 0;

  const extrasTotal = selectedServices.reduce(
    (total, service) => total + Number(service.price || 0),
    0
  );

  const totalPrice = basePrice + extrasTotal;

  return (
    <section className="booking-section" id="reservas">
      <div className="section-heading">
        <span>Reservas</span>
        <h2>Reserva tu estancia en pocos pasos</h2>
        <p>
          Selecciona el tipo de mascota, las fechas y los servicios adicionales
          para preparar una experiencia adaptada.
        </p>
      </div>

      <div className="booking-box">
        <div className="booking-form-preview">
          <div className="form-group">
            <label>Tipo de mascota</label>
            <select value={petType} onChange={(e) => setPetType(e.target.value)}>
              <option>Perro</option>
              <option>Gato</option>
              <option>Conejo</option>
              <option>Ave</option>
            </select>
          </div>

          <div className="booking-dates">
            <div className="form-group">
              <label>Entrada</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Salida</label>
              <input
                type="date"
                value={exitDate}
                onChange={(e) => setExitDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Servicio principal</label>
            <select
              value={mainService}
              onChange={(e) => setMainService(e.target.value)}
            >
              <option>Estancia premium</option>
              <option>Guardería de día</option>
              <option>Estancia de fin de semana</option>
            </select>
          </div>

          <button className="btn btn-primary full-width">
            Comenzar reserva
          </button>
        </div>

        <div className="booking-summary-card">
          <span className="summary-label">Vista previa</span>
          <h3>Tu reserva</h3>

          <p>
            {mainService} · {petType} ·{" "}
            {entryDate && exitDate
              ? `${formatDate(entryDate)} - ${formatDate(exitDate)}`
              : "Fechas pendientes"}
          </p>

          <div className="summary-list">
            <span>Habitación confortable</span>
            <span>Seguimiento digital</span>
            <span>Servicios extra opcionales</span>
          </div>

          <div className="selected-services">
            <h4>Servicios añadidos</h4>

            {selectedServices.length > 0 ? (
              <div className="services-list">
                {selectedServices.map((service) => (
                  <span key={service.id} className="service-chip">
                    {service.name} · {Number(service.price).toFixed(2)} €
                    <button
                      className="remove-service"
                      onClick={() => onRemoveService(service.id)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="no-services">Aún no has añadido servicios</p>
            )}
          </div>

          <div className="price-summary">
            <div>
              <span>Servicio principal</span>
              <strong>{basePrice.toFixed(2)} €</strong>
            </div>

            <div>
              <span>Extras añadidos</span>
              <strong>{extrasTotal.toFixed(2)} €</strong>
            </div>

            <div className="price-summary__total">
              <span>Total estimado</span>
              <strong>{totalPrice.toFixed(2)} €</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}