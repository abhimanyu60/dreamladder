from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    """Hash a password"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify JWT token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

def get_current_user(authorization: str):
    """Extract user from Authorization header"""
    import logging
    
    if not authorization or not authorization.startswith("Bearer "):
        logging.error("No authorization header or invalid format")
        return None
    
    token = authorization.replace("Bearer ", "")
    logging.info(f"Attempting to decode token: {token[:20]}...")
    logging.info(f"Using JWT_SECRET_KEY: {settings.JWT_SECRET_KEY[:10]}...")
    
    payload = decode_access_token(token)
    
    if not payload:
        logging.error("Token decode failed")
        return None
    
    logging.info(f"Token decoded successfully: {payload.get('email')}")
    return payload

def create_response(success: bool = True, data: any = None, message: str = None, error: dict = None):
    """Create standardized API response"""
    response = {"success": success}
    
    if data is not None:
        response["data"] = data
    
    if message:
        response["message"] = message
    
    if error:
        response["error"] = error
    
    return response

def create_error_response(code: str, message: str, status_code: int = 400, details: dict = None):
    """Create standardized error response"""
    error = {
        "code": code,
        "message": message
    }
    
    if details:
        error["details"] = details
    
    return {
        "success": False,
        "error": error
    }, status_code

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug"""
    import re
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text
