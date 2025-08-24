# Appointment Management API Documentation

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

All appointment endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Appointment Endpoints

### 1. Get All Appointments

**Endpoint:** `GET /appointment`

**Description:** Retrieves appointments based on user role and query parameters.

**Role-based Behavior:**

- **Doctor:** Returns only today's appointments for the authenticated doctor (filtered by doctor's email)
- **Admin:** Returns all appointments (with optional filtering and pagination)

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 10) | `?limit=20` |
| `sortBy` | string | Field to sort by (default: createdAt) | `?sortBy=patientName` |
| `sortOrder` | string | Sort order: 'asc' or 'desc' (default: desc) | `?sortOrder=asc` |
| `dateFilter` | string | Date filter: 'today', 'yesterday', 'week', 'month', 'year' | `?dateFilter=week` |
| `status` | string | Filter by status: 'pending', 'completed' | `?status=pending` |
| `doctorId` | string | Filter by doctor ID (admin only) | `?doctorId=64a1b2c3d4e5f6789012345` |

**Available Sort Fields:**

- `createdAt` (default)
- `patientName`
- `doctorName`
- `status`
- `fee`

**Default Behavior (No Query Parameters):**

- **Page:** 1 (first page)
- **Limit:** 10 (10 appointments per page)
- **Sort By:** createdAt (creation date)
- **Sort Order:** desc (latest first)
- **Doctor Role:** Today's appointments only
- **Admin Role:** All appointments

**Example Requests:**

1. **Basic request (Doctor) - Shows latest today's appointments:**

```
GET /api/v1/appointment
```

2. **Basic request (Admin) - Shows latest 10 appointments:**

```
GET /api/v1/appointment
```

3. **Paginated request:**

```
GET /api/v1/appointment?page=2&limit=5
```

4. **Filter today's appointments (Admin only):**

```
GET /api/v1/appointment?dateFilter=today
```

5. **Filter by status:**

```
GET /api/v1/appointment?status=pending
```

6. **Sort by patient name ascending:**

```
GET /api/v1/appointment?sortBy=patientName&sortOrder=asc
```

7. **Complex query (Admin only):**

```
GET /api/v1/appointment?page=1&limit=10&dateFilter=week&status=completed&sortBy=createdAt&sortOrder=desc
```

8. **Filter by specific doctor (Admin only):**

```
GET /api/v1/appointment?doctorId=64a1b2c3d4e5f6789012345
```

**Response Format:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Appointments retrieved successfully!",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "patientName": "John Doe",
      "doctorName": "Dr. Smith",
      "phone": "+1234567890",
      "fee": "500",
      "status": "pending",
      "nextAppointmentDate": "2024-01-15",
      "doctor": {
        "_id": "64a1b2c3d4e5f6789012346",
        "name": "Dr. Smith",
        "speciality": "Cardiology",
        "hospitalName": "City Hospital"
      },
      "createdAt": "2024-01-10T10:30:00.000Z",
      "updatedAt": "2024-01-10T10:30:00.000Z"
    }
  ]
}
```

### 2. Create Appointment

**Endpoint:** `POST /appointment/create`

**Request Body:**

```json
{
  "doctor": "64a1b2c3d4e5f6789012346",
  "patientName": "John Doe",
  "doctorName": "Dr. Smith",
  "phone": "+1234567890",
  "fee": "500",
  "nextAppointmentDate": "2024-01-15"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "doctor": "64a1b2c3d4e5f6789012346",
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "phone": "+1234567890",
    "fee": "500",
    "status": "pending",
    "nextAppointmentDate": "2024-01-15",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-10T10:30:00.000Z"
  }
}
```

### 3. Get Single Appointment

**Endpoint:** `GET /appointment/single/:id`

**Example:**

```
GET /api/v1/appointment/single/64a1b2c3d4e5f6789012345
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Single Appointment got!",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "doctor": "64a1b2c3d4e5f6789012346",
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "phone": "+1234567890",
    "fee": "500",
    "status": "pending",
    "nextAppointmentDate": "2024-01-15",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-10T10:30:00.000Z"
  }
}
```

### 4. Update Appointment

**Endpoint:** `PATCH /appointment/update/:id`

**Example:**

```
PATCH /api/v1/appointment/update/64a1b2c3d4e5f6789012345
```

**Request Body:**

```json
{
  "patientName": "John Smith",
  "fee": "600",
  "nextAppointmentDate": "2024-01-20"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Appointment updated successfully!",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "doctor": "64a1b2c3d4e5f6789012346",
    "patientName": "John Smith",
    "doctorName": "Dr. Smith",
    "phone": "+1234567890",
    "fee": "600",
    "status": "pending",
    "nextAppointmentDate": "2024-01-20",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-10T11:15:00.000Z"
  }
}
```

### 5. Complete Appointment

**Endpoint:** `PATCH /appointment/complete/:id`

**Example:**

```
PATCH /api/v1/appointment/complete/64a1b2c3d4e5f6789012345
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Appointment marked as completed and WhatsApp message sent",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "doctor": "64a1b2c3d4e5f6789012346",
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "phone": "+1234567890",
    "fee": "500",
    "status": "completed",
    "nextAppointmentDate": "2024-01-15",
    "whatsappMessageSid": "SM1234567890abcdef",
    "whatsappStatus": "sent",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-10T11:20:00.000Z"
  }
}
```

### 6. Delete Appointment

**Endpoint:** `DELETE /appointment/delete/:id`

**Example:**

```
DELETE /api/v1/appointment/delete/64a1b2c3d4e5f6789012345
```

**Response:**

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Appointment deleted successfully!",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "doctor": "64a1b2c3d4e5f6789012346",
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "phone": "+1234567890",
    "fee": "500",
    "status": "pending",
    "nextAppointmentDate": "2024-01-15",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-10T10:30:00.000Z"
  }
}
```

## Postman Testing Collection

### Environment Variables

Create a Postman environment with these variables:

- `baseUrl`: `http://localhost:3000/api/v1`
- `authToken`: `<your_jwt_token>`

### Headers for All Requests

```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

## Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "success": false,
  "message": "Unauthorized access",
  "errorMessages": [
    {
      "path": "authorization",
      "message": "Invalid token"
    }
  ]
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "success": false,
  "message": "Forbidden access",
  "errorMessages": [
    {
      "path": "role",
      "message": "Insufficient permissions"
    }
  ]
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "success": false,
  "message": "Appointment not found",
  "errorMessages": [
    {
      "path": "id",
      "message": "Appointment with this ID does not exist"
    }
  ]
}
```

### 400 Bad Request

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation error",
  "errorMessages": [
    {
      "path": "patientName",
      "message": "Patient name is required"
    }
  ]
}
```

## Date Filter Examples

### Today's Appointments

```
GET /api/v1/appointment?dateFilter=today
```

### Yesterday's Appointments

```
GET /api/v1/appointment?dateFilter=yesterday
```

### This Week's Appointments

```
GET /api/v1/appointment?dateFilter=week
```

### This Month's Appointments

```
GET /api/v1/appointment?dateFilter=month
```

### This Year's Appointments

```
GET /api/v1/appointment?dateFilter=year
```

## Sorting Examples

### Sort by Patient Name (A-Z)

```
GET /api/v1/appointment?sortBy=patientName&sortOrder=asc
```

### Sort by Creation Date (Newest First)

```
GET /api/v1/appointment?sortBy=createdAt&sortOrder=desc
```

### Sort by Fee (Highest First)

```
GET /api/v1/appointment?sortBy=fee&sortOrder=desc
```

## Combined Query Examples

### Admin: Get pending appointments from this week, sorted by patient name, page 2

```
GET /api/v1/appointment?dateFilter=week&status=pending&sortBy=patientName&sortOrder=asc&page=2&limit=5
```

### Admin: Get all completed appointments from today

```
GET /api/v1/appointment?dateFilter=today&status=completed
```

### Doctor: Get today's appointments (automatic filtering)

```
GET /api/v1/appointment
```

### Admin: Get appointments for specific doctor from this month

```
GET /api/v1/appointment?doctorId=64a1b2c3d4e5f6789012346&dateFilter=month
```

## Notes

1. **Doctor Role Limitations:**

   - Doctors can only see their own appointments (filtered by their email address)
   - Doctors automatically get today's appointments only
   - Date filters are ignored for doctor role

2. **Admin Role Privileges:**

   - Can see all appointments
   - Can filter by date ranges
   - Can filter by specific doctors
   - Full access to pagination and sorting

3. **Pagination:**

   - Default page size is 10
   - Maximum recommended page size is 100
   - Page numbers start from 1

4. **Sorting:**

   - Default sort is by `createdAt` in descending order
   - Multiple sort fields are not supported in a single request

5. **Date Filters:**
   - Week starts on Sunday
   - Month and year filters use calendar boundaries
   - All dates are in UTC timezone
