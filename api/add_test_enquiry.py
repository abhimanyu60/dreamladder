"""Add test enquiry to Azure database"""
import os
os.environ['DATABASE_URL'] = 'postgresql://dreamladderadmin:DreamLadder2024!Secure@dreamladder-db.postgres.database.azure.com:5432/dreamladder?sslmode=require'

from models import SessionLocal, Enquiry
import uuid

def add_test_enquiry():
    db = SessionLocal()
    try:
        # Create test enquiry
        test_enquiry = Enquiry(
            id=str(uuid.uuid4()),
            type="property_enquiry",
            name="Test User",
            email="test@example.com",
            phone="+91 9876543210",
            message="I am interested in this property. Please contact me.",
            status="pending"
        )
        
        db.add(test_enquiry)
        db.commit()
        
        print(f"✅ Test enquiry created with ID: {test_enquiry.id}")
        
        # Verify
        count = db.query(Enquiry).count()
        print(f"Total enquiries in database: {count}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_test_enquiry()
