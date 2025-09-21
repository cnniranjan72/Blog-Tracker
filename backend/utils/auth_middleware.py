from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException
from firebase_admin import auth

# Paths that don’t need login
PUBLIC_PATHS = ["/auth/login", "/blogs/public"]

class FirebaseAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow public paths without auth
        for path in PUBLIC_PATHS:
            if request.url.path.startswith(path):
                return await call_next(request)

        # Get the Authorization header
        authorization: str = request.headers.get("authorization")
        if not authorization:
            raise HTTPException(status_code=401, detail="Authorization header missing")

        try:
            scheme, token = authorization.split()
            if scheme.lower() != "bearer":
                raise HTTPException(status_code=401, detail="Invalid auth scheme")
        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid authorization header format")

        try:
            decoded_token = auth.verify_id_token(token)
            # Attach user to request for later use
            request.state.user = decoded_token
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

        return await call_next(request)
