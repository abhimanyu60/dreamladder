"""Initialize database and create admin user"""
import os
os.environ['DATABASE_URL'] = 'postgresql://dreamladderadmin:DreamLadder2024!Secure@dreamladder-db.postgres.database.azure.com:5432/dreamladder?sslmode=require'

from models import init_db, SessionLocal, AdminUser
from utils import get_password_hash
import uuid

print("Initializing database tables...")
init_db()
print("✓ Database tables created successfully!")

print("\nCreating admin user...")
db = SessionLocal()

# Check if admin already exists
existing_admin = db.query(AdminUser).filter(AdminUser.email == "admin@dreamladder.com").first()
if existing_admin:
    print("⚠ Admin user already exists!")
else:
    admin = AdminUser(
        id=str(uuid.uuid4()),
        email="admin@dreamladder.com",
        password_hash=get_password_hash("Admin@123"),
        name="Admin User",
        phone="+917004088007",
        role="admin"
    )
    db.add(admin)
    db.commit()
    print("✓ Admin user created successfully!")
    print("\nLogin credentials:")
    print("  Email: admin@dreamladder.com")
    print("  Password: Admin@123")
    print("\n⚠ IMPORTANT: Change this password after first login!")

db.close()
print("\n✅ Database initialization complete!")
