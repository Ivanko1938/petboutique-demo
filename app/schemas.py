from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from decimal import Decimal


# --- PETS ---
class PetBase(BaseModel):
    name: str
    species: Optional[str] = "Desconocida"
    breed: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    notes: Optional[str] = None


class PetCreate(PetBase):
    pass


class Pet(PetBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

    class Config:
        from_attributes = True


# --- USERS ---
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address: Optional[str] = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    pets: List[Pet] = []

    class Config:
        from_attributes = True


# --- APPOINTMENTS ---
class AppointmentBase(BaseModel):
    date_time: datetime
    service_type: str
    status: str = "Pending"
    user_id: int
    pet_id: int


class AppointmentCreate(AppointmentBase):
    pass


class Appointment(AppointmentBase):
    id: int
    user_id: int
    status: str

    class Config:
        from_attributes = True


# --- SERVICES ---
class ServiceBase(BaseModel):
    name: str
    category: Optional[str] = None
    price: Decimal
    description: Optional[str] = None


class ServiceCreate(ServiceBase):
    pass


class Service(ServiceBase):
    id: int

    class Config:
        from_attributes = True


# --- BOOKINGS ---
class BookingBase(BaseModel):
    start_date: datetime
    end_date: Optional[datetime] = None
    user_id: int
    pet_id: int
    service_id: int


class BookingCreate(BookingBase):
    pass


class Booking(BookingBase):
    id: int
    booking_date: datetime
    status: str

    class Config:
        from_attributes = True


# --- PRODUCTS ---
class ProductBase(BaseModel):
    name: str
    brand: Optional[str] = None
    price: Decimal
    stock: int = 0
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None


# --- ORDERS ---
class OrderItemCreate(BaseModel):
    product_id: int
    cantidad: int
    precio: Decimal


class OrderCreate(BaseModel):
    nombre: str
    direccion: str
    ciudad: str
    cp: str
    telefono: str
    metodo_pago: str
    total: Decimal
    user_id: Optional[int] = None
    items: List[OrderItemCreate] = []


class OrderItem(BaseModel):
    id: int
    product_id: int
    cantidad: int
    precio: Decimal

    class Config:
        from_attributes = True


class Order(BaseModel):
    id: int
    order_date: datetime
    status: str
    total: Decimal
    nombre: str
    direccion: str
    ciudad: str
    cp: str
    telefono: str
    metodo_pago: str
    user_id: Optional[int] = None
    items: List[OrderItem] = []


class Config:
    from_attributes = True
