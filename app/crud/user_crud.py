from sqlalchemy.orm import Session
from app import models, schemas
from app.core import security


#  Busqueda de un usuario por su ID
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


#  Buscar un usuario por su Email
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


# Listamos todos los usuarios
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


#  CREAR un usuario nuevo
def create_user(db: Session, user: schemas.UserCreate):
    # 1. Encriptamos la contraseña REAL
    # Ya no es 'fake', ahora es un hash seguro e indescifrable
    hashed_password = security.get_password_hash(user.password)

    # 2. Creamos el modelo usando la contraseña encriptada
    db_user = models.User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        address=user.address,
        hashed_password=hashed_password,  # <--- Usamos el hash aquí
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_data: schemas.UserCreate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.first_name = user_data.first_name
        db_user.last_name = user_data.last_name
        db_user.email = user_data.email
        db_user.phone = user_data.phone
        db_user.address = user_data.address
        if user_data.password and user_data.password != "unchanged":
            db_user.hashed_password = security.get_password_hash(user_data.password)
        db.commit()
        db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False
