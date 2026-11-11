# Template Login JWT

Base para proyectos con login JWT, usuarios y categorías de rol (`admin` / `not_admin`).
Backend FastAPI + PostgreSQL + Alembic en Docker. Frontend Vite + React + shadcn.

## Arranque desde cero

### 1. Variables de entorno

Copiar `.env.example` a `.env` y completar:

```bash
cp .env.example .env
```

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=...
POSTGRES_DB=...
DATABASE_URL=postgresql://postgres:<password>@db:5432/<db>
SECRET_KEY=
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
```

Generar la `SECRET_KEY` (igual en bash y fish):

```bash
openssl rand -hex 32
```

O escribirla directo en el `.env`:

```bash
# bash
sed -i "s|^SECRET_KEY=.*|SECRET_KEY=$(openssl rand -hex 32)|" .env
# fish
sed -i "s|^SECRET_KEY=.*|SECRET_KEY="(openssl rand -hex 32)"|" .env
```

`DATABASE_URL` tiene que usar los mismos usuario, contraseña y nombre de base que las variables `POSTGRES_*`.

### 2. Levantar los contenedores

```bash
docker compose up -d --build
docker compose logs -f backend
```

### 3. Migraciones (Alembic)

Las migraciones están versionadas en `backend/alembic/versions/`, así que en un clon nuevo alcanza con:

```bash
docker compose exec backend alembic upgrade head
docker compose exec db psql -U <POSTGRES_USER> -d <POSTGRES_DB> -c '\dt'
```

Tienen que aparecer `table_login`, `table_login_category` y `alembic_version`.

### 4. Seed del primer admin

Crea las categorías `admin` y `not_admin` y el usuario admin con `ADMIN_USERNAME` / `ADMIN_PASSWORD`. Se puede correr varias veces sin duplicar nada.

```bash
docker compose exec backend python -m app.seed
```

### 5. Frontend

```bash
cd frontend
npm i
npm run dev
```

Vite corre en `http://localhost:5173` y reenvía `/api` al backend (`localhost:8000`) sin el prefijo `/api`.

## Agregar o cambiar modelos

1. Crear o editar el modelo en `backend/app/models/`.
2. **Importarlo en `backend/app/models/__init__.py`**. Alembic solo ve los modelos que ese archivo importa.
3. Generar y aplicar la migración:

```bash
docker compose exec backend alembic revision --autogenerate -m "descripcion"
docker compose exec backend alembic upgrade head
```

Revisar el archivo generado: si `upgrade()` tiene solo `pass`, el modelo no se está importando.

## Problemas conocidos

Falta el import en `app/models/__init__.py`. 

Hay que agregar los nuevos modelos antes de hacer un cambio, si no se tiene que volver atrás

```bash
docker compose exec backend alembic downgrade base
docker compose exec backend rm alembic/versions/<archivo>.py
docker compose exec backend alembic revision --autogenerate -m "init"
docker compose exec backend alembic upgrade head
```

**Cambié `POSTGRES_USER`, `POSTGRES_PASSWORD` o `POSTGRES_DB` y no tiene efecto.**
Postgres solo lee esas variables la primera vez que inicializa su volumen. Para reinicializar (borra los datos):

```bash
docker compose down -v
docker compose up -d --build
```

**`KeyError` por una variable del `.env` (por ejemplo `ADMIN_USERNAME`).**
Las variables se cargan al crear el contenedor, `docker compose restart` no alcanza:

```bash
docker compose up -d --force-recreate backend
```

Si sigue fallando, agregar la variable en `environment:` del servicio `backend` en `docker-compose.yml`.


## Roles

- `admin`: accede a `/dashboard-admin`.
- `not_admin`: accede a `/dashboard`.

El nombre del rol tiene que coincidir en el seed, en la base y en `allowedRoles` de `App.tsx`.

## Ver logs

```bash
docker compose logs -f backend
docker compose logs --tail 50 backend
```
