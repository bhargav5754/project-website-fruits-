from fastapi import APIRouter
from app.database import fruit_collection

router = APIRouter()

@router.get("/fruits")
async def get_fruits():
    fruits = []
    cursor = fruit_collection.find({})
    async for document in cursor:
        fruits.append({
            "id": str(document["_id"]),
            "name": document["name"],
            "price": document["price"],
            "image_url": document["image_url"]
        })
    return fruits
