import os
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Header
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Path to Firebase Admin SDK service account key
FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH", "backend/serviceAccountKey.json")

# Initialize Firebase Admin SDK (only once)
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(FIREBASE_KEY_PATH)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        raise RuntimeError(f"Failed to initialize Firebase Admin SDK: {e}")


def verify_token(authorization: Optional[str] = Header(None)) -> dict:
    """
    FastAPI dependency for verifying Firebase ID tokens.
    Expects 'Authorization: Bearer <token>' header.

    Returns:
        dict: Decoded Firebase token (contains uid, email, etc.)
    Raises:
        HTTPException: If token is missing/invalid.
    """
    if authorization is None:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")

    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
