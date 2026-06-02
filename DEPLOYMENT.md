# Deployment Guide

## Backend + Database on Render

1. Push this repository to GitHub.
2. In Render:
   - Create a PostgreSQL database service.
   - Create a Web Service for `backend/`.
3. Backend settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set env vars:
   - `DATABASE_URL` = Render postgres internal connection string using `postgresql+psycopg2://...`
   - `CORS_ORIGINS` = frontend URL (Vercel)

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
