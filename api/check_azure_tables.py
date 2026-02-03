import os
from models import SessionLocal, engine
from sqlalchemy import text

os.environ['DATABASE_URL'] = 'postgresql://dreamladderadmin:DreamLadder2024!Secure@dreamladder-db.postgres.database.azure.com/dreamladder?sslmode=require'

db = SessionLocal()
result = db.execute(text("SELECT tablename FROM pg_tables WHERE schemaname='public'")).fetchall()
print('Tables in Azure DB:')
for r in result:
    print(f'- {r[0]}')
db.close()
