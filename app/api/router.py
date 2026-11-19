from fastapi import APIRouter

from app import auth
from app.api import users, pets, appointments, services, bookings, products, orders, chatbot

api_router = APIRouter()

#  AUTENTICACIÓN - mis endpoints en swagger
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(pets.router, prefix="/pets", tags=["Pets"])
api_router.include_router(
    appointments.router, prefix="/appointments", tags=["Appointments"]
)
api_router.include_router(services.router, prefix="/services", tags=["Services"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(chatbot.router, prefix="/chat", tags=["Chatbot"])