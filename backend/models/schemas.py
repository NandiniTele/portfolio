from pydantic import BaseModel, EmailStr, Field


class ContactMessageIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(..., min_length=4, max_length=4000)


class ContactMessageOut(BaseModel):
    ok: bool = True
    detail: str = 'Message received. Thank you for reaching out.'
