# backend/database.py
import os
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from fastapi import FastAPI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "blog_tracker_db"  # or any name you like

# Initialize the MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# Define collections
blogs_collection = db["blogs"]

def blog_helper(blog) -> dict:
    return {
        "id": str(blog["_id"]),
        "title": blog["title"],
        "content": blog["content"],
        "authorId": blog["authorId"],
        "createdAt": blog["createdAt"],
        "updatedAt": blog.get("updatedAt"),
        "isPublic": blog.get("isPublic", True),
        "tags": blog.get("tags", []),
    }

# Optional: FastAPI lifespan event for DB connection check
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to MongoDB...")
    try:
        # This is a cheap command to test connection
        await client.admin.command("ismaster")
        print("✅ MongoDB connected!")
    except Exception as e:
        print(f"❌ Could not connect to MongoDB: {e}")
    yield
    client.close()
    print("🔌 MongoDB connection closed")
