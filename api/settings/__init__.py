import azure.functions as func
import json
from models import SessionLocal, Setting
from utils import verify_token
from datetime import datetime
import uuid

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Settings endpoint - GET and PUT"""
    
    # Handle CORS
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
    
    if req.method == "OPTIONS":
        return func.HttpResponse("", status_code=200, headers=headers)
    
    db = SessionLocal()
    
    try:
        if req.method == "GET":
            # Get all settings
            settings_list = db.query(Setting).all()
            settings_dict = {s.key: s.value for s in settings_list}
            
            # Return default values if settings don't exist
            if not settings_dict.get("hero"):
                settings_dict["hero"] = {
                    "badgeText": "TRUSTED BY 200+ FAMILIES",
                    "heading": "Find Your Perfect Property in",
                    "location": "Ranchi",
                    "subheading": "Premium residential plots, agricultural land, and commercial properties. Your trusted partner in real estate since 2014.",
                    "stat1Value": "50+",
                    "stat1Label": "Properties Listed",
                    "stat2Value": "200+",
                    "stat2Label": "Happy Clients",
                    "stat3Value": "10+",
                    "stat3Label": "Years Experience",
                    "stat4Value": "100%",
                    "stat4Label": "Legal Verified"
                }
            
            return func.HttpResponse(
                json.dumps({"success": True, "data": settings_dict}),
                status_code=200,
                mimetype="application/json",
                headers=headers
            )
        
        elif req.method == "PUT":
            # Verify admin token
            token = req.headers.get("Authorization", "").replace("Bearer ", "")
            if not token or not verify_token(token):
                return func.HttpResponse(
                    json.dumps({"success": False, "error": {"message": "Unauthorized"}}),
                    status_code=401,
                    mimetype="application/json",
                    headers=headers
                )
            
            # Update settings
            body = req.get_json()
            
            # Update each setting key
            for key, value in body.items():
                setting = db.query(Setting).filter(Setting.key == key).first()
                if setting:
                    setting.value = value
                    setting.updated_at = datetime.utcnow()
                else:
                    new_setting = Setting(
                        id=str(uuid.uuid4()),
                        key=key,
                        value=value
                    )
                    db.add(new_setting)
            
            db.commit()
            
            return func.HttpResponse(
                json.dumps({"success": True, "message": "Settings updated successfully"}),
                status_code=200,
                mimetype="application/json",
                headers=headers
            )
    
    except Exception as e:
        db.rollback()
        return func.HttpResponse(
            json.dumps({"success": False, "error": {"message": str(e)}}),
            status_code=500,
            mimetype="application/json",
            headers=headers
        )
    finally:
        db.close()
