from fastapi import APIRouter, Depends
from bson import ObjectId
from app.models import CartAdd
from app.database import cart_collection, fruit_collection
from app.auth import get_current_user_id

router = APIRouter()

@router.post("/cart/add")
async def add_to_cart(cart_add: CartAdd, user_id: str = Depends(get_current_user_id)):
    items = [item.model_dump() for item in cart_add.items]
    
    await cart_collection.update_one(
        {"user_id": user_id},
        {"$set": {"items": items}},
        upsert=True
    )
    return {"message": "Cart updated successfully"}

@router.get("/cart")
async def get_cart(user_id: str = Depends(get_current_user_id)):
    cart = await cart_collection.find_one({"user_id": user_id})
    if not cart:
        return {"items": []}
        
    enriched_items = []
    for item in cart["items"]:
        fruit = await fruit_collection.find_one({"_id": ObjectId(item["fruit_id"])})
        if fruit:
            enriched_items.append({
                "fruit_id": item["fruit_id"],
                "name": fruit["name"],
                "price": fruit["price"],
                "image_url": fruit["image_url"],
                "quantity": item["quantity"]
            })
            
    return {"items": enriched_items}
