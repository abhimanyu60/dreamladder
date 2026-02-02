# Dream Ladder API Endpoints Documentation

This document outlines all the API endpoints required for the Dream Ladder real estate platform backend.

## Base URL
```
/api/v1
```

---

## Authentication

### POST `/auth/login`
Admin login endpoint.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "admin"
    }
  }
}
```

### POST `/auth/logout`
Logout and invalidate token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET `/auth/me`
Get current authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "admin"
  }
}
```

---

## Properties

### GET `/properties`
Get all properties with optional filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| status | string | Filter by status: `available`, `sold`, `upcoming` |
| type | string | Filter by type: `residential`, `agricultural`, `commercial` |
| featured | boolean | Filter featured properties only |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| location | string | Filter by location (partial match) |
| search | string | Search in title, description, location |

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "string",
        "title": "string",
        "slug": "string",
        "description": "string",
        "shortDescription": "string",
        "price": "number",
        "pricePerSqFt": "number",
        "area": "string",
        "areaInSqFt": "number",
        "location": "string",
        "fullAddress": "string",
        "googleMapsLink": "string",
        "type": "residential | agricultural | commercial",
        "status": "available | sold | upcoming",
        "featured": "boolean",
        "images": ["string"],
        "amenities": ["string"],
        "highlights": ["string"],
        "legalInfo": {
          "registryAvailable": "boolean",
          "mutationComplete": "boolean",
          "clearTitle": "boolean",
          "encumbranceFree": "boolean"
        },
        "nearbyPlaces": [
          {
            "name": "string",
            "distance": "string"
          }
        ],
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number",
      "itemsPerPage": "number"
    }
  }
}
```

### GET `/properties/:id`
Get single property by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    // ... all property fields
  }
}
```

### POST `/properties`
Create new property (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "shortDescription": "string",
  "price": "number (required)",
  "pricePerSqFt": "number",
  "area": "string (required)",
  "areaInSqFt": "number",
  "location": "string (required)",
  "fullAddress": "string",
  "googleMapsLink": "string",
  "type": "residential | agricultural | commercial (required)",
  "status": "available | sold | upcoming",
  "featured": "boolean",
  "images": ["string"],
  "amenities": ["string"],
  "highlights": ["string"],
  "legalInfo": {
    "registryAvailable": "boolean",
    "mutationComplete": "boolean",
    "clearTitle": "boolean",
    "encumbranceFree": "boolean"
  },
  "nearbyPlaces": [
    {
      "name": "string",
      "distance": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    // ... created property
  },
  "message": "Property created successfully"
}
```

### PUT `/properties/:id`
Update property (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as POST (all fields optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    // ... updated property
  },
  "message": "Property updated successfully"
}
```

### DELETE `/properties/:id`
Delete property (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

### PATCH `/properties/:id/featured`
Toggle featured status (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "featured": "boolean"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "featured": "boolean"
  }
}
```

---

## Enquiries

### GET `/enquiries`
Get all enquiries (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| status | string | `pending`, `contacted`, `closed` |
| type | string | `callback`, `property_enquiry`, `general` |
| startDate | date | Filter from date |
| endDate | date | Filter to date |

**Response:**
```json
{
  "success": true,
  "data": {
    "enquiries": [
      {
        "id": "string",
        "type": "callback | property_enquiry | general",
        "name": "string",
        "email": "string",
        "phone": "string",
        "message": "string",
        "preferredTime": "string",
        "propertyId": "string | null",
        "propertyTitle": "string | null",
        "status": "pending | contacted | closed",
        "notes": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number"
    }
  }
}
```

### GET `/enquiries/:id`
Get single enquiry (Admin only).

**Headers:** `Authorization: Bearer <token>`

### POST `/enquiries`
Submit new enquiry (Public).

**Request Body:**
```json
{
  "type": "callback | property_enquiry | general (required)",
  "name": "string (required)",
  "email": "string",
  "phone": "string (required)",
  "message": "string",
  "preferredTime": "string",
  "propertyId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Enquiry submitted successfully",
  "data": {
    "id": "string",
    "referenceNumber": "string"
  }
}
```

### PATCH `/enquiries/:id/status`
Update enquiry status (Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "pending | contacted | closed",
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Enquiry status updated"
}
```

### DELETE `/enquiries/:id`
Delete enquiry (Admin only).

**Headers:** `Authorization: Bearer <token>`

---

## Callback Requests

### POST `/callbacks`
Submit callback request (Public).

**Request Body:**
```json
{
  "name": "string (required)",
  "phone": "string (required)",
  "preferredTime": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Callback request submitted successfully"
}
```

---

## Dashboard Stats (Admin)

### GET `/dashboard/stats`
Get dashboard statistics.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProperties": "number",
    "availableProperties": "number",
    "soldProperties": "number",
    "totalEnquiries": "number",
    "pendingEnquiries": "number",
    "thisMonthEnquiries": "number",
    "recentEnquiries": [
      {
        "id": "string",
        "name": "string",
        "type": "string",
        "createdAt": "datetime"
      }
    ],
    "enquiriesByMonth": [
      {
        "month": "string",
        "count": "number"
      }
    ]
  }
}
```

---

## Settings (Admin)

### GET `/settings`
Get admin settings.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "string",
      "email": "string",
      "phone": "string"
    },
    "company": {
      "name": "string",
      "address": "string",
      "phone1": "string",
      "phone2": "string",
      "email": "string",
      "workingHours": "string",
      "googleMapsEmbed": "string"
    },
    "notifications": {
      "emailOnEnquiry": "boolean",
      "emailOnCallback": "boolean",
      "dailyDigest": "boolean"
    }
  }
}
```

### PUT `/settings/profile`
Update admin profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string"
}
```

### PUT `/settings/company`
Update company settings.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "address": "string",
  "phone1": "string",
  "phone2": "string",
  "email": "string",
  "workingHours": "string",
  "googleMapsEmbed": "string"
}
```

### PUT `/settings/password`
Change admin password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

### PUT `/settings/notifications`
Update notification preferences.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "emailOnEnquiry": "boolean",
  "emailOnCallback": "boolean",
  "dailyDigest": "boolean"
}
```

---

## File Upload

### POST `/upload/image`
Upload property image (Admin only).

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:**
```
file: <image file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "string",
    "filename": "string",
    "size": "number"
  }
}
```

### DELETE `/upload/image/:filename`
Delete uploaded image (Admin only).

**Headers:** `Authorization: Bearer <token>`

---

## Database Schema

### Properties Table
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(15,2) NOT NULL,
  price_per_sqft DECIMAL(10,2),
  area VARCHAR(100) NOT NULL,
  area_in_sqft INTEGER,
  location VARCHAR(255) NOT NULL,
  full_address TEXT,
  google_maps_link VARCHAR(500),
  type VARCHAR(50) NOT NULL CHECK (type IN ('residential', 'agricultural', 'commercial')),
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'upcoming')),
  featured BOOLEAN DEFAULT FALSE,
  images JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  highlights JSONB DEFAULT '[]',
  legal_info JSONB DEFAULT '{}',
  nearby_places JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enquiries Table
```sql
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL CHECK (type IN ('callback', 'property_enquiry', 'general')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  message TEXT,
  preferred_time VARCHAR(100),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Settings Table
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Error Response Format

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} 
  }
}
```

### Common Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| INTERNAL_ERROR | 500 | Server error |

---

## Notes for Backend Implementation

1. **Authentication**: Use JWT tokens with 24-hour expiry
2. **Password Hashing**: Use bcrypt with salt rounds of 12
3. **Rate Limiting**: Apply rate limiting on public endpoints (10 req/min for enquiries)
4. **Validation**: Validate phone numbers (Indian format: 10 digits)
5. **Email Notifications**: Send email to admin on new enquiry/callback
6. **Image Storage**: Store images in cloud storage (S3, Cloudinary, etc.)
7. **Slugs**: Auto-generate URL-friendly slugs from property titles
