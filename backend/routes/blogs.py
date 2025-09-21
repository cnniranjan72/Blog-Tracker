# backend/routes/blogs.py
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
from backend.database import blogs_collection, blog_helper
from backend.models.blog import BlogCreate, BlogUpdate, BlogResponse
from backend.utils.firebase_auth import verify_token

router = APIRouter(prefix="/blogs", tags=["Blogs"])

# ✅ Create Blog
@router.post("/", response_model=BlogResponse)
async def create_blog(blog: BlogCreate, user=Depends(verify_token)):
    new_blog = blog.dict()
    new_blog["authorId"] = user["uid"]
    new_blog["createdAt"] = datetime.utcnow()
    new_blog["updatedAt"] = None

    result = await blogs_collection.insert_one(new_blog)
    created_blog = await blogs_collection.find_one({"_id": result.inserted_id})
    return blog_helper(created_blog)

# ✅ Get All Blogs (Public only)
@router.get("/public", response_model=list[BlogResponse])
async def get_public_blogs():
    blogs = []
    async for blog in blogs_collection.find({"isPublic": True}).sort("createdAt", -1):
        blogs.append(blog_helper(blog))
    return blogs

# ✅ Get My Blogs
@router.get("/me", response_model=list[BlogResponse])
async def get_my_blogs(user=Depends(verify_token)):
    blogs = []
    async for blog in blogs_collection.find({"authorId": user["uid"]}).sort("createdAt", -1):
        blogs.append(blog_helper(blog))
    return blogs

# ✅ Update Blog
@router.put("/{blog_id}", response_model=BlogResponse)
async def update_blog(blog_id: str, blog: BlogUpdate, user=Depends(verify_token)):
    existing = await blogs_collection.find_one({"_id": ObjectId(blog_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog not found")
    if existing["authorId"] != user["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = {k: v for k, v in blog.dict().items() if v is not None}
    update_data["updatedAt"] = datetime.utcnow()

    await blogs_collection.update_one({"_id": ObjectId(blog_id)}, {"$set": update_data})
    updated = await blogs_collection.find_one({"_id": ObjectId(blog_id)})
    return blog_helper(updated)

# ✅ Delete Blog
@router.delete("/{blog_id}")
async def delete_blog(blog_id: str, user=Depends(verify_token)):
    blog = await blogs_collection.find_one({"_id": ObjectId(blog_id)})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    if blog["authorId"] != user["uid"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    await blogs_collection.delete_one({"_id": ObjectId(blog_id)})
    return {"message": "Blog deleted successfully"}
