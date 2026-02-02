"""Check database for saved data"""
import os
os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_Uryxui1COWw7@ep-plain-pond-a8vbwc1v-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'

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
    print(f"- {enq.name} ({enq.type}) - {enq.phone}")

db.close()
