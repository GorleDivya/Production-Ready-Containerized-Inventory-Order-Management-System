from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate


def create_order(db: Session, payload: OrderCreate) -> Order:
    customer = db.get(Customer, payload.customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    product_ids = [item.product_id for item in payload.items]
    products = db.scalars(select(Product).where(Product.id.in_(product_ids)).with_for_update()).all()
    products_by_id = {p.id: p for p in products}

    order = Order(customer_id=payload.customer_id, total_amount=Decimal("0.00"))
    db.add(order)
    db.flush()

    total = Decimal("0.00")
    for item in payload.items:
        product = products_by_id.get(item.product_id)
        if not product:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item.product_id} not found",
            )
        if product.quantity_in_stock < item.quantity:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product {product.name}",
            )
        product.quantity_in_stock -= item.quantity
        line_total = Decimal(product.price) * item.quantity
        total += line_total
        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                unit_price=product.price,
                line_total=line_total,
            )
        )

    order.total_amount = total
    db.commit()
    db.refresh(order)
    return get_order_or_404(db, order.id)


def list_orders(db: Session) -> list[Order]:
    return db.scalars(select(Order).options(joinedload(Order.items)).order_by(Order.id.desc())).unique().all()


def get_order_or_404(db: Session, order_id: int) -> Order:
    order = db.scalars(
        select(Order).where(Order.id == order_id).options(joinedload(Order.items))
    ).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


def delete_order(db: Session, order: Order) -> None:
    db.delete(order)
    db.commit()
