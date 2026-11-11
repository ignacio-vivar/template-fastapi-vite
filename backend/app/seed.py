import os
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from app.models.login import TableLogin, TableLoginCategory
from app.security import hash_password  # usá la función que ya usás al crear usuarios

engine = create_engine(os.environ["DATABASE_URL"])

with Session(engine) as db:
    for name in ("admin", "not_admin"):
        exists = db.scalar(
            select(TableLoginCategory).where(TableLoginCategory.login_category == name)
        )
        if not exists:
            db.add(TableLoginCategory(login_category=name))
    db.flush()

    admin_cat = db.scalar(
        select(TableLoginCategory).where(TableLoginCategory.login_category == "admin")
    )
    username = os.environ["ADMIN_USERNAME"]
    if not db.scalar(select(TableLogin).where(TableLogin.username == username)):
        db.add(
            TableLogin(
                username=username,
                password=hash_password(os.environ["ADMIN_PASSWORD"]),
                type_login_id=admin_cat.id,
            )
        )
    db.commit()
