import azure.functions as func
import json
from models import SessionLocal, Enquiry
from utils import create_response, create_error_response, get_current_user
import uuid

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Submit enquiry or get all enquiries (admin)"""
    
    if req.method == "OPTIONS":
        return func.HttpResponse(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            }
        )
    
    try:
        db = SessionLocal()
        
        if req.method == "POST":
            # Public endpoint - submit enquiry
            req_body = req.get_json()
            
            # Validation
            if not req_body.get('name') or not req_body.get('phone') or not req_body.get('type'):
                response, status = create_error_response(
                    "VALIDATION_ERROR",
                    "Name, phone, and type are required",
                    400
                )
                db.close()
                return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
            
            enquiry_id = str(uuid.uuid4())
            new_enquiry = Enquiry(
                id=enquiry_id,
                type=req_body.get('type'),
                name=req_body.get('name'),
                email=req_body.get('email'),
                phone=req_body.get('phone'),
                message=req_body.get('message'),
                preferred_time=req_body.get('preferredTime'),
                property_id=req_body.get('propertyId')
            )
            
            db.add(new_enquiry)
            db.commit()
            
            response = create_response(
                message="Enquiry submitted successfully",
                data={"id": enquiry_id, "referenceNumber": enquiry_id[:8].upper()}
            )
            
            db.close()
            return func.HttpResponse(
                json.dumps(response),
                status_code=201,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
        elif req.method == "GET":
            # Admin endpoint - get all enquiries
            authorization = req.headers.get('Authorization', '')
            user_payload = get_current_user(authorization)
            
            if not user_payload:
                response, status = create_error_response("UNAUTHORIZED", "Authentication required", 401)
                db.close()
                return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
            
            page = int(req.params.get('page', 1))
            limit = int(req.params.get('limit', 10))
            status_filter = req.params.get('status')
            type_filter = req.params.get('type')
            
            query = db.query(Enquiry)
            
            if status_filter:
                query = query.filter(Enquiry.status == status_filter)
            if type_filter:
                query = query.filter(Enquiry.type == type_filter)
            
            total_items = query.count()
            total_pages = (total_items + limit - 1) // limit
            
            offset = (page - 1) * limit
            enquiries = query.order_by(Enquiry.created_at.desc()).offset(offset).limit(limit).all()
            
            enquiries_data = []
            for enq in enquiries:
                try:
                    enquiries_data.append({
                        "id": enq.id,
                        "type": enq.type.value if hasattr(enq.type, 'value') else str(enq.type) if enq.type else None,
                        "name": enq.name,
                        "email": enq.email,
                        "phone": enq.phone,
                        "message": enq.message,
                        "preferredTime": enq.preferred_time,
                        "propertyId": enq.property_id,
                        "status": enq.status.value if hasattr(enq.status, 'value') else str(enq.status) if enq.status else None,
                        "notes": enq.notes,
                        "createdAt": enq.created_at.isoformat() if enq.created_at else None,
                        "updatedAt": enq.updated_at.isoformat() if enq.updated_at else None
                    })
                except Exception as e:
                    # Log error but continue processing other enquiries
                    print(f"Error processing enquiry {enq.id}: {str(e)}")
                    continue
            
            response = create_response(
                data={
                    "enquiries": enquiries_data,
                    "pagination": {
                        "currentPage": page,
                        "totalPages": total_pages,
                        "totalItems": total_items
                    }
                }
            )
            
            db.close()
            return func.HttpResponse(
                json.dumps(response),
                status_code=200,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
            
    except Exception as e:
        if 'db' in locals():
            db.close()
        response, status = create_error_response("INTERNAL_ERROR", str(e), 500)
        return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
