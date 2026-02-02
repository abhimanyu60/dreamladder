# Dream Ladder Backend API

Python backend for Dream Ladder Real Estate Platform using Azure Functions.

## Setup

### Prerequisites
- Python 3.9+
- Azure Functions Core Tools
- PostgreSQL database (Azure Database for PostgreSQL recommended for free tier)

### Installation

1. Install dependencies:
```bash
cd api
pip install -r requirements.txt
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your database connection and settings

### Database Setup

For **Azure Database for PostgreSQL** (Free Tier):
1. Create Azure Database for PostgreSQL Flexible Server (Burstable B1ms tier is free-eligible)
2. Copy connection string to `.env` as `DATABASE_URL`
3. Run database initialization:

```bash
python -c "from models import init_db; init_db()"
```

4. Create initial admin user:
```python
from models import SessionLocal, AdminUser
from utils import get_password_hash
import uuid

db = SessionLocal()
admin = AdminUser(
    id=str(uuid.uuid4()),
    email="admin@dreamladder.com",
    password_hash=get_password_hash("yourpassword"),
    name="Admin",
    role="admin"
)
db.add(admin)
db.commit()
db.close()
```

### Local Development

```bash
cd api
func start
```

API will be available at `http://localhost:7071/api/v1`

### Deploy to Azure

This API is designed to work with Azure Static Web Apps (which includes Azure Functions support for free).

1. The API will automatically deploy when you push to your GitHub repository
2. Make sure the workflow file has `api_location: "api"` configured
3. Add environment variables in Azure Static Web Apps Configuration → Environment Variables

## API Endpoints

See `docs/API_ENDPOINTS.md` for complete documentation.

### Public Endpoints
- `POST /api/v1/enquiries` - Submit enquiry
- `GET /api/v1/properties` - List properties

### Admin Endpoints (requires authentication)
- `POST /api/v1/auth/login` - Admin login
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `POST /api/v1/properties` - Create property
- `GET /api/v1/enquiries` - List all enquiries

## Environment Variables (Azure Static Web Apps)

Add these in Azure Portal → Static Web Apps → Configuration → Environment Variables:

```
DATABASE_URL=postgresql://user:pass@host:5432/dreamladder
JWT_SECRET_KEY=your-secret-key
ADMIN_EMAIL=admin@dreamladder.com
ADMIN_PASSWORD=your-password
```

## Database Schema

See models.py for complete schema. Main tables:
- `properties` - Property listings
- `enquiries` - Customer enquiries
- `admin_users` - Admin authentication
- `settings` - System settings

## Cost Optimization (Azure Free Tier)

1. **Azure Static Web Apps**: Free tier includes:
   - Hosting for static files
   - Azure Functions (up to 12,000 executions/month)
   - Custom domains & SSL

2. **Azure Database for PostgreSQL**: 
   - Burstable B1ms tier eligible for 12 months free
   - 750 hours/month free
   - 32 GB storage

3. **Total Monthly Cost**: $0 for first 12 months with Azure Free Account

## Security Notes

1. Change default admin password immediately
2. Use strong JWT_SECRET_KEY
3. Enable SSL/HTTPS (automatic with Static Web Apps)
4. Configure CORS properly in production
5. Use environment variables for all secrets
