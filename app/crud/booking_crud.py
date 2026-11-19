from sqlalchemy.orm import Session
from app import models, schemas


def create_booking(db: Session, booking: schemas.BookingCreate):
    db_booking = models.Booking(
        start_date=booking.start_date,
        end_date=booking.end_date,
        pet_id=booking.pet_id,
        service_id=booking.service_id,
        user_id=booking.user_id,
        status="pending",
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


def get_user_bookings(db: Session, user_id: int):
    return db.query(models.Booking).filter(models.Booking.user_id == user_id).all()
