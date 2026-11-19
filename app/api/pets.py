from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.crud import pet_crud
from app.db.database import SessionLocal
from app.deps import get_current_user

router = APIRouter()


# Dependencia para la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# RUTA PARA LEER (GET)
@router.get("/", response_model=List[schemas.Pet])
def read_pets(
    skip: int = 0, limit: int = 100, owner_id: int = None, db: Session = Depends(get_db)
):
    if owner_id:
        return db.query(models.Pet).filter(models.Pet.owner_id == owner_id).all()
    return pet_crud.get_pets(db, skip=skip, limit=limit)


# RUTA PARA CREAR (POST)
@router.post("/", response_model=schemas.Pet)
def create_pet(
    pet: schemas.PetCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    #  ID del usuario que viene en el Token
    new_pet = models.Pet(**pet.dict(), owner_id=current_user.id)

    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)
    return new_pet


# ruta para usuario logueado (solo ve sus mascotas)
@router.get("/me", response_model=list[schemas.Pet])
def read_my_pets(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    # Filtramos la base de datos por el ID del usuario logueado
    return db.query(models.Pet).filter(models.Pet.owner_id == current_user.id).all()


# BUSCAR mascotas por especie
@router.get("/search", response_model=List[schemas.Pet])
def search_pets(especie: str, db: Session = Depends(get_db)):
    pets = db.query(models.Pet).filter(models.Pet.especie == especie).all()
    if not pets:
        raise HTTPException(
            status_code=404, detail="No se encontraron mascotas con esa especie"
        )
    return pets


# OBTENER una mascota específica por ID
@router.get("/{pet_id}", response_model=schemas.Pet)
def read_pet(pet_id: int, db: Session = Depends(get_db)):
    db_pet = pet_crud.get_pet(db, pet_id=pet_id)
    if db_pet is None:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")
    return db_pet


# ACTUALIZAR
@router.put("/{pet_id}", response_model=schemas.Pet)
def update_pet(
    pet_id: int,
    pet_update: schemas.PetCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    #  Buscar la mascota
    db_pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()

    # Si no existe, error 404
    if db_pet is None:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")

    # seguridad,  si la mascota id no coincide con el dueño id
    if db_pet.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="No tienes permiso para editar esta mascota"
        )

    # Actualizar los campos
    db_pet.name = pet_update.name
    db_pet.species = pet_update.species
    db_pet.breed = pet_update.breed

    db.commit()
    db.refresh(db_pet)
    return db_pet


# ELIMINAR, Dcble check
@router.delete("/{pet_id}")
def delete_pet(
    pet_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    #  Buscamos la mascota en la base de datos
    db_pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()

    #  Si no existe, lanzamos un 404
    if db_pet is None:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")

    # Comprobamos si el dueño de la mascota coincide con el usuario del token
    if db_pet.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para borrar esta mascota. ¡No es tuya!",
        )

    # Si todo está ok, borramos
    db.delete(db_pet)
    db.commit()
    return {"message": f"Mascota {pet_id} eliminada correctamente"}
