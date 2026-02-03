import os
import uuid
from datetime import datetime

os.environ['DATABASE_URL'] = 'postgresql://dreamladderadmin:DreamLadder2024!Secure@dreamladder-db.postgres.database.azure.com/dreamladder?sslmode=require'

from models import SessionLocal, Property, PropertyType, PropertyStatus

print("Adding sample properties to Azure database...")

db = SessionLocal()

try:
    # Sample properties
    properties = [
        {
            "title": "Luxury Villa in Whitefield",
            "slug": "luxury-villa-whitefield",
            "description": "A stunning 4BHK villa with modern amenities in the heart of Whitefield. Features include a private garden, swimming pool, and state-of-the-art security systems.",
            "short_description": "4BHK luxury villa with private garden and pool",
            "price": 25000000,
            "price_per_sqft": 8500,
            "area": "2941 sq ft",
            "area_in_sqft": 2941,
            "location": "Whitefield, Bangalore",
            "full_address": "Whitefield Main Road, Bangalore - 560066",
            "google_maps_link": "https://maps.google.com/?q=Whitefield+Bangalore",
            "type": PropertyType.RESIDENTIAL,
            "status": PropertyStatus.AVAILABLE,
            "featured": True,
            "images": [
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
            ],
            "amenities": ["Swimming Pool", "Garden", "Security", "Parking", "Power Backup"],
            "highlights": ["Prime Location", "Gated Community", "Near Tech Parks"],
            "legal_info": {"approved_by": "BDA", "rera_approved": True},
            "nearby_places": ["ITPL - 2km", "Phoenix Mall - 3km", "Hospitals - 1km"]
        },
        {
            "title": "Commercial Space in Indiranagar",
            "slug": "commercial-space-indiranagar",
            "description": "Prime commercial property ideal for offices or retail. Located on the main road with excellent visibility and footfall.",
            "short_description": "Premium commercial space on main road",
            "price": 18000000,
            "price_per_sqft": 12000,
            "area": "1500 sq ft",
            "area_in_sqft": 1500,
            "location": "Indiranagar, Bangalore",
            "full_address": "100 Feet Road, Indiranagar, Bangalore - 560038",
            "google_maps_link": "https://maps.google.com/?q=Indiranagar+Bangalore",
            "type": PropertyType.COMMERCIAL,
            "status": PropertyStatus.AVAILABLE,
            "featured": True,
            "images": [
                "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
                "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"
            ],
            "amenities": ["Parking", "Elevator", "Power Backup", "Water Supply"],
            "highlights": ["High Visibility", "Main Road Facing", "Public Transport"],
            "legal_info": {"approved_by": "BBMP", "rera_approved": True},
            "nearby_places": ["Metro Station - 500m", "Restaurants - 100m"]
        },
        {
            "title": "Agricultural Land in Kanakapura",
            "slug": "agricultural-land-kanakapura",
            "description": "40 acres of fertile agricultural land with water source. Perfect for farming or investment. Clear title and all approvals in place.",
            "short_description": "40 acres agricultural land with water source",
            "price": 120000000,
            "price_per_sqft": 69,
            "area": "40 acres",
            "area_in_sqft": 1742400,
            "location": "Kanakapura, Bangalore",
            "full_address": "Kanakapura Road, Bangalore Rural District",
            "google_maps_link": "https://maps.google.com/?q=Kanakapura+Bangalore",
            "type": PropertyType.AGRICULTURAL,
            "status": PropertyStatus.AVAILABLE,
            "featured": False,
            "images": [
                "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
                "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800"
            ],
            "amenities": ["Water Source", "Road Access", "Electricity"],
            "highlights": ["Fertile Soil", "Clear Title", "Investment Opportunity"],
            "legal_info": {"approved_by": "Revenue Department", "conversion": "Agricultural"},
            "nearby_places": ["Highway - 5km", "Village - 2km"]
        },
        {
            "title": "Premium Apartment in Koramangala",
            "slug": "premium-apartment-koramangala",
            "description": "Spacious 3BHK apartment in the prestigious Koramangala area. Modern interiors with all amenities.",
            "short_description": "3BHK apartment with modern amenities",
            "price": 15000000,
            "price_per_sqft": 9375,
            "area": "1600 sq ft",
            "area_in_sqft": 1600,
            "location": "Koramangala, Bangalore",
            "full_address": "5th Block, Koramangala, Bangalore - 560095",
            "google_maps_link": "https://maps.google.com/?q=Koramangala+Bangalore",
            "type": PropertyType.RESIDENTIAL,
            "status": PropertyStatus.AVAILABLE,
            "featured": True,
            "images": [
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
            ],
            "amenities": ["Gym", "Club House", "Swimming Pool", "24x7 Security"],
            "highlights": ["Prime Location", "Ready to Move", "Vastu Compliant"],
            "legal_info": {"approved_by": "BBMP", "rera_approved": True},
            "nearby_places": ["Schools - 1km", "Shopping - 500m", "Restaurants - 200m"]
        },
        {
            "title": "Villa Plot in Sarjapur",
            "slug": "villa-plot-sarjapur",
            "description": "Ready to construct villa plot in upcoming Sarjapur area. Excellent connectivity and infrastructure.",
            "short_description": "Villa plot ready for construction",
            "price": 8000000,
            "price_per_sqft": 5333,
            "area": "1500 sq ft",
            "area_in_sqft": 1500,
            "location": "Sarjapur, Bangalore",
            "full_address": "Sarjapur Road, Bangalore - 562125",
            "google_maps_link": "https://maps.google.com/?q=Sarjapur+Bangalore",
            "type": PropertyType.RESIDENTIAL,
            "status": PropertyStatus.UPCOMING,
            "featured": False,
            "images": [
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"
            ],
            "amenities": ["Gated Community", "Park", "Security", "Underground Drainage"],
            "highlights": ["Developing Area", "Good ROI", "Near ORR"],
            "legal_info": {"approved_by": "BDA", "rera_approved": True},
            "nearby_places": ["ORR - 2km", "Tech Parks - 5km"]
        }
    ]
    
    # Add properties to database
    for prop_data in properties:
        # Check if property already exists
        existing = db.query(Property).filter(Property.slug == prop_data["slug"]).first()
        if not existing:
            prop = Property(
                id=str(uuid.uuid4()),
                **prop_data
            )
            db.add(prop)
            print(f"✓ Added: {prop_data['title']}")
        else:
            print(f"⚠ Already exists: {prop_data['title']}")
    
    db.commit()
    print(f"\n✅ Successfully added {len(properties)} properties!")
    
except Exception as e:
    print(f"✗ Error: {e}")
    db.rollback()
finally:
    db.close()
