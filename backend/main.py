# backend/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from backend.utils.firebase_auth import verify_token
from backend.routes import auth, blogs
from backend.database import lifespan

# Create FastAPI app with lifespan events
app = FastAPI(
    title="BlogTracker API",
    description="Backend API for BlogTracker with Firebase Auth + MongoDB",
    version="1.0.0",
    lifespan=lifespan,  # <-- connects/disconnects MongoDB
)

# Allow frontend (React/Vite) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(blogs.router, prefix="/blogs", tags=["Blogs"])

# Health check
@app.get("/")
def health_check():
    return {"status": "ok", "message": "BlogTracker API running 🚀"}

# Example protected route
@app.get("/protected")
def protected_route(user=Depends(verify_token)):
    """
    Example protected endpoint.
    Requires Authorization: Bearer <idToken> header.
    """
    return {
        "message": "You are authenticated 🎉",
        "uid": user["uid"],
        "email": user.get("email"),
    }
