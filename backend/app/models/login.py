from sqlalchemy import ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class TableLoginCategory(Base):
    __tablename__ = "table_login_category"

    id: Mapped[int] = mapped_column(primary_key=True)
    login_category: Mapped[str] = mapped_column(unique=True)


class TableLogin(Base):
    __tablename__ = "table_login"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
    type_login_id: Mapped[int] = mapped_column(ForeignKey("table_login_category.id"))
    login_category_relationship: Mapped["TableLoginCategory"] = relationship() 
