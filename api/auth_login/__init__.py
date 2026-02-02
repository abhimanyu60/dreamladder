import azure.functions as func
import json
import uuid
from models import SessionLocal, AdminUser
from utils import verify_password, create_access_token, get_password_hash, create_response, create_error_response, get_current_user
from config import settings

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Admin login endpoint"""
    try:
        req_body = req.get_json()
        email = req_body.get('email')
        password = req_body.get('password')
        
        if not email or not password:
            response, status = create_error_response(
                "VALIDATION_ERROR",
                "Email and password are required",
                400
            )
            return func.HttpResponse(
                json.dumps(response),
                status_code=status,
                mimetype="application/json"
            )
        
        db = SessionLocal()
        try:
            user = db.query(AdminUser).filter(AdminUser.email == email).first()
            
            if not user or not verify_password(password, user.password_hash):
                response, status = create_error_response(
                    "UNAUTHORIZED",
                    "Invalid email or password",
                    401
                )
                return func.HttpResponse(
                    json.dumps(response),
                    status_code=status,
                    mimetype="application/json"
                )
            
            # Create JWT token
            token_data = {
                "sub": user.id,
                "email": user.email,
                "role": user.role
            }
            access_token = create_access_token(token_data)
            
            response = create_response(
                data={
                    "token": access_token,
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "name": user.name,
                        "role": user.role
                    }
                }
            )
            
            return func.HttpResponse(
                json.dumps(response),
                status_code=200,
                mimetype="application/json",
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization"
                }
            )
            
        finally:
            db.close()
            
    except ValueError:
        response, status = create_error_response(
            "VALIDATION_ERROR",
            "Invalid JSON body",
            400
        )
        return func.HttpResponse(
            json.dumps(response),
            status_code=status,
            mimetype="application/json"
        )
    except Exception as e:
        response, status = create_error_response(
            "INTERNAL_ERROR",
            str(e),
            500
        )
        return func.HttpResponse(
            json.dumps(response),
            status_code=status,
            mimetype="application/json"
        )
