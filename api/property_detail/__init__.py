import azure.functions as func
import json
from models import SessionLocal, Property
from utils import get_current_user, create_response, create_error_response, slugify

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Get, update or delete a single property by ID"""
    
    # Handle OPTIONS for CORS
    if req.method == "OPTIONS":
        return func.HttpResponse(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            }
        )
    
    try:
        property_id = req.route_params.get('id')
        if not property_id:
            response, status = create_error_response("INVALID_REQUEST", "Property ID is required", 400)
            return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
        
        db = SessionLocal()
        
        if req.method == "GET":
            # Get property by ID
            property_obj = db.query(Property).filter(Property.id == property_id).first()
            
            if not property_obj:
                response, status = create_error_response("NOT_FOUND", "Property not found", 404)
                db.close()
                return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
            
            # Convert to dict
            property_data = {
                "id": property_obj.id,
                "title": property_obj.title,
                "slug": property_obj.slug,
                "description": property_obj.description,
                "shortDescription": property_obj.short_description,
                "price": property_obj.price,
                "pricePerSqFt": property_obj.price_per_sqft,
                "area": property_obj.area,
                "areaInSqFt": property_obj.area_in_sqft,
                "location": property_obj.location,
                "fullAddress": property_obj.full_address,
                "googleMapsLink": property_obj.google_maps_link,
                "type": property_obj.type.value if property_obj.type else None,
                "status": property_obj.status.value if property_obj.status else None,
                "featured": property_obj.featured,
                "images": property_obj.images or [],
                "amenities": property_obj.amenities or [],
                "highlights": property_obj.highlights or [],
                "legalInfo": property_obj.legal_info or {},
                "nearbyPlaces": property_obj.nearby_places or [],
                "createdAt": property_obj.created_at.isoformat() if property_obj.created_at else None,
                "updatedAt": property_obj.updated_at.isoformat() if property_obj.updated_at else None
            }
            
            response = create_response(data={"property": property_data})
            db.close()
            return func.HttpResponse(
                json.dumps(response),
                status_code=200,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
        elif req.method == "PUT":
            # Verify admin authentication
            authorization = req.headers.get('Authorization', '')
            user_payload = get_current_user(authorization)
            
            if not user_payload:
                response, status = create_error_response("UNAUTHORIZED", "Authentication required", 401)
                db.close()
                return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
            
            # Get property
            property_obj = db.query(Property).filter(Property.id == property_id).first()
            if not property_obj:
                response, status = create_error_response("NOT_FOUND", "Property not found", 404)
                db.close()
                return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
            
            # Parse request body
            body = req.get_json()
            
            # Update fields
            if 'title' in body:
                property_obj.title = body['title']
                property_obj.slug = slugify(body['title'])
            if 'description' in body:
                property_obj.description = body['description']
            if 'shortDescription' in body:
                property_obj.short_description = body['shortDescription']
            if 'price' in body:
                property_obj.price = body['price']
            if 'pricePerSqFt' in body:
                property_obj.price_per_sqft = body['pricePerSqFt']
            if 'area' in body:
                property_obj.area = body['area']
            if 'areaInSqFt' in body:
                property_obj.area_in_sqft = body['areaInSqFt']
            if 'location' in body:
                property_obj.location = body['location']
            if 'fullAddress' in body:
                property_obj.full_address = body['fullAddress']
            if 'googleMapsLink' in body:
                property_obj.google_maps_link = body['googleMapsLink']
            if 'type' in body:
                property_obj.type = body['type']
            if 'status' in body:
                property_obj.status = body['status']
            if 'featured' in body:
                property_obj.featured = body['featured']
            if 'images' in body:
                property_obj.images = body['images']
            if 'amenities' in body:
                property_obj.amenities = body['amenities']
            if 'highlights' in body:
                property_obj.highlights = body['highlights']
            if 'legalInfo' in body:
                property_obj.legal_info = body['legalInfo']
            if 'nearbyPlaces' in body:
                property_obj.nearby_places = body['nearbyPlaces']
            
            db.commit()
            
            response = create_response(message="Property updated successfully")
            db.close()
            return func.HttpResponse(
                json.dumps(response),
                status_code=200,
                mimetype="application/json",
                headers={"Access-Control-Allow-Origin": "*"}
            )
        
        elif req.method == "DELETE":
            # Verify admin authentication
            authorization = req.headers.get('Authorization', '')
            user_payload = get_current_user(authorization)
            
            if not user_payload:
                response, status = create_error_response("UNAUTHORIZED", "Authentication required", 401)
                db.close()
                return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
            
            # Get and delete property
            property_obj = db.query(Property).filter(Property.id == property_id).first()
            if not property_obj:
                response, status = create_error_response("NOT_FOUND", "Property not found", 404)
                db.close()
                return func.HttpResponse(json.dumps(response), status_code=status, mimetype="application/json")
            
            db.delete(property_obj)
            db.commit()
            
            response = create_response(message="Property deleted successfully")
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
