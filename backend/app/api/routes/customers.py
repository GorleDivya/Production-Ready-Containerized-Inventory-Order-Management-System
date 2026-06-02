from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_db_session
from app.schemas.customer import CustomerCreate, CustomerOut
from app.services.customers import create_customer, delete_customer, get_customer_or_404, list_customers

router = APIRouter(prefix="/customers", tags=["customers"])


@router.post("", response_model=CustomerOut, status_code=status.HTTP_201_CREATED)
def create_customer_route(payload: CustomerCreate, db: Session = Depends(get_db_session)):
    return create_customer(db, payload)


@router.get("", response_model=list[CustomerOut])
def list_customers_route(db: Session = Depends(get_db_session)):
    return list_customers(db)


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer_route(customer_id: int, db: Session = Depends(get_db_session)):
    return get_customer_or_404(db, customer_id)


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer_route(customer_id: int, db: Session = Depends(get_db_session)):
    customer = get_customer_or_404(db, customer_id)
    delete_customer(db, customer)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
