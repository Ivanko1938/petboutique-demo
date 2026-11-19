import { API_URL } from "../services/api";
import { useState } from "react";

const QUICK_QUESTIONS = [
  "¿Qué servicios ofrecéis?",
  "¿Cómo puedo hacer una reserva?",
  "¿Cuáles son los precios?",
  "¿Tenéis tienda online?",
];

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "¡Hola! Soy el asistente de PetBoutique. ¿En qué puedo ayudarte?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const [open, setOpen] = useState(false);

  const isMobile = window.innerWidth < 768;

  const sendMsg = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setShowQuick(false);
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Lo siento, ha habido un error. Por favor intenta de nuevo.",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div
      style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000 }}
    >
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: isMobile ? "80vh" : "500px",
            width: isMobile ? "calc(100vw - 32px)" : "380px",
            border: "1px solid #eadfce",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
            marginBottom: "12px",
            background: "white",
            position: isMobile ? "fixed" : "relative",
            bottom: isMobile ? "80px" : "auto",
            right: isMobile ? "16px" : "auto",
            left: isMobile ? "16px" : "auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#1f1f1f",
              color: "white",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "#ebe3d7",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🐾
              </div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>
                  Asistente PetBoutique
                </div>
                <div style={{ fontSize: "11px", opacity: "0.7" }}>
                  Estoy aquí para ayudarte
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ✕
            </button>
          </div>

          {/* Mensajes */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "#f7f4ef",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  background: msg.role === "user" ? "#1f1f1f" : "white",
                  color: msg.role === "user" ? "white" : "#1f1f1f",
                  border:
                    msg.role === "assistant" ? "1px solid #eadfce" : "none",
                  borderBottomRightRadius: msg.role === "user" ? "4px" : "12px",
                  borderBottomLeftRadius:
                    msg.role === "assistant" ? "4px" : "12px",
                }}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  background: "white",
                  border: "1px solid #eadfce",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  color: "#888",
                  alignSelf: "flex-start",
                  fontStyle: "italic",
                }}
              >
                Escribiendo...
              </div>
            )}
          </div>

          {/* Preguntas rápidas */}
          {showQuick && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                padding: "8px 12px",
                background: "#f7f4ef",
                borderTop: "1px solid #eadfce",
              }}
            >
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMsg(q)}
                  style={{
                    background: "#ebe3d7",
                    border: "1px solid #eadfce",
                    borderRadius: "20px",
                    padding: "5px 12px",
                    fontSize: "12px",
                    cursor: "pointer",
                    color: "#1f1f1f",
                    fontWeight: "600",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              padding: "12px",
              borderTop: "1px solid #eadfce",
              background: "white",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMsg()}
              placeholder="Escribe tu pregunta..."
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #eadfce",
                borderRadius: "8px",
                fontSize: "14px",
                background: "#f7f4ef",
              }}
            />
            <button
              onClick={() => sendMsg()}
              disabled={loading}
              style={{
                background: "#1f1f1f",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "auto",
          height: "48px",
          borderRadius: "999px",
          background: "#1f1f1f",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "0 20px",
          float: "right",
        }}
      >
        ¿Necesitas ayuda?
      </button>
    </div>
  );
}

export default Chatbot;
