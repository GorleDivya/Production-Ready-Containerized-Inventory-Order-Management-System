from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_db_session
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate
from app.services.products import (
    create_product,
    delete_product,
    get_product_or_404,
    list_products,
    update_product,
)

router = APIRouter(prefix="/products", tags=["products"])


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product_route(payload: ProductCreate, db: Session = Depends(get_db_session)):
    return create_product(db, payload)


@router.get("", response_model=list[ProductOut])
def list_products_route(db: Session = Depends(get_db_session)):
    return list_products(db)


@router.get("/{product_id}", response_model=ProductOut)
def get_product_route(product_id: int, db: Session = Depends(get_db_session)):
    return get_product_or_404(db, product_id)


@router.put("/{product_id}", response_model=ProductOut)
def update_product_route(
    product_id: int, payload: ProductUpdate, db: Session = Depends(get_db_session)
):
    product = get_product_or_404(db, product_id)
    return update_product(db, product, payload)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_route(product_id: int, db: Session = Depends(get_db_session)):
    product = get_product_or_404(db, product_id)
    delete_product(db, product)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
