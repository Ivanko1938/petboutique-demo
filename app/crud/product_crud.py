from sqlalchemy.orm import Session
from app import models, schemas


def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()


def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_stock(db: Session, product_id: int, quantity: int):
    db_product = get_product(db, product_id)
    if db_product:
        db_product.stock = quantity
        db.commit()
        db.refresh(db_product)
    return db_product
