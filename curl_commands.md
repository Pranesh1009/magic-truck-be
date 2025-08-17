# Business Dealer API - cURL Commands

This file contains cURL commands for testing the Business Dealer Onboarding API and Shipment Management API.

## Base URL

```bash
BASE_URL="http://localhost:3000/api"
```

## 1. Health Check

```bash
curl -X GET "${BASE_URL}/health"
```

## 2. Business Types

### Create Business Type

```bash
curl -X POST "${BASE_URL}/business-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Transportation",
    "description": "Transportation and logistics business"
  }'
```

### Get All Business Types

```bash
curl -X GET "${BASE_URL}/business-types?page=1&limit=10"
```

### Get Business Type by ID

```bash
# Replace BUSINESS_TYPE_ID with actual ID
curl -X GET "${BASE_URL}/business-types/BUSINESS_TYPE_ID"
```

## 3. Business Dealer Onboarding

### Create Business Dealer (Full Data)

```bash
curl -X POST "${BASE_URL}/business-dealers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "password": "securePassword123",
    "gst": "GST123456789",
    "gst_doc": "https://example.com/documents/gst_certificate.pdf",
    "other_doc": [
      "https://example.com/documents/business_license.pdf",
      "https://example.com/documents/tax_certificate.pdf"
    ],
    "identity_doc": [
      "https://example.com/documents/aadhar_card.pdf",
      "https://example.com/documents/pan_card.pdf"
    ],
    "businessTypeId": "BUSINESS_TYPE_ID"
  }'
```

### Create Business Dealer (Minimal Data)

```bash
curl -X POST "${BASE_URL}/business-dealers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "+1987654321",
    "password": "password123",
    "gst": "GST987654321",
    "businessTypeId": "BUSINESS_TYPE_ID"
  }'
```

## 4. Business Dealer Management

### Get All Business Dealers

```bash
curl -X GET "${BASE_URL}/business-dealers?page=1&limit=10"
```

### Get Business Dealer by ID

```bash
# Replace BUSINESS_DEALER_ID with actual ID
curl -X GET "${BASE_URL}/business-dealers/BUSINESS_DEALER_ID"
```

### Update Business Dealer

```bash
# Replace BUSINESS_DEALER_ID with actual ID
curl -X PUT "${BASE_URL}/business-dealers/BUSINESS_DEALER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phoneNumber": "+1234567890",
    "gst": "GST123456789",
    "gst_doc": "https://example.com/documents/updated_gst_certificate.pdf",
    "other_doc": [
      "https://example.com/documents/updated_business_license.pdf",
      "https://example.com/documents/updated_tax_certificate.pdf"
    ],
    "identity_doc": [
      "https://example.com/documents/updated_aadhar_card.pdf",
      "https://example.com/documents/updated_pan_card.pdf"
    ],
    "businessTypeId": "BUSINESS_TYPE_ID"
  }'
```

### Update Business Dealer (Partial)

```bash
# Replace BUSINESS_DEALER_ID with actual ID
curl -X PUT "${BASE_URL}/business-dealers/BUSINESS_DEALER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated Name Only",
    "gst_doc": "https://example.com/documents/new_gst_certificate.pdf"
  }'
```

### Delete Business Dealer

```bash
# Replace BUSINESS_DEALER_ID with actual ID
curl -X DELETE "${BASE_URL}/business-dealers/BUSINESS_DEALER_ID"
```

## 5. Authentication

### Register User

```bash
curl -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test.user@example.com",
    "phoneNumber": "+1111111111",
    "password": "password123",
    "roleId": "DEALER_ROLE_ID"
  }'
```

### Login User

```bash
curl -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

## 6. Roles

### Create Role

```bash
curl -X POST "${BASE_URL}/role" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "dealer",
    "description": "Business dealer role with access to dealer-specific features"
  }'
```

### Get All Roles

```bash
curl -X GET "${BASE_URL}/role"
```

## 7. Shipment Management

### Calculate Shipment Cost

```bash
curl -X POST "${BASE_URL}/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000,
    "commodity": "Electronics",
    "addOns": ["express_delivery", "insurance"]
  }'
```

### Create Shipment

```bash
curl -X POST "${BASE_URL}/shipments" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleType": "truck",
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "commodity": "Electronics",
    "weight": "5000",
    "specialInstructions": "Handle with care",
    "pickupContactName": "John Doe",
    "pickupContactNumber": "+91-9876543210",
    "dropContactName": "Jane Smith",
    "dropContactNumber": "+91-9876543211",
    "addOns": ["express_delivery", "insurance"],
    "pickupDate": "2024-01-15",
    "dropDate": "2024-01-16",
    "pickupTime": "09:00",
    "dropTime": "18:00",
    "truckOption": "refrigerated"
  }'
```

### Get All Shipments

```bash
curl -X GET "${BASE_URL}/shipments?page=1&limit=10"
```

### Get Shipment by ID

```bash
# Replace SHIPMENT_ID with actual ID
curl -X GET "${BASE_URL}/shipments/SHIPMENT_ID"
```

### Update Shipment

```bash
# Replace SHIPMENT_ID with actual ID
curl -X PUT "${BASE_URL}/shipments/SHIPMENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleType": "mini_truck",
    "specialInstructions": "Updated instructions",
    "addOns": ["express_delivery", "fragile_handling"],
    "pickupTime": "10:00"
  }'
```

### Delete Shipment

```bash
# Replace SHIPMENT_ID with actual ID
curl -X DELETE "${BASE_URL}/shipments/SHIPMENT_ID"
```

### Get Distance and Duration

```bash
curl -X GET "${BASE_URL}/shipments/distance-duration?pickupAddress=Mumbai&dropAddress=Delhi"
```

## Testing Workflow

### Step 1: Health Check

```bash
curl -X GET "${BASE_URL}/health"
```

### Step 2: Create Business Type

```bash
curl -X POST "${BASE_URL}/business-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Transportation",
    "description": "Transportation and logistics business"
  }'
```

### Step 3: Get Business Type ID

```bash
curl -X GET "${BASE_URL}/business-types"
```

### Step 4: Create Business Dealer

```bash
# Use the businessTypeId from Step 3
curl -X POST "${BASE_URL}/business-dealers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "password": "securePassword123",
    "gst": "GST123456789",
    "businessTypeId": "BUSINESS_TYPE_ID_FROM_STEP_3"
  }'
```

### Step 5: Verify Business Dealer Creation

```bash
curl -X GET "${BASE_URL}/business-dealers"
```

### Step 6: Test Login

```bash
curl -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

### Step 7: Test Shipment Cost Calculation

```bash
curl -X POST "${BASE_URL}/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000,
    "commodity": "Electronics",
    "addOns": ["express_delivery", "insurance"]
  }'
```

### Step 8: Create Shipment

```bash
curl -X POST "${BASE_URL}/shipments" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleType": "truck",
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "commodity": "Electronics",
    "weight": "5000",
    "specialInstructions": "Handle with care",
    "pickupContactName": "John Doe",
    "pickupContactNumber": "+91-9876543210",
    "dropContactName": "Jane Smith",
    "dropContactNumber": "+91-9876543211",
    "addOns": ["express_delivery", "insurance"]
  }'
```

### Step 9: Verify Shipment Creation

```bash
curl -X GET "${BASE_URL}/shipments"
```

## Environment Variables

You can set up environment variables for easier testing:

```bash
export BASE_URL="http://localhost:3000/api"
export BUSINESS_TYPE_ID="your-business-type-id"
export BUSINESS_DEALER_ID="your-business-dealer-id"
export SHIPMENT_ID="your-shipment-id"
```

Then use them in commands:

```bash
curl -X GET "${BASE_URL}/business-dealers/${BUSINESS_DEALER_ID}"
curl -X GET "${BASE_URL}/shipments/${SHIPMENT_ID}"
```

## Error Testing

### Test Missing Required Fields

```bash
curl -X POST "${BASE_URL}/business-dealers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

### Test Duplicate Email

```bash
# Run this twice with the same email
curl -X POST "${BASE_URL}/business-dealers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "password": "securePassword123",
    "gst": "GST123456789",
    "businessTypeId": "BUSINESS_TYPE_ID"
  }'
```

### Test Invalid Business Type ID

```bash
curl -X POST "${BASE_URL}/business-dealers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "password": "securePassword123",
    "gst": "GST123456789",
    "businessTypeId": "invalid-uuid"
  }'
```

### Test Shipment with Missing Required Fields

```bash
curl -X POST "${BASE_URL}/shipments" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleType": "truck",
    "pickupAddress": "Mumbai, Maharashtra, India"
  }'
```

### Test Invalid Vehicle Type

```bash
curl -X POST "${BASE_URL}/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "invalid_vehicle",
    "weight": 5000
  }'
```

## Vehicle Types and Pricing

### Available Vehicle Types:

- `truck`: ₹15/km + ₹1,000 base
- `mini_truck`: ₹12/km + ₹800 base
- `tempo`: ₹10/km + ₹600 base
- `pickup`: ₹8/km + ₹400 base
- `tractor_trailer`: ₹20/km + ₹1,500 base

### Available Add-on Services:

- `express_delivery`: ₹500
- `fragile_handling`: ₹300
- `temperature_controlled`: ₹2/km
- `insurance`: ₹200
- `weekend_delivery`: ₹400
- `night_delivery`: ₹600
