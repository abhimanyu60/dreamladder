import azure.functions as func
import json
from models import SessionLocal, Property, Enquiry, EnquiryStatus
from utils import get_current_user, create_response, create_error_response
from datetime import datetime, timedelta
from sqlalchemy import func as sql_func

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Get dashboard statistics for admin"""
    
    if req.method == "OPTIONS":
        return func.HttpResponse(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            }
        )
    
    try:
        # Verify admin authentication
        authorization = req.headers.get('Authorization', '')
        user_payload = get_current_user(authorization)
        
        if not user_payload:
            response, status = create_error_response("UNAUTHORIZED", "Authentication required", 401)
            return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
        
        db = SessionLocal()
        
        # Get property statistics
        total_properties = db.query(Property).count()
        available_properties = db.query(Property).filter(Property.status == "available").count()
        sold_properties = db.query(Property).filter(Property.status == "sold").count()
        
        # Get enquiry statistics
        total_enquiries = db.query(Enquiry).count()
        pending_enquiries = db.query(Enquiry).filter(Enquiry.status == EnquiryStatus.PENDING).count()
        
        # This month enquiries
        first_day_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_enquiries = db.query(Enquiry).filter(Enquiry.created_at >= first_day_of_month).count()
        
        # Recent enquiries
        recent = db.query(Enquiry).order_by(Enquiry.created_at.desc()).limit(5).all()
        recent_enquiries = []
        for enq in recent:
            recent_enquiries.append({
                "id": enq.id,
                "name": enq.name,
                "type": enq.type.value if enq.type else None,
                "createdAt": enq.created_at.isoformat() if enq.created_at else None
            })
        
        # Enquiries by month (last 6 months)
        enquiries_by_month = []
        for i in range(5, -1, -1):
            month_start = (datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0) - timedelta(days=i * 30))
            month_end = month_start + timedelta(days=30)
            count = db.query(Enquiry).filter(
                Enquiry.created_at >= month_start,
                Enquiry.created_at < month_end
            ).count()
            enquiries_by_month.append({
                "month": month_start.strftime("%b %Y"),
                "count": count
            })
        
        response = create_response(
            data={
                "totalProperties": total_properties,
                "availableProperties": available_properties,
                "soldProperties": sold_properties,
                "totalEnquiries": total_enquiries,
                "pendingEnquiries": pending_enquiries,
                "thisMonthEnquiries": this_month_enquiries,
                "recentEnquiries": recent_enquiries,
                "enquiriesByMonth": enquiries_by_month
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
