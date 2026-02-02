# Dream Ladder - Deployment Guide

## Frontend + Backend Deployment to Azure (Free Tier)

### Prerequisites
1. Azure Account with free tier
2. GitHub repository
3. Azure Database for PostgreSQL (Free tier)

### Step 1: Create Azure Database for PostgreSQL

1. Go to Azure Portal → Create Resource → Azure Database for PostgreSQL
2. Select **Flexible Server**
3. Choose **Burstable** tier → **B1ms** (free eligible)
4. Note your connection string

### Step 2: Configure Environment Variables in Azure

1. Go to Azure Portal → Your Static Web App
2. Navigate to **Configuration** → **Environment Variables**
3. Add the following variables:

```
DATABASE_URL=postgresql://username:password@your-server.postgres.database.azure.com:5432/dreamladder?sslmode=require
JWT_SECRET_KEY=generate-a-random-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
ADMIN_EMAIL=admin@dreamladder.com
ADMIN_PASSWORD=your-secure-password
ALLOWED_ORIGINS=https://your-static-web-app.azurestaticapps.net
```

4. Click **Save**

### Step 3: Initialize Database

After first deployment, initialize the database using Azure Cloud Shell or local Azure Functions Core Tools:

```bash
# Install Azure Functions Core Tools locally
npm install -g azure-functions-core-tools@4

# Navigate to api folder
cd api

# Install Python dependencies
pip install -r requirements.txt

# Create .env file with your Azure Database connection
# Then run:
python -c "from models import init_db; init_db()"
```

### Step 4: Create Admin User

```python
from models import SessionLocal, AdminUser
from utils import get_password_hash
import uuid

db = SessionLocal()
admin = AdminUser(
    id=str(uuid.uuid4()),
    email="admin@dreamladder.com",
    password_hash=get_password_hash("your-secure-password"),
    name="Admin User",
    phone="+917004088007",
    role="admin"
)
db.add(admin)
db.commit()
db.close()
print("Admin user created successfully!")
```

### Step 5: Push to GitHub

The GitHub Actions workflow will automatically:
1. Build the React frontend
2. Deploy the Azure Functions backend
3. Deploy everything to Azure Static Web Apps

```bash
git add .
git commit -m "Add Python backend API"
git push origin main
```

### Step 6: Verify Deployment

1. Check GitHub Actions for deployment status
2. Your app will be available at: `https://polite-wave-09b691100.azurestaticapps.net`
3. API endpoints: `https://polite-wave-09b691100.azurestaticapps.net/api/v1/`

### API Endpoints

- Frontend: `https://your-app.azurestaticapps.net`
- API Base: `https://your-app.azurestaticapps.net/api/v1`

Test endpoints:
- `GET /api/v1/properties` - List properties (public)
- `POST /api/v1/auth/login` - Admin login
- `POST /api/v1/enquiries` - Submit enquiry (public)

### Cost Breakdown (Free Tier)

**Azure Static Web Apps (Free)**
- ✅ 100 GB bandwidth/month
- ✅ Azure Functions (12,000 executions/month)
- ✅ Custom domains & SSL
- ✅ Staging environments

**Azure Database for PostgreSQL (12 months free)**
- ✅ B1ms tier - 750 hours/month
- ✅ 32 GB storage
- ✅ After 12 months: ~$15-20/month

**Total First Year Cost: $0**
**After First Year: ~$15-20/month** (database only)

### Troubleshooting

**Database Connection Issues:**
- Ensure firewall allows Azure services
- Check connection string format
- Verify SSL mode is enabled

**Function App Not Deploying:**
- Check `api_location: "api"` in workflow
- Verify requirements.txt is present
- Check Azure Functions logs in portal

**CORS Errors:**
- Update `ALLOWED_ORIGINS` in environment variables
- Include your custom domain if using one

### Local Development

**Frontend:**
```bash
npm install
npm run dev
```

**Backend:**
```bash
cd api
pip install -r requirements.txt
func start
```

Frontend will run on `http://localhost:5173`
Backend will run on `http://localhost:7071`

### Production Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET_KEY
- [ ] Configure custom domain
- [ ] Enable SSL (automatic)
- [ ] Set up database backups
- [ ] Configure email notifications
- [ ] Add monitoring/alerts
- [ ] Review CORS settings
- [ ] Test all API endpoints
- [ ] Verify admin login

### Support

For issues, check:
1. GitHub Actions logs
2. Azure Static Web Apps logs
3. Azure Functions logs
4. PostgreSQL server logs

---

**Next Steps:**
1. Customize frontend with your branding
2. Add more properties to database
3. Configure email notifications for enquiries
4. Set up custom domain
5. Add Google Analytics
