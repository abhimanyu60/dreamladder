"""Migration endpoint to add flash deal fields to properties table"""

import azure.functions as func
import logging
from sqlalchemy import create_engine, text
import os
import json

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Migration endpoint called')
    
    # Simple auth check - require a secret key
    jwt_secret = os.getenv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production-2024")
    auth_key = req.headers.get('X-Migration-Key')
    expected_key = jwt_secret[:16]
    
    if auth_key != expected_key:
        logging.warning(f"Unauthorized migration attempt. Got: {auth_key}, Expected: {expected_key}")
        return func.HttpResponse(
            json.dumps({"error": "Unauthorized"}),
            status_code=401,
            mimetype="application/json"
        )
    
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        logging.error("DATABASE_URL not set")
        return func.HttpResponse(
            json.dumps({"error": "Database configuration missing"}),
            status_code=500,
            mimetype="application/json"
        )
    
    try:
        engine = create_engine(database_url)
        with engine.connect() as conn:
            # Add is_flash_deal column
            logging.info("Adding is_flash_deal column...")
            conn.execute(text("""
                ALTER TABLE properties 
                ADD COLUMN IF NOT EXISTS is_flash_deal BOOLEAN DEFAULT FALSE
            """))
            
            # Add flash_deal_end_date column
            logging.info("Adding flash_deal_end_date column...")
            conn.execute(text("""
                ALTER TABLE properties 
                ADD COLUMN IF NOT EXISTS flash_deal_end_date TIMESTAMP
            """))
            
            conn.commit()
            logging.info("Migration successful!")
        
        return func.HttpResponse(
            json.dumps({
                "success": True,
                "message": "Migration completed successfully. Added is_flash_deal and flash_deal_end_date columns."
            }),
            status_code=200,
            mimetype="application/json"
        )
        
    except Exception as e:
        logging.error(f"Migration failed: {str(e)}", exc_info=True)
        return func.HttpResponse(
            json.dumps({
                "success": False,
                "error": str(e)
            }),
            status_code=500,
            mimetype="application/json"
        )
