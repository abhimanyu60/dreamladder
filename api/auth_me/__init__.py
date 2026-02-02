import azure.functions as func
import json
from utils import get_current_user, create_response, create_error_response
from models import SessionLocal, AdminUser

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Get current authenticated user"""
    try:
        authorization = req.headers.get('Authorization', '')
        user_payload = get_current_user(authorization)
        
        if not user_payload:
            response, status = create_error_response(
                "UNAUTHORIZED",
                "Invalid or missing token",
                401
            )
            return func.HttpResponse(
                json.dumps(response),
                status_code=status,
                mimetype="application/json"
            )
        
        db = SessionLocal()
        try:
            user = db.query(AdminUser).filter(AdminUser.id == user_payload.get('sub')).first()
            
            if not user:
                response, status = create_error_response(
                    "NOT_FOUND",
                    "User not found",
                    404
                )
                return func.HttpResponse(
                    json.dumps(response),
                    status_code=status,
                    mimetype="application/json"
                )
            
            response = create_response(
                data={
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "role": user.role
                }
            )
            
            return func.HttpResponse(
                json.dumps(response),
                status_code=200,
                mimetype="application/json",
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization"
                }
            )
            
        finally:
            db.close()
            
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
