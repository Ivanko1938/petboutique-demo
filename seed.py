import sys
import os
from datetime import datetime, timedelta
import random

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.database import SessionLocal
from app import models
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

def seed_database():
    db = SessionLocal()
    try:
        print("Limpiando tablas...")
        db.query(models.Booking).delete()
        db.query(models.Appointment).delete()
        db.query(models.OrderItem).delete()
        db.query(models.Order).delete()
        db.query(models.Pet).delete()
        db.query(models.User).delete()
        db.query(models.Service).delete()
        db.query(models.Product).delete()
        db.commit()

        servicios = [
            models.Service(name="Estancia premium", category="guarderia", price=30.0, description="Estancia de larga duración"),
            models.Service(name="Guardería de día", category="guarderia", price=35.0, description="Cuidado durante el día"),
            models.Service(name="Guardería de fin de semana", category="guarderia", price=100.0, description="Cuidado fin de semana"),
            models.Service(name="Corte", category="peluqueria", price=35.0, description="Corte de pelo"),
            models.Service(name="Lavado", category="peluqueria", price=22.0, description="Baño completo"),
            models.Service(name="Peinado", category="peluqueria", price=20.0, description="Peinado y arreglo"),
            models.Service(name="Corte de uñas", category="peluqueria", price=5.0, description="Corte de uñas"),
            models.Service(name="Modificación de conducta", category="adiestrador", price=50.0, description="Clase 1 hora"),
            models.Service(name="Adiestramiento de cachorros", category="adiestrador", price=50.0, description="Clase 1 hora"),
            models.Service(name="Adiestramiento básico", category="adiestrador", price=50.0, description="Clase 1 hora"),
            models.Service(name="Obediencia", category="adiestrador", price=50.0, description="Clase 1 hora"),
            models.Service(name="Clases grupales", category="adiestrador", price=30.0, description="Clase grupal 1 hora"),
            models.Service(name="Revisión", category="veterinario", price=30.0, description="Revisión general"),
            models.Service(name="Vacunación", category="veterinario", price=30.0, description="Vacunación"),
            models.Service(name="Curas", category="veterinario", price=25.0, description="Curas y vendajes"),
            models.Service(name="Atención específica", category="veterinario", price=40.0, description="Atención especializada"),
            models.Service(name="Alimentación especial", category="extra", price=18.0, description="Plan adaptado"),
            models.Service(name="Sesión de fotos", category="extra", price=45.0, description="Fotos digitales"),
            models.Service(name="Recogida y entrega", category="extra", price=35.0, description="Servicio a domicilio"),
        ]
        db.add_all(servicios)
        db.commit()

        # PRODUCTOS
        productos = [
            models.Product(name="Pienso Premium Perro", image_url="https://images.unsplash.com/photo-1601758228006-964e41e5e8eb?w=600&h=400&fit=crop&q=80", brand="Royal Canin", price=45.99, stock=50, description="Pienso de alta calidad para perros adultos", category="alimentacion"),
            models.Product(name="Pienso Premium Gato", image_url="https://images.unsplash.com/photo-1596854331442-3cf47265cefb?w=600&h=400&fit=crop&q=80", brand="Purina", price=38.99, stock=40, description="Pienso de alta calidad para gatos adultos", category="alimentacion"),
            models.Product(name="Pelota de juguete", image_url="https://images.unsplash.com/photo-1514479425649-0981aca9fe41?w=600&h=400&fit=crop&q=80", brand="Kong", price=12.99, stock=100, description="Pelota resistente para perros", category="juguetes"),
            models.Product(name="Cama para mascotas", image_url="https://images.unsplash.com/photo-1581888227599-779811939961?w=600&h=400&fit=crop&q=80", brand="Ferplast", price=35.99, stock=30, description="Cama suave y cómoda para perros y gatos", category="accesorios"),
            models.Product(name="Champú para perros", image_url="https://images.unsplash.com/photo-1583534778255-5d67d3dcf95d?w=600&h=400&fit=crop&q=80", brand="Virbac", price=14.99, stock=60, description="Champú suave para el cuidado del pelo", category="higiene"),
            models.Product(name="Arnés regulable", image_url="https://images.unsplash.com/photo-1773086727839-8d9180b510fc?w=600&h=400&fit=crop&q=80", brand="Ruffwear", price=29.99, stock=45, description="Arnés cómodo y seguro para perros", category="accesorios"),
            models.Product(name="Rascador para gatos", image_url="https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&h=400&fit=crop&q=80", brand="Trixie", price=24.99, stock=35, description="Rascador con poste y plataforma", category="accesorios"),
            models.Product(name="Snacks naturales perro", image_url="https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=400&fit=crop&q=80", brand="Carnilove", price=8.99, stock=80, description="Snacks saludables de carne natural", category="alimentacion"),
            models.Product(name="Arenero automático", image_url="https://images.unsplash.com/photo-1727510153658-643787acb16a?w=600&h=400&fit=crop&q=80", brand="PetSafe", price=89.99, stock=15, description="Arenero autolimpiable para gatos", category="accesorios"),
            models.Product(name="Pipetas antiparasitarias", image_url="https://images.unsplash.com/photo-1770836037275-38b44e4b101f?w=600&h=400&fit=crop&q=80", brand="Frontline", price=18.99, stock=70, description="Protección contra pulgas y garrapatas", category="higiene"),
        ]
        db.add_all(productos)
        db.commit()

        # USUARIOS
        admin = models.User(email="admin@petboutique.com", hashed_password=hash_password("admin1234"), first_name="Admin", last_name="PetBoutique", phone="600000000", address="Calle Principal 1, Madrid")
        cliente1 = models.User(email="laura@example.com", hashed_password=hash_password("1234"), first_name="Laura", last_name="García", phone="611111111", address="Calle Rosa 3, Madrid")
        cliente2 = models.User(email="carlos@example.com", hashed_password=hash_password("1234"), first_name="Carlos", last_name="Martínez", phone="622222222", address="Avenida Sol 7, Barcelona")
        cliente3 = models.User(email="sofia@example.com", hashed_password=hash_password("1234"), first_name="Sofía", last_name="López", phone="633333333", address="Calle Luna 12, Valencia")
        cliente4 = models.User(email="miguel@example.com", hashed_password=hash_password("1234"), first_name="Miguel", last_name="Fernández", phone="644444444", address="Plaza Mayor 5, Sevilla")

        db.add_all([admin, cliente1, cliente2, cliente3, cliente4])
        db.commit()

        # MASCOTAS
        # cliente1 - una mascota
        mascota1 = models.Pet(name="Luna", species="Perro", breed="Labrador", age=3, weight=25.0, notes="Le encanta jugar", owner_id=cliente1.id)
        # cliente2 - una mascota
        mascota2 = models.Pet(name="Miau", species="Gato", breed="Siamés", age=2, weight=4.5, notes="Muy tranquilo", owner_id=cliente2.id)
        # cliente3 - dos perros
        mascota3 = models.Pet(name="Rocky", species="Perro", breed="Pastor Alemán", age=4, weight=32.0, notes="Muy activo", owner_id=cliente3.id)
        mascota4 = models.Pet(name="Max", species="Perro", breed="Golden Retriever", age=2, weight=28.0, notes="Muy cariñoso", owner_id=cliente3.id)
        # cliente4 - cuatro gatos
        mascota5 = models.Pet(name="Nala", species="Gato", breed="Persa", age=1, weight=3.5, notes="Muy juguetona", owner_id=cliente4.id)
        mascota6 = models.Pet(name="Simba", species="Gato", breed="Maine Coon", age=3, weight=6.0, notes="Le gusta dormir", owner_id=cliente4.id)
        mascota7 = models.Pet(name="Cleo", species="Gato", breed="Bengalí", age=2, weight=4.0, notes="Muy curiosa", owner_id=cliente4.id)
        mascota8 = models.Pet(name="Zeus", species="Gato", breed="Ragdoll", age=4, weight=7.0, notes="Muy tranquilo", owner_id=cliente4.id)

        db.add_all([mascota1, mascota2, mascota3, mascota4, mascota5, mascota6, mascota7, mascota8])
        db.commit()

        # Recargar servicios para obtener ids
        servicios_db = db.query(models.Service).all()

        # RESERVAS al azar entre cliente1, cliente2, cliente3
        reservas = [
            models.Booking(start_date=datetime.now() + timedelta(days=2), end_date=datetime.now() + timedelta(days=3), user_id=cliente1.id, pet_id=mascota1.id, service_id=servicios_db[0].id, status="pending"),
            models.Booking(start_date=datetime.now() + timedelta(days=5), end_date=None, user_id=cliente1.id, pet_id=mascota1.id, service_id=servicios_db[3].id, status="confirmed"),
            models.Booking(start_date=datetime.now() + timedelta(days=1), end_date=None, user_id=cliente2.id, pet_id=mascota2.id, service_id=servicios_db[12].id, status="pending"),
            models.Booking(start_date=datetime.now() + timedelta(days=7), end_date=datetime.now() + timedelta(days=10), user_id=cliente3.id, pet_id=mascota3.id, service_id=servicios_db[1].id, status="confirmed"),
            models.Booking(start_date=datetime.now() + timedelta(days=3), end_date=None, user_id=cliente3.id, pet_id=mascota4.id, service_id=servicios_db[7].id, status="pending"),
        ]
        db.add_all(reservas)
        db.commit()

        # PEDIDOS de clientes registrados
        productos_db = db.query(models.Product).all()

        pedido1 = models.Order(nombre="Laura García", direccion="Calle Rosa 3", ciudad="Madrid", cp="28001", telefono="611111111", metodo_pago="tarjeta", total=58.98, user_id=cliente1.id, status="confirmed")
        db.add(pedido1)
        db.commit()
        db.add_all([
            models.OrderItem(order_id=pedido1.id, product_id=productos_db[0].id, cantidad=1, precio=45.99),
            models.OrderItem(order_id=pedido1.id, product_id=productos_db[2].id, cantidad=1, precio=12.99),
        ])

        pedido2 = models.Order(nombre="Carlos Martínez", direccion="Avenida Sol 7", ciudad="Barcelona", cp="08001", telefono="622222222", metodo_pago="paypal", total=53.98, user_id=cliente2.id, status="pending")
        db.add(pedido2)
        db.commit()
        db.add_all([
            models.OrderItem(order_id=pedido2.id, product_id=productos_db[1].id, cantidad=1, precio=38.99),
            models.OrderItem(order_id=pedido2.id, product_id=productos_db[4].id, cantidad=1, precio=14.99),
        ])

        pedido3 = models.Order(nombre="Sofía López", direccion="Calle Luna 12", ciudad="Valencia", cp="46001", telefono="633333333", metodo_pago="transferencia", total=64.98, user_id=cliente3.id, status="shipped")
        db.add(pedido3)
        db.commit()
        db.add_all([
            models.OrderItem(order_id=pedido3.id, product_id=productos_db[3].id, cantidad=1, precio=35.99),
            models.OrderItem(order_id=pedido3.id, product_id=productos_db[5].id, cantidad=1, precio=29.99),
        ])

        # PEDIDOS externos (sin usuario)
        pedido4 = models.Order(nombre="Ana Ruiz", direccion="Calle Mayor 1", ciudad="Zaragoza", cp="50001", telefono="655555555", metodo_pago="tarjeta", total=43.98, user_id=None, status="pending")
        db.add(pedido4)
        db.commit()
        db.add_all([
            models.OrderItem(order_id=pedido4.id, product_id=productos_db[6].id, cantidad=1, precio=24.99),
            models.OrderItem(order_id=pedido4.id, product_id=productos_db[4].id, cantidad=1, precio=14.99),
        ])

        pedido5 = models.Order(nombre="Pedro Sanz", direccion="Avenida Libertad 8", ciudad="Bilbao", cp="48001", telefono="666666666", metodo_pago="paypal", total=54.97, user_id=None, status="confirmed")
        db.add(pedido5)
        db.commit()
        db.add_all([
            models.OrderItem(order_id=pedido5.id, product_id=productos_db[7].id, cantidad=2, precio=8.99),
            models.OrderItem(order_id=pedido5.id, product_id=productos_db[3].id, cantidad=1, precio=35.99),
        ])

        pedido6 = models.Order(nombre="María Torres", direccion="Plaza España 3", ciudad="Málaga", cp="29001", telefono="677777777", metodo_pago="tarjeta", total=108.98, user_id=None, status="shipped")
        db.add(pedido6)
        db.commit()
        db.add_all([
            models.OrderItem(order_id=pedido6.id, product_id=productos_db[8].id, cantidad=1, precio=89.99),
            models.OrderItem(order_id=pedido6.id, product_id=productos_db[4].id, cantidad=1, precio=14.99),
        ])

        pedido7 = models.Order(nombre="Jorge Navarro", direccion="Calle Olmo 15", ciudad="Murcia", cp="30001", telefono="688888888", metodo_pago="transferencia", total=47.98, user_id=None, status="pending")
        db.add(pedido7)
        db.commit()
        db.add_all([
            models.OrderItem(order_id=pedido7.id, product_id=productos_db[9].id, cantidad=2, precio=18.99),
            models.OrderItem(order_id=pedido7.id, product_id=productos_db[2].id, cantidad=1, precio=12.99),
        ])

        db.commit()
        print("¡Base de datos poblada correctamente!")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()