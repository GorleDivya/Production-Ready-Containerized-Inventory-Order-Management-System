from decimal import Decimal

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    line_total: Decimal

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    customer_id: int
    total_amount: Decimal
    items: list[OrderItemOut]

    class Config:
        from_attributes = True
