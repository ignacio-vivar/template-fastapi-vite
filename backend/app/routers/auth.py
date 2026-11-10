
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.login import LoginRead

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.login import TableLogin
from app.security import create_access_token, get_current_login,  verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


from sqlalchemy.orm import joinedload

ADMIN_CATEGORIES = {"admin"}  # después de la limpieza: {"admin"}
LOWER_CATEGORIES = "not-admin"


def resolve_role(login_category: str) -> str | None:
    if login_category in ADMIN_CATEGORIES:
        return "admin"
    if login_category == LOWER_CATEGORIES:
        return "not-admin"
    return None  

@router.post("/login")
def login(
    form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.scalars(
        select(TableLogin)
        .options(joinedload(TableLogin.login_category_relationship))
        .where(TableLogin.username == form.username)
    ).first()
    if not user or not verify_password(form.password, user.password):
        raise HTTPException(
            401, "Usuario o contraseña incorrectos", headers={"WWW-Authenticate": "Bearer"}
        )

    role = resolve_role(user.login_category_relationship.login_category)
    if role is None:
        raise HTTPException(403, "Tu usuario no tiene acceso al sistema")

    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "role": role,
    }

@router.get("/me", response_model=LoginRead)
def me(login: TableLogin = Depends(get_current_login)):
    return login
