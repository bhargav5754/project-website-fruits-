from fastapi import APIRouter, Depends
from bson import ObjectId
from app.database import cart_collection, user_collection, fruit_collection
from app.auth import get_current_admin_user

router = APIRouter()

@router.get("/admin/carts")
async def get_all_carts(admin_id: str = Depends(get_current_admin_user)):
    all_carts = []
    cursor = cart_collection.find({})
    async for cart in cursor:
        user = await user_collection.find_one({"_id": ObjectId(cart["user_id"])})
        if not user:
            continue
            
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
                
        all_carts.append({
            "user_id": cart["user_id"],
            "user_name": f"{user['first_name']} {user['last_name']}",
            "email": user["email"],
            "items": enriched_items
        })
    return {"admin_carts": all_carts}
