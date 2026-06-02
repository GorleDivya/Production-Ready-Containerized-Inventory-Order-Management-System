from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_db_session
from app.schemas.order import OrderCreate, OrderOut
from app.services.orders import create_order, delete_order, get_order_or_404, list_orders

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order_route(payload: OrderCreate, db: Session = Depends(get_db_session)):
    return create_order(db, payload)


@router.get("", response_model=list[OrderOut])
def list_orders_route(db: Session = Depends(get_db_session)):
    return list_orders(db)


@router.get("/{order_id}", response_model=OrderOut)
def get_order_route(order_id: int, db: Session = Depends(get_db_session)):
    return get_order_or_404(db, order_id)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order_route(order_id: int, db: Session = Depends(get_db_session)):
    order = get_order_or_404(db, order_id)
    delete_order(db, order)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
