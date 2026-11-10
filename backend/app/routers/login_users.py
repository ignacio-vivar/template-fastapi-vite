from app.security import hash_password
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.login import TableLogin, TableLoginCategory
from app.schemas.login import LoginCreate, LoginRead, LoginUpdate

router = APIRouter(prefix="/login-users", tags=["login users"])




@router.get("/", response_model=list[LoginRead])
def list_logins(db: Session = Depends(get_db)):
    stmt = select(TableLogin).options(
        joinedload(TableLogin.login_category_relationship)
    )
    return db.scalars(stmt).all()


@router.get("/{login_id}", response_model=LoginRead)
def get_login(login_id: int, db: Session = Depends(get_db)):
    login = db.get(TableLogin, login_id)
    if not login:
        raise HTTPException(404, "Usuario no encontrado")
    return login


@router.post("/", response_model=LoginRead, status_code=201)
def create_login(data: LoginCreate, db: Session = Depends(get_db)):
    if not db.get(TableLoginCategory, data.type_login_id):
        raise HTTPException(404, "Categoría no encontrada")
    login = TableLogin(
        username=data.username,
        password=hash_password(data.password),
        type_login_id=data.type_login_id,
    )
    db.add(login)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "El username ya existe")
    db.refresh(login)
    return login


@router.patch("/{login_id}", response_model=LoginRead)
def update_login(login_id: int, data: LoginUpdate, db: Session = Depends(get_db)):
    login = db.get(TableLogin, login_id)
    if not login:
        raise HTTPException(404, "Usuario no encontrado")
    values = data.model_dump(exclude_none=True)
    if "type_login_id" in values and not db.get(TableLoginCategory, values["type_login_id"]):
        raise HTTPException(404, "Categoría no encontrada")
    if "password" in values:
        values["password"] = hash_password(values["password"])
    for field, value in values.items():
        setattr(login, field, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "El username ya existe")
    db.refresh(login)
    return login


@router.delete("/{login_id}", status_code=204)
def delete_login(login_id: int, db: Session = Depends(get_db)):
    login = db.get(TableLogin, login_id)
    if not login:
        raise HTTPException(404, "Usuario no encontrado")
    db.delete(login)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "El usuario tiene préstamos asociados")
