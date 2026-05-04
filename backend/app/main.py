from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import fruit_collection
from app.routes import user, fruits, cart, admin

app = FastAPI(title="Fruit App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, tags=["Users"])
app.include_router(fruits.router, tags=["Fruits"])
app.include_router(cart.router, tags=["Cart"])
app.include_router(admin.router, tags=["Admin"])

@app.on_event("startup")
async def startup_db_client():
    count = await fruit_collection.count_documents({})
    if count == 0:
        initial_fruits = [
            {"name": "Apple", "price": 1.5, "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&q=80&w=400"},
            {"name": "Banana", "price": 0.8, "image_url": "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?auto=format&fit=crop&q=80&w=400"},
            {"name": "Mango", "price": 2.5, "image_url": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400"},
            {"name": "Orange", "price": 1.2, "image_url": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=400"}
        ]
        await fruit_collection.insert_many(initial_fruits)
