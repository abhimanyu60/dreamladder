"""Add flash deal fields to properties

Run this script to add is_flash_deal and flash_deal_end_date columns to properties table
"""

import psycopg2
import os

# Use Azure PostgreSQL connection string directly
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://dreamladder_admin:Abhi%40123@dreamladder-db.postgres.database.azure.com:5432/dreamladder_db?sslmode=require"
)

def migrate():
    print(f"Connecting to database...")
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    try:
        # Add is_flash_deal column
        print("Adding is_flash_deal column...")
        cursor.execute("""
            ALTER TABLE properties 
            ADD COLUMN IF NOT EXISTS is_flash_deal BOOLEAN DEFAULT FALSE
        """)
        
        # Add flash_deal_end_date column
        print("Adding flash_deal_end_date column...")
        cursor.execute("""
            ALTER TABLE properties 
            ADD COLUMN IF NOT EXISTS flash_deal_end_date TIMESTAMP
        """)
        
        conn.commit()
        print("✅ Migration successful! Added flash deal columns.")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Migration failed: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    migrate()
