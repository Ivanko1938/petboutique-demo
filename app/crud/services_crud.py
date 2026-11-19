from sqlalchemy.orm import Session
from app import models, schemas


def create_service(db: Session, service: schemas.ServiceCreate):
    db_service = models.Service(
        name=service.name,  # Nombre en el modelo = Nombre en el esquema
        category=service.category,  # Categoría en el modelo = Categoría en el esquema
        price=service.price,
        description=service.description,
    )
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service
