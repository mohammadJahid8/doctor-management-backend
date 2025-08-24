# Referral System API Documentation

## Overview

The referral system allows administrators to generate unique referral codes for doctors, send them via email, and manage their validity and usage.

## Features

- ✅ Generate unique referral codes in format `DOCXXXXX`
- ✅ Send beautiful HTML emails with referral codes
- ✅ Automatic validity checking based on expiration date
- ✅ CRUD operations for referral management
- ✅ Public endpoints for code validation and usage
- ✅ Automatic cron job to update expired referrals

## API Endpoints

### 1. Create Referral (Admin Only)

**POST** `/api/referrals`

**Headers:**

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "doctorName": "Dr. John Doe",
  "email": "doctor@example.com",
  "validUntil": "2024-12-31T23:59:59.000Z"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Referral created successfully and email sent",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "code": "DOCA1B2C",
    "doctorName": "Dr. John Doe",
    "email": "doctor@example.com",
    "validUntil": "2024-12-31T23:59:59.000Z",
    "isValid": true,
    "isUsed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Get All Referrals

**GET** `/api/referrals`

**Query Parameters:**

- `isValid` (boolean): Filter by validity status
- `isUsed` (boolean): Filter by usage status
- `email` (string): Search by email (case-insensitive)
- `doctorName` (string): Search by doctor name (case-insensitive)

**Example:**

```
GET /api/referrals?isValid=true&isUsed=false&email=doctor@example.com
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Referrals fetched successfully",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "code": "DOCA1B2C",
      "doctorName": "Dr. John Doe",
      "email": "doctor@example.com",
      "validUntil": "2024-12-31T23:59:59.000Z",
      "isValid": true,
      "isUsed": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Referral by ID

**GET** `/api/referrals/:id`

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Referral fetched successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "code": "DOCA1B2C",
    "doctorName": "Dr. John Doe",
    "email": "doctor@example.com",
    "validUntil": "2024-12-31T23:59:59.000Z",
    "isValid": true,
    "isUsed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Referral (Admin Only)

**PATCH** `/api/referrals/:id`

**Headers:**

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "doctorName": "Dr. Jane Smith",
  "email": "jane@example.com",
  "validUntil": "2024-12-31T23:59:59.000Z"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Referral updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "code": "DOCA1B2C",
    "doctorName": "Dr. Jane Smith",
    "email": "jane@example.com",
    "validUntil": "2024-12-31T23:59:59.000Z",
    "isValid": true,
    "isUsed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 5. Delete Referral (Admin Only)

**DELETE** `/api/referrals/:id`

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Referral deleted successfully",
  "data": null
}
```

### 6. Validate Referral Code (Public)

**POST** `/api/referrals/validate`

**Request Body:**

```json
{
  "code": "DOCA1B2C"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Referral code is valid",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "code": "DOCA1B2C",
    "doctorName": "Dr. John Doe",
    "email": "doctor@example.com",
    "validUntil": "2024-12-31T23:59:59.000Z",
    "isValid": true,
    "isUsed": false
  }
}
```

### 7. Use Referral Code (Public)

**POST** `/api/referrals/use`

**Request Body:**

```json
{
  "code": "DOCA1B2C"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Referral code used successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "code": "DOCA1B2C",
    "doctorName": "Dr. John Doe",
    "email": "doctor@example.com",
    "validUntil": "2024-12-31T23:59:59.000Z",
    "isValid": true,
    "isUsed": true
  }
}
```

### 8. Update Expired Referrals (Admin Only)

**POST** `/api/referrals/update-expired`

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Expired referrals updated successfully",
  "data": {
    "acknowledged": true,
    "modifiedCount": 5,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 5
  }
}
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Invalid referral code",
  "data": null
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "success": false,
  "message": "Referral not found",
  "data": null
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "success": false,
  "message": "Access denied",
  "data": null
}
```

## Email Templates

The system sends beautiful HTML emails with the following features:

- Responsive design
- Professional styling
- Referral code prominently displayed
- Doctor details and validity information
- Call-to-action buttons
- Fallback text version

## Automatic Features

### Cron Job

- **Schedule**: Daily at 2:00 AM (IST)
- **Function**: Automatically marks expired referrals as invalid
- **Logging**: Console logs for monitoring

### Validity Checking

- **Pre-save middleware**: Checks validity on save
- **Instance method**: `isValidReferral()` for runtime checks
- **Static method**: `updateExpiredReferrals()` for bulk updates

## Code Generation

Referral codes are generated in the format `DOCXXXXX` where:

- `DOC` is the prefix
- `XXXXX` are 5 random alphanumeric characters
- Uniqueness is guaranteed by database checking
- Maximum 100 attempts to prevent infinite loops

## Database Schema

```javascript
{
  code: String (unique, required),
  doctorName: String (optional),
  email: String (required),
  validUntil: Date (required),
  isValid: Boolean (default: true),
  isUsed: Boolean (default: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Security Features

- Admin-only endpoints for CRUD operations
- Public endpoints for code validation and usage
- Automatic validity checking
- Unique code generation
- Email verification for updates

## Usage Examples

### Frontend Integration

```javascript
// Validate a referral code
const validateCode = async code => {
  const response = await fetch('/api/referrals/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  return response.json();
};

// Use a referral code
const useCode = async code => {
  const response = await fetch('/api/referrals/use', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  return response.json();
};
```

### Admin Panel Integration

```javascript
// Create a new referral
const createReferral = async data => {
  const response = await fetch('/api/referrals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
```
