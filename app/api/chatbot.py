from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
import requests
import os

load_dotenv()

router = APIRouter()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM = """Eres el asistente virtual de PetBoutique, una boutique de animales de confianza.

Servicios que ofrecemos:
- Guardería: servicio de residencia tanto diaria como vacacional
- Peluquería: estética y cuidado del pelaje
- Veterinario: atención básica y seguimiento de salud
- Adiestrador: educación y comportamiento
- Tienda online: productos de alimentación, juguetes, accesorios e higiene

Normas importantes:
- NO menciones precios ni rangos de precios bajo ninguna circunstancia
- NO ofrezcas ni gestiones reservas, citas ni disponibilidad
- Para reservas o precios, indica siempre que contacten con nosotros directamente o se registren en la web
- Responde de forma amable, breve y en español
- Si no sabes algo, indica que pueden contactar con el equipo de PetBoutique
- Indica siempre que si tienen mas dudas contacten con nosotros y que pueden concertar una cita por telefono para visitar las instalaciones"""


class Message(BaseModel):
    messages: list


@router.post("/")
def chat(data: Message):
    # Sin clave de Groq, el chatbot avisa en lugar de dar error
    if not GROQ_API_KEY:
        return {
            "reply": "El asistente no está disponible en esta demo. Para activarlo, añade GROQ_API_KEY al archivo .env."
        }

    messages = [{"role": "system", "content": SYSTEM}] + data.messages
    response = requests.post(
        GROQ_URL,
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "llama-3.3-70b-versatile",
            "messages": messages,
            "max_tokens": 1000,
        },
        timeout=30,
    )
    result = response.json()
    return {"reply": result["choices"][0]["message"]["content"]}
