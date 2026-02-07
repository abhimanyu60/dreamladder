"""Test admin login locally"""
import os
os.environ['DATABASE_URL'] = 'postgresql://dreamladderadmin:DreamLadder2024!Secure@dreamladder-db.postgres.database.azure.com:5432/dreamladder?sslmode=require'

from models import SessionLocal, AdminUser
from utils import verify_password

email = "admin@dreamladder.com"
password = "Admin@123"

db = SessionLocal()
user = db.query(AdminUser).filter(AdminUser.email == email).first()

if user:
    print(f"User found: {user.email}")
    print(f"Password hash in DB: {user.password_hash[:50]}...")
    
    # Test password verification
    is_valid = verify_password(password, user.password_hash)
    print(f"\nPassword verification result: {is_valid}")
    
    if is_valid:
        print("✅ Password is CORRECT!")
    else:
        print("❌ Password is WRONG!")
        print("\nTrying different passwords:")
        for test_pwd in ["admin123", "Admin123", "Admin@123", "admin@123"]:
            result = verify_password(test_pwd, user.password_hash)
            print(f"  {test_pwd}: {result}")
else:
    print("❌ User not found in database!")

db.close()
