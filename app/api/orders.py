from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app import models, schemas

router = APIRouter()

@router.post("/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    db_order = models.Order(
        nombre=order.nombre,
        direccion=order.direccion,
        ciudad=order.ciudad,
        cp=order.cp,
        telefono=order.telefono,
        metodo_pago=order.metodo_pago,
        total=order.total,
        user_id=order.user_id,
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            cantidad=item.cantidad,
            precio=item.precio
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_order)
    return db_order


@router.get("/", response_model=List[schemas.Order])
def list_orders(user_id: int = None, db: Session = Depends(get_db)):
    if user_id:
        return db.query(models.Order).filter(models.Order.user_id == user_id).all()
    return db.query(models.Order).all()


@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return order


@router.patch("/{order_id}/status")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    order.status = status
    db.commit()
    return {"message": "Estado actualizado"}