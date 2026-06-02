from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes.customers import router as customers_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.orders import router as orders_router
from app.api.routes.products import router as products_router
from app.core.config import settings

app = FastAPI(title="Inventory & Order Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": f"Unexpected server error: {exc}"})


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(products_router)
app.include_router(customers_router)
app.include_router(orders_router)
app.include_router(dashboard_router)
