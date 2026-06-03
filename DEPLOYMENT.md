# Deployment Guide

## Backend + Database on Render (Docker — recommended)

1. Push this repository to GitHub.
2. In Render:
   - Create a PostgreSQL database service.
   - Create a **Blueprint** from `render.yaml`, **or** create a Web Service manually:
     - **Environment:** Docker
     - **Dockerfile Path:** `backend/Dockerfile`
     - **Docker Context:** `backend`
3. Set environment variables on the web service:
   - `DATABASE_URL` = Render Postgres URL with `postgresql+psycopg2://...` prefix
   - `CORS_ORIGINS` = your Vercel frontend URL (comma-separated if multiple)
4. Deploy and verify:
   - `https://<render-app>.onrender.com/health` → `{"status":"ok"}`
   - `https://<render-app>.onrender.com/docs`

### Manual Render settings (if not using Blueprint)

| Setting | Value |
|---------|--------|
| Language / Environment | **Docker** |
| Dockerfile Path | `backend/Dockerfile` |
| Docker Context / Root | `backend` |

Do **not** use `pip install -r requirements.txt` as the build command when using Docker; the Dockerfile handles dependencies.

### Alternative: native Python (no Docker)

If you prefer `env: python` on Render, leave root directory empty and use:

- **Build Command:** `pip install -r backend/requirements.txt`
- **Start Command:** `cd backend && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Frontend on Vercel

1. Import repository in Vercel.
2. Set root directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable:
   - `VITE_API_BASE_URL` = Render backend public URL

## Smoke Tests

- Open frontend URL.
- Create product.
- Create customer.
- Create order.
- Confirm stock reduces and dashboard counts change.
- Open backend `/docs` and test endpoints.
