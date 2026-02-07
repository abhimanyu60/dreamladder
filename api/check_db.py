"""Check database for saved data"""
import os
os.environ['DATABASE_URL'] = 'postgresql://dreamladderadmin:DreamLadder2024!Secure@dreamladder-db.postgres.database.azure.com:5432/dreamladder?sslmode=require'

from models import SessionLocal, Property, Enquiry, AdminUser

db = SessionLocal()

print("=== ADMIN USERS ===")
admins = db.query(AdminUser).all()
print(f"Total admin users: {len(admins)}")
for admin in admins:
    print(f"- {admin.name} ({admin.email}) - Role: {admin.role}")
    print(f"  Password hash: {admin.password_hash[:50]}...")

print("\n=== PROPERTIES ===")
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
