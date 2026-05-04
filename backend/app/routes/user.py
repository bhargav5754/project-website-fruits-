from fastapi import APIRouter, HTTPException
from app.models import UserCreate, UserLogin, Token
from app.database import user_collection
from app.auth import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.model_dump()
    user_dict["password"] = hashed_password
    
    result = await user_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(data={"sub": user_id, "is_admin": user.is_admin})
    return {"access_token": access_token, "token_type": "bearer", "first_name": user.first_name, "is_admin": user.is_admin}

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await user_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    is_admin = db_user.get("is_admin", False)
    access_token = create_access_token(data={"sub": str(db_user["_id"]), "is_admin": is_admin})
    return {"access_token": access_token, "token_type": "bearer", "first_name": db_user["first_name"], "is_admin": is_admin}
