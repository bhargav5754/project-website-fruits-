from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    is_admin: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    first_name: str
    is_admin: bool

class Fruit(BaseModel):
    id: str
    name: str
    price: float
    image_url: str

class CartItem(BaseModel):
    fruit_id: str
    quantity: int

class CartAdd(BaseModel):
    items: List[CartItem]
