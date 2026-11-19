# app/api/bookings.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app import schemas
from app.crud import booking_crud
from typing import List
from app import models

router = APIRouter()


@router.post("/", response_model=schemas.Booking)
def make_reservation(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    # Ahora llamamos a booking_crud (el archivo) . create_booking (la función)
    return booking_crud.create_booking(db=db, booking=booking)


@router.get("/", response_model=List[schemas.Booking])
def list_bookings(user_id: int = None, db: Session = Depends(get_db)):
    if user_id:
        return db.query(models.Booking).filter(models.Booking.user_id == user_id).all()
    return db.query(models.Booking).all()

@router.delete("/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    db.delete(booking)
    db.commit()
    return {"message": "Reserva cancelada correctamente"}

@router.patch("/{booking_id}/status")
def update_booking_status(booking_id: int, status: str, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    booking.status = status
    db.commit()
    db.refresh(booking)
    return {"message": "Estado actualizado correctamente"}