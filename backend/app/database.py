import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://db:27017")
client = AsyncIOMotorClient(MONGO_URL)
database = client.fruit_app

user_collection = database.get_collection("users")
fruit_collection = database.get_collection("fruits")
cart_collection = database.get_collection("carts")
