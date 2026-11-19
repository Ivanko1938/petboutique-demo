from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.db.database import SessionLocal
from fastapi import APIRouter

router = APIRouter()


# Dependencia para la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# OBTENER todos los servicios
@router.get("/", response_model=List[schemas.Service])
def read_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Service).offset(skip).limit(limit).all()


# OBTENER un servicio por ID
@router.get("/{service_id}", response_model=schemas.Service)
def read_service(service_id: int, db: Session = Depends(get_db)):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if service is None:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return service


# CREAR un servicio
@router.post("/", response_model=schemas.Service)
def create_service(service: schemas.ServiceCreate, db: Session = Depends(get_db)):
    db_service = models.Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service


# ACTUALIZAR un servicio
@router.put("/{service_id}", response_model=schemas.Service)
def update_service(
    service_id: int, service: schemas.ServiceCreate, db: Session = Depends(get_db)
):
    db_service = (
        db.query(models.Service).filter(models.Service.id == service_id).first()
    )
    if db_service is None:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    for key, value in service.dict().items():
        setattr(db_service, key, value)
    db.commit()
    db.refresh(db_service)
    return db_service


# ELIMINAR un servicio
@router.delete("/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    db_service = (
        db.query(models.Service).filter(models.Service.id == service_id).first()
    )
    if db_service is None:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    db.delete(db_service)
    db.commit()
    return {"message": f"Servicio con ID {service_id} eliminado correctamente"}
