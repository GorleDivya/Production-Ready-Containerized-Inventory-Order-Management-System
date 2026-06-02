from decimal import Decimal

from pydantic import BaseModel, Field, condecimal


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    sku: str = Field(min_length=1, max_length=100)
    price: condecimal(gt=0, max_digits=12, decimal_places=2)  # type: ignore
    quantity_in_stock: int = Field(ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    sku: str | None = Field(default=None, min_length=1, max_length=100)
    price: condecimal(gt=0, max_digits=12, decimal_places=2) | None = None  # type: ignore
    quantity_in_stock: int | None = Field(default=None, ge=0)


class ProductOut(ProductBase):
    id: int

    class Config:
        from_attributes = True
