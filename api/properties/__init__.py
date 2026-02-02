import azure.functions as func
import json
import uuid
from models import SessionLocal, Property
from utils import get_current_user, create_response, create_error_response, slugify
from datetime import datetime

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Get all properties or create new property"""
    
    # Handle OPTIONS for CORS
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
        
        if req.method == "GET":
            # Get query parameters
            page = int(req.params.get('page', 1))
            limit = int(req.params.get('limit', 10))
            status_filter = req.params.get('status')
            type_filter = req.params.get('type')
            featured = req.params.get('featured')
            location = req.params.get('location')
            search = req.params.get('search')
            
            # Build query
            query = db.query(Property)
            
            if status_filter:
                query = query.filter(Property.status == status_filter)
            if type_filter:
                query = query.filter(Property.type == type_filter)
            if featured is not None:
                query = query.filter(Property.featured == (featured.lower() == 'true'))
            if location:
                query = query.filter(Property.location.ilike(f'%{location}%'))
            if search:
                query = query.filter(
                    (Property.title.ilike(f'%{search}%')) |
                    (Property.description.ilike(f'%{search}%')) |
                    (Property.location.ilike(f'%{search}%'))
                )
            
            # Count total
            total_items = query.count()
            total_pages = (total_items + limit - 1) // limit
            
            # Paginate
            offset = (page - 1) * limit
            properties = query.offset(offset).limit(limit).all()
            
            # Convert to dict
            properties_data = []
            for prop in properties:
                properties_data.append({
                    "id": prop.id,
                    "title": prop.title,
                    "slug": prop.slug,
                    "description": prop.description,
                    "shortDescription": prop.short_description,
                    "price": prop.price,
                    "pricePerSqFt": prop.price_per_sqft,
                    "area": prop.area,
                    "areaInSqFt": prop.area_in_sqft,
                    "location": prop.location,
                    "fullAddress": prop.full_address,
                    "googleMapsLink": prop.google_maps_link,
                    "type": prop.type.value if prop.type else None,
                    "status": prop.status.value if prop.status else None,
                    "featured": prop.featured,
                    "images": prop.images or [],
                    "amenities": prop.amenities or [],
                    "highlights": prop.highlights or [],
                    "legalInfo": prop.legal_info or {},
                    "nearbyPlaces": prop.nearby_places or [],
                    "createdAt": prop.created_at.isoformat() if prop.created_at else None,
                    "updatedAt": prop.updated_at.isoformat() if prop.updated_at else None
                })
            
            response = create_response(
                data={
                    "properties": properties_data,
                    "pagination": {
                        "currentPage": page,
                        "totalPages": total_pages,
                        "totalItems": total_items,
                        "itemsPerPage": limit
                    }
                }
            )
            
            db.close()
            return func.HttpResponse(
                json.dumps(response),
                status_code=200,
                mimetype="application/json",
                headers={
                    "Access-Control-Allow-Origin": "*"
                }
            )
        
        elif req.method == "POST":
            # Verify admin authentication
            authorization = req.headers.get('Authorization', '')
            user_payload = get_current_user(authorization)
            
            if not user_payload:
                response, status = create_error_response("UNAUTHORIZED", "Authentication required", 401)
                db.close()
                return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
            
            # Parse request body
            req_body = req.get_json()
            
            # Create new property
            property_id = str(uuid.uuid4())
            slug = slugify(req_body.get('title', ''))
            
            new_property = Property(
                id=property_id,
                title=req_body.get('title'),
                slug=slug,
                description=req_body.get('description'),
                short_description=req_body.get('shortDescription'),
                price=req_body.get('price'),
                price_per_sqft=req_body.get('pricePerSqFt'),
                area=req_body.get('area'),
                area_in_sqft=req_body.get('areaInSqFt'),
                location=req_body.get('location'),
                full_address=req_body.get('fullAddress'),
                google_maps_link=req_body.get('googleMapsLink'),
                type=req_body.get('type'),
                status=req_body.get('status', 'available'),
                featured=req_body.get('featured', False),
                images=req_body.get('images', []),
                amenities=req_body.get('amenities', []),
                highlights=req_body.get('highlights', []),
                legal_info=req_body.get('legalInfo', {}),
                nearby_places=req_body.get('nearbyPlaces', [])
            )
            
            db.add(new_property)
            db.commit()
            db.refresh(new_property)
            
            response = create_response(
                data={"id": new_property.id},
                message="Property created successfully"
            )
            
            db.close()
            return func.HttpResponse(
                json.dumps(response),
                status_code=201,
                mimetype="application/json",
                headers={
                    "Access-Control-Allow-Origin": "*"
                }
            )
            
    except Exception as e:
        if 'db' in locals():
            db.close()
        response, status = create_error_response("INTERNAL_ERROR", str(e), 500)
        return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
