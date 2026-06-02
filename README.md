# Inventory & Order Management System

Full-stack application for managing products, customers, orders, and inventory.

## Tech Stack

- Frontend: React (Vite)
- Backend: FastAPI + SQLAlchemy + Alembic
- Database: PostgreSQL
- Containerization: Docker + Docker Compose

## Project Structure

- `frontend/` React app
- `backend/` FastAPI app and migrations
- `docker-compose.yml` Local orchestration

## Local Development (Docker)

1. Copy environment files:
   - `cp .env.example .env`
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
2. Run:
   - `docker compose up --build`
3. Open:
   - Frontend: `http://localhost:3000`
   - Backend docs: `http://localhost:8000/docs`

## API Endpoints

### Products

- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `DELETE /products/{id}`

### Customers

- `POST /customers`
- `GET /customers`
- `GET /customers/{id}`
- `DELETE /customers/{id}`

### Orders

- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `DELETE /orders/{id}`

## Deployment

- Backend: Render (with managed PostgreSQL)
- Frontend: Vercel

Configure:

- Backend: `DATABASE_URL`, `CORS_ORIGINS`
- Frontend: `VITE_API_BASE_URL`
