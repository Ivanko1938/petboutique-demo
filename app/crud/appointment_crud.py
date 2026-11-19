from sqlalchemy.orm import Session
from app import models, schemas


def create_appointment(db: Session, appointment: schemas.AppointmentCreate):
    db_appointment = models.Appointment(**appointment.model_dump())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment


def get_appointments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Appointment).offset(skip).limit(limit).all()


def get_appointments_by_user(db: Session, user_id: int):
    return (
        db.query(models.Appointment).filter(models.Appointment.user_id == user_id).all()
    )
