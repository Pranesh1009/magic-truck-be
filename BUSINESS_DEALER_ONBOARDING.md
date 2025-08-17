# Business Dealer Onboarding API

This document describes the business dealer onboarding functionality that creates both a business dealer record and a user account with the "dealer" role.

## Overview

When a business dealer is onboarded, the system:

1. Creates a `BusinessDealers` record with business-specific information
2. Creates a `Users` record with authentication credentials
3. Assigns the "dealer" role to the user
4. Uses database transactions to ensure data consistency

## API Endpoints

### 1. Create Business Dealer (Onboarding)

**POST** `/api/business-dealers`

Creates a new business dealer and associated user account.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "password": "securePassword123",
  "gst": "GST123456789",
  "gst_doc": "gst_document_url.pdf",
  "other_doc": ["doc1.pdf", "doc2.pdf"],
  "identity_doc": ["aadhar.pdf", "pan.pdf"],
  "businessTypeId": "uuid-of-business-type"
}
```

#### Required Fields

- `name`: Dealer's full name
- `email`: Unique email address
- `phoneNumber`: Unique phone number
- `password`: Secure password (will be hashed)
- `gst`: GST number
- `businessTypeId`: ID of the business type

#### Optional Fields

- `gst_doc`: GST document URL
- `other_doc`: Array of other document URLs
- `identity_doc`: Array of identity document URLs

#### Response

```json
{
  "success": true,
  "data": {
    "businessDealer": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+1234567890",
      "gst": "GST123456789",
      "gst_doc": "gst_document_url.pdf",
      "other_doc": ["doc1.pdf", "doc2.pdf"],
      "identity_doc": ["aadhar.pdf", "pan.pdf"],
      "businessTypeId": "uuid-of-business-type",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+1234567890",
      "roleId": "dealer-role-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Business dealer onboarded successfully",
  "statusCode": 201
}
```

### 2. Get All Business Dealers

**GET** `/api/business-dealers?page=1&limit=10`

Retrieves all business dealers with pagination.

#### Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+1234567890",
      "gst": "GST123456789",
      "gst_doc": "gst_document_url.pdf",
      "other_doc": ["doc1.pdf", "doc2.pdf"],
      "identity_doc": ["aadhar.pdf", "pan.pdf"],
      "businessType": {
        "id": "uuid",
        "name": "Transportation",
        "description": "Transportation business"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Business dealers retrieved successfully",
  "statusCode": 200,
  "metadata": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 3. Get Business Dealer by ID

**GET** `/api/business-dealers/:id`

Retrieves a specific business dealer by ID.

#### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "gst": "GST123456789",
    "gst_doc": "gst_document_url.pdf",
    "other_doc": ["doc1.pdf", "doc2.pdf"],
    "identity_doc": ["aadhar.pdf", "pan.pdf"],
    "businessType": {
      "id": "uuid",
      "name": "Transportation",
      "description": "Transportation business"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Business dealer retrieved successfully",
  "statusCode": 200
}
```

### 4. Update Business Dealer

**PUT** `/api/business-dealers/:id`

Updates an existing business dealer.

#### Request Body

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phoneNumber": "+1234567890",
  "gst": "GST123456789",
  "gst_doc": "updated_gst_document_url.pdf",
  "other_doc": ["updated_doc1.pdf", "updated_doc2.pdf"],
  "identity_doc": ["updated_aadhar.pdf", "updated_pan.pdf"],
  "businessTypeId": "new-business-type-uuid"
}
```

### 5. Delete Business Dealer

**DELETE** `/api/business-dealers/:id`

Deletes a business dealer.

## Error Responses

### Validation Errors (400)

```json
{
  "success": false,
  "message": "Name, email, phone number, password, GST, and business type are required",
  "statusCode": 400
}
```

### Conflict Errors (400)

```json
{
  "success": false,
  "message": "Business dealer with this email already exists",
  "statusCode": 400
}
```

### Not Found Errors (404)

```json
{
  "success": false,
  "message": "Business dealer not found",
  "statusCode": 404
}
```

## Database Schema

### BusinessDealers Model

```prisma
model BusinessDealers {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  phoneNumber  String   @unique
  gst          String
  gst_doc      String
  other_doc    String[] @default([])
  identity_doc String[] @default([])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  businessType   BusinessTypes @relation(fields: [businessTypeId], references: [id])
  businessTypeId String

  @@index([id])
  @@index([businessTypeId])
  @@map("business_dealers")
}
```

### Users Model

```prisma
model Users {
  id          String   @id @default(uuid())
  name        String
  email       String   @unique
  password    String
  phoneNumber String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  role   Role   @relation(fields: [roleId], references: [id])
  roleId String

  @@index([id])
  @@index([roleId])
}
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **Input Validation**: Comprehensive validation of all required fields
3. **Duplicate Prevention**: Checks for existing email and phone numbers
4. **Database Transactions**: Ensures data consistency during onboarding
5. **Role-based Access**: Automatically assigns "dealer" role to onboarded users

## Usage Example

```javascript
// Example: Onboard a new business dealer
const response = await fetch("/api/business-dealers", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    password: "securePassword123",
    gst: "GST123456789",
    gst_doc: "gst_document_url.pdf",
    other_doc: ["doc1.pdf", "doc2.pdf"],
    identity_doc: ["aadhar.pdf", "pan.pdf"],
    businessTypeId: "uuid-of-business-type",
  }),
});

const result = await response.json();
console.log(result);
```

## Notes

- The "dealer" role is automatically created if it doesn't exist
- Both business dealer and user records are created in a single transaction
- Email and phone number must be unique across both business dealers and users
- All timestamps are automatically managed by Prisma
- The API includes comprehensive logging for debugging and monitoring
