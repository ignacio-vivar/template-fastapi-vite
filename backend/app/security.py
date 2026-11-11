import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.login import TableLogin

SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except ValueError:  # bcrypt 5 rechaza passwords de más de 72 bytes
        return False


def create_access_token(login_id: int) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES)
    return jwt.encode({"sub": str(login_id), "exp": exp}, SECRET_KEY, algorithm=ALGORITHM)


def get_current_login(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    error = HTTPException(
        401, "Token inválido o vencido", headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        login_id = int(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, ValueError):
        raise error
    login = db.get(TableLogin, login_id)
    if not login:
        raise error
    return login

def require_admin(login: TableLogin = Depends(get_current_login)):
    if login.login_category_relationship.login_category != "admin":
        raise HTTPException(403, "Solo administradores")
    return login
