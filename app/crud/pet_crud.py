from sqlalchemy.orm import Session
from app import models, schemas


# Función para buscar una mascota por su ID
def get_pet(db: Session, pet_id: int):
    return db.query(models.Pet).filter(models.Pet.id == pet_id).first()


# Función para traer todas las mascotas
def get_pets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Pet).offset(skip).limit(limit).all()


# Función para CREAR una mascota nueva
def create_pet(db: Session, pet: schemas.PetCreate):
    # Convertimos el esquema de Pydantic en un modelo de SQLAlchemy
    db_pet = models.Pet(
        name=pet.name,
        species=pet.species,
        breed=pet.breed,
        age=pet.age,
        weight=pet.weight,  # <-- Nuevo campo añadido
        notes=pet.notes,  # <-- Antes era personality
        owner_id=pet.owner_id,
    )

    db.add(db_pet)
    db.commit()
    db.refresh(db_pet)
    return db_pet


# Función para ACTUALIZAR una mascota
def update_pet(db: Session, pet_id: int, pet_data: schemas.PetCreate):
    db_pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if db_pet:
        db_pet.name = pet_data.name
        db_pet.species = pet_data.species
        db_pet.breed = pet_data.breed
        db_pet.age = pet_data.age
        db_pet.weight = pet_data.weight  # <-- Actualizamos weight
        db_pet.notes = pet_data.notes  # <-- Actualizamos notes (antes personality)
        db_pet.owner_id = pet_data.owner_id

        db.commit()
        db.refresh(db_pet)
    return db_pet


# Función para ELIMINAR una mascota
def delete_pet(db: Session, pet_id: int):
    db_pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if db_pet:
        db.delete(db_pet)
        db.commit()
        return True
    return False
