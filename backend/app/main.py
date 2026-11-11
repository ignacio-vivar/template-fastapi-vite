import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, login_users, login_categories
from app.security import get_current_login, require_admin
from sqlalchemy import create_engine, text
from sqlalchemy import inspect


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
engine = create_engine(os.environ["DATABASE_URL"])
protected = [Depends(get_current_login)]
admin_only = [Depends(require_admin)]

app.include_router(auth.router)
app.include_router(login_users.router, dependencies=admin_only)
app.include_router(login_categories.router, dependencies=admin_only)


@app.get("/")
def connect_to_db():
    with engine.connect() as c:
        return {"db": c.execute(text("SELECT version()")).scalar()}

@app.get("/tables")
def list_tables():
    insp = inspect(engine)
    return {
        t: [f"{c['name']} {c['type']}" for c in insp.get_columns(t)]
        for t in insp.get_table_names()
    }
