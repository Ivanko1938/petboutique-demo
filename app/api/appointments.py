from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app import schemas
from app.crud import appointment_crud
from app.db.database import SessionLocal
from fastapi import APIRouter

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schemas.Appointment)
def create_new_appointment(
    appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)
):
    return appointment_crud.create_appointment(db=db, appointment=appointment)


@router.get("/", response_model=List[schemas.Appointment])
def read_appointments(db: Session = Depends(get_db)):
    return appointment_crud.get_appointments(db)


@router.get("/user/{user_id}", response_model=List[schemas.Appointment])
def read_user_appointments(user_id: int, db: Session = Depends(get_db)):
    appointments = appointment_crud.get_appointments_by_user(db, user_id=user_id)
    if not appointments:
        return []
    return appointments
