from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine
from app import models
from app.api.router import api_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="PetBoutique API")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://petboutique-steel.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    from app.db.database import SessionLocal
    db = SessionLocal()
    try:
        if db.query(models.User).count() == 0:
            from seed import seed_database
            seed_database()
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "API PetBoutique Operativa", "docs": "/docs"}