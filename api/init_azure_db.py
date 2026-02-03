import os
import uuid
os.environ['DATABASE_URL'] = 'postgresql://dreamladderadmin:DreamLadder2024!Secure@dreamladder-db.postgres.database.azure.com/dreamladder?sslmode=require'

from models import Base, SessionLocal, AdminUser, engine
from config import settings
import bcrypt

print("Initializing database tables...")
try:
    # Drop all tables first (optional, comment out if you want to preserve data)
    # Base.metadata.drop_all(bind=engine)
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")
except Exception as e:
    print(f"✗ Error creating tables: {e}")
    exit(1)

# Create default admin user
print("\nCreating admin user...")
db = SessionLocal()
try:
    # Check if admin exists
    admin = db.query(AdminUser).filter(AdminUser.email == settings.ADMIN_EMAIL).first()
    
    if not admin:
        # Hash the password
        hashed_password = bcrypt.hashpw(
            settings.ADMIN_PASSWORD.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Create admin user
        admin = AdminUser(
            id=str(uuid.uuid4()),
            email=settings.ADMIN_EMAIL,
            password_hash=hashed_password,
            name="Admin User",
            role="admin"
        )
        db.add(admin)
        db.commit()
        print(f"✓ Admin user created: {settings.ADMIN_EMAIL}")
    else:
        print("⚠ Admin user already exists!")
except Exception as e:
    print(f"✗ Error creating admin user: {e}")
    db.rollback()
finally:
    db.close()

print("\n✅ Database initialization complete!")
