"""Check Azure database for saved data"""
import os
os.environ['DATABASE_URL'] = 'postgresql://dreamladderadmin:DreamLadder2024!Secure@dreamladder-db.postgres.database.azure.com:5432/dreamladder?sslmode=require'

from models import SessionLocal, Property, Enquiry

db = SessionLocal()

print("=== PROPERTIES ===")
properties = db.query(Property).all()
print(f"Total properties: {len(properties)}")
for prop in properties:
    print(f"- {prop.title} ({prop.type})")

print("\n=== ENQUIRIES ===")
enquiries = db.query(Enquiry).all()
print(f"Total enquiries: {len(enquiries)}")
for enq in enquiries:
    print(f"- {enq.name} ({enq.type}) - {enq.phone} - Status: {enq.status}")

db.close()
