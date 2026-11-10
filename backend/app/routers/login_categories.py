from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.login import TableLoginCategory
from app.schemas.login import (
    LoginCategoryCreate,
    LoginCategoryRead,
    LoginCategoryUpdate,
)

router = APIRouter(prefix="/login-categories", tags=["login categories"])


@router.get("/", response_model=list[LoginCategoryRead])
def list_categories(db: Session = Depends(get_db)):
    return db.scalars(select(TableLoginCategory)).all()


@router.get("/{category_id}", response_model=LoginCategoryRead)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.get(TableLoginCategory, category_id)
    if not category:
        raise HTTPException(404, "Categoría no encontrada")
    return category


@router.post("/", response_model=LoginCategoryRead, status_code=201)
def create_category(data: LoginCategoryCreate, db: Session = Depends(get_db)):
    category = TableLoginCategory(**data.model_dump())
    db.add(category)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "La categoría ya existe")
    db.refresh(category)
    return category


@router.patch("/{category_id}", response_model=LoginCategoryRead)
def update_category(
    category_id: int, data: LoginCategoryUpdate, db: Session = Depends(get_db)
):
    category = db.get(TableLoginCategory, category_id)
    if not category:
        raise HTTPException(404, "Categoría no encontrada")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "La categoría ya existe")
    db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.get(TableLoginCategory, category_id)
    if not category:
        raise HTTPException(404, "Categoría no encontrada")
    db.delete(category)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "La categoría está en uso")
