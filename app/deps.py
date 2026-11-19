from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core import security
from app import models, schemas

# token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
):  # Conexion a la BD              token: el JWT (extraido del header automaticamente)
    credentials_exception = HTTPException(  # definir error estandar si algo falla
        status_code=status.HTTP_401_UNAUTHORIZED,  # no autorizado
        detail="No se pudo validar el usuario",
        headers={"WWW-Authenticate": "Bearer"},  # Requerido por OAuth2
    )
    try:
        # Decodificar el Token
        payload = jwt.decode(
            token, security.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        email: str = payload.get(
            "sub"
        )  # extrae el campo sub del token, es identificador usuario (email)
        if email is None:
            raise credentials_exception  # si el token no contiene mail -->error
        token_data = schemas.TokenData(
            email=email
        )  # creo objeto validado con Pydantic, sirve para org datos del token
    except JWTError:  # token invalido lanza excepción
        raise credentials_exception

    # 2. Buscar al usuario en la DB
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception

    return user
