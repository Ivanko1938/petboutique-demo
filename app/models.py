from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, DateTime, Text
from sqlalchemy.orm import relationship
from .db.database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100))
    last_name = Column(String(150))
    email = Column(String(150), unique=True, index=True)
    hashed_password = Column(String(255))
    phone = Column(String(20))
    address = Column(String(255))

    pets = relationship("Pet", back_populates="owner")
    appointments = relationship("Appointment", back_populates="owner")


class Pet(Base):
    __tablename__ = "pets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    species = Column(String(50))
    breed = Column(String(100))
    age = Column(Integer)
    weight = Column(Numeric(5, 2))
    notes = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="pets")
    appointments = relationship("Appointment", back_populates="pet")


class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    date_time = Column(DateTime, nullable=False)
    service_type = Column(String(100))  # Ej: Grooming, Vet
    status = Column(String(20), default="Pending")

    user_id = Column(Integer, ForeignKey("users.id"))
    pet_id = Column(Integer, ForeignKey("pets.id"))

    owner = relationship("User", back_populates="appointments")
    pet = relationship("Pet", back_populates="appointments")


class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    category = Column(String(50))  # Ej: Training, Boarding
    price = Column(Numeric(10, 2))
    description = Column(Text)


class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    booking_date = Column(DateTime, default=datetime.utcnow)
    start_date = Column(DateTime)
    end_date = Column(DateTime, nullable=True)
    status = Column(String(20), default="pending")

    user_id = Column(Integer, ForeignKey("users.id"))
    pet_id = Column(Integer, ForeignKey("pets.id"))
    service_id = Column(Integer, ForeignKey("services.id"))

    user = relationship("User")
    pet = relationship("Pet")
    service = relationship("Service")


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    brand = Column(String(50))
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, default=0)
    description = Column(Text)
    category = Column(String(50))
    image_url = Column(String(500))


class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    order_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="pending")
    total = Column(Numeric(10, 2))
    nombre = Column(String(200))
    direccion = Column(String(255))
    ciudad = Column(String(100))
    cp = Column(String(10))
    telefono = Column(String(20))
    metodo_pago = Column(String(50))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    user = relationship("User")
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    cantidad = Column(Integer)
    precio = Column(Numeric(10, 2))

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
