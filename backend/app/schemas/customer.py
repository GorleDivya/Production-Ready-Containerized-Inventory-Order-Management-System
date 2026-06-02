from pydantic import BaseModel, EmailStr, Field


class CustomerCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    phone_number: str = Field(min_length=7, max_length=20)


class CustomerOut(CustomerCreate):
    id: int

    class Config:
        from_attributes = True
