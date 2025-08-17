# API Reference

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API doesn't require authentication. However, it's recommended to implement JWT authentication for production use.

## Response Format

All API responses follow a consistent format:

```json
{
  "status": "success" | "error",
  "message": "Response message",
  "data": {}, // Response data (for success)
  "metadata": {
    // Optional pagination metadata
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Endpoints

### 1. Calculate Shipment Cost

Calculate shipment cost without creating a shipment record.

**Endpoint:** `POST /shipments/calculate-cost`

**Request Body:**

```json
{
  "pickupAddress": "Mumbai, Maharashtra, India",
  "dropAddress": "Delhi, India",
  "vehicleType": "truck",
  "weight": 5000,
  "commodity": "Electronics",
  "addOns": ["express_delivery", "insurance"]
}
```

**Parameters:**

- `pickupAddress` (string, required): Pickup location address
- `dropAddress` (string, required): Delivery location address
- `vehicleType` (string, required): Type of vehicle (truck, mini_truck, tempo, pickup, tractor_trailer)
- `weight` (number, required): Weight in kilograms
- `commodity` (string, optional): Type of goods being shipped
- `addOns` (array, optional): Array of add-on services

**Response:**

```json
{
  "status": "success",
  "message": "Cost calculation completed successfully",
  "data": {
    "distance": {
      "text": "1,407 km",
      "value": 1407000
    },
    "duration": {
      "text": "1 day 2 hours",
      "value": 93600
    },
    "baseCost": 26105,
    "addOnCosts": 700,
    "totalCost": 26805,
    "breakdown": {
      "distanceCost": 21105,
      "weightCost": 2500,
      "vehicleTypeCost": 1000,
      "addOnsCost": 700
    }
  }
}
```

### 2. Create Shipment

Create a new shipment with automatic cost calculation.

**Endpoint:** `POST /shipments`

**Request Body:**

```json
{
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
  "pickupTime": "09:00",
  "dropDate": "2024-01-16",
  "dropTime": "18:00",
  "truckOption": "refrigerated"
}
```

**Parameters:**

- `vehicleType` (string, required): Type of vehicle
- `pickupAddress` (string, required): Pickup location address
- `dropAddress` (string, required): Delivery location address
- `commodity` (string, required): Type of goods
- `weight` (string, required): Weight in kilograms
- `specialInstructions` (string, optional): Special handling instructions
- `pickupContactName` (string, required): Pickup contact person name
- `pickupContactNumber` (string, required): Pickup contact phone number
- `dropContactName` (string, required): Delivery contact person name
- `dropContactNumber` (string, required): Delivery contact phone number
- `addOns` (array, optional): Array of add-on services
- `pickupDate` (string, optional): Pickup date (YYYY-MM-DD)
- `pickupTime` (string, optional): Pickup time (HH:MM)
- `dropDate` (string, optional): Delivery date (YYYY-MM-DD)
- `dropTime` (string, optional): Delivery time (HH:MM)
- `truckOption` (string, optional): Additional truck specifications

**Response:**

```json
{
  "status": "success",
  "message": "Shipment created successfully",
  "data": {
    "shipment": {
      "id": "uuid-here",
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
      "pickupDate": "2024-01-15T00:00:00.000Z",
      "pickupTime": "09:00",
      "dropDate": "2024-01-16T00:00:00.000Z",
      "dropTime": "18:00",
      "truckOption": "refrigerated",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "costCalculation": {
      "distance": {
        "text": "1,407 km",
        "value": 1407000
      },
      "duration": {
        "text": "1 day 2 hours",
        "value": 93600
      },
      "baseCost": 26105,
      "addOnCosts": 700,
      "totalCost": 26805,
      "breakdown": {
        "distanceCost": 21105,
        "weightCost": 2500,
        "vehicleTypeCost": 1000,
        "addOnsCost": 700
      }
    }
  }
}
```

### 3. Get All Shipments

Retrieve all shipments with pagination support.

**Endpoint:** `GET /shipments`

**Query Parameters:**

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Example:** `GET /shipments?page=1&limit=20`

**Response:**

```json
{
  "status": "success",
  "message": "Shipments retrieved successfully",
  "data": [
    {
      "id": "uuid-here",
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
      "pickupDate": "2024-01-15T00:00:00.000Z",
      "pickupTime": "09:00",
      "dropDate": "2024-01-16T00:00:00.000Z",
      "dropTime": "18:00",
      "truckOption": "refrigerated",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "metadata": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 4. Get Shipment by ID

Retrieve a specific shipment by its ID.

**Endpoint:** `GET /shipments/:id`

**Path Parameters:**

- `id` (string, required): Shipment UUID

**Example:** `GET /shipments/123e4567-e89b-12d3-a456-426614174000`

**Response:**

```json
{
  "status": "success",
  "message": "Shipment retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
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
    "pickupDate": "2024-01-15T00:00:00.000Z",
    "pickupTime": "09:00",
    "dropDate": "2024-01-16T00:00:00.000Z",
    "dropTime": "18:00",
    "truckOption": "refrigerated",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Update Shipment

Update an existing shipment.

**Endpoint:** `PUT /shipments/:id`

**Path Parameters:**

- `id` (string, required): Shipment UUID

**Request Body:** (All fields are optional for updates)

```json
{
  "vehicleType": "mini_truck",
  "specialInstructions": "Updated instructions",
  "addOns": ["express_delivery", "fragile_handling"],
  "pickupTime": "10:00"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Shipment updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "vehicleType": "mini_truck",
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "commodity": "Electronics",
    "weight": "5000",
    "specialInstructions": "Updated instructions",
    "pickupContactName": "John Doe",
    "pickupContactNumber": "+91-9876543210",
    "dropContactName": "Jane Smith",
    "dropContactNumber": "+91-9876543211",
    "addOns": ["express_delivery", "fragile_handling"],
    "pickupDate": "2024-01-15T00:00:00.000Z",
    "pickupTime": "10:00",
    "dropDate": "2024-01-16T00:00:00.000Z",
    "dropTime": "18:00",
    "truckOption": "refrigerated",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

### 6. Delete Shipment

Delete a shipment by its ID.

**Endpoint:** `DELETE /shipments/:id`

**Path Parameters:**

- `id` (string, required): Shipment UUID

**Example:** `DELETE /shipments/123e4567-e89b-12d3-a456-426614174000`

**Response:**

```json
{
  "status": "success",
  "message": "Shipment deleted successfully",
  "data": null
}
```

### 7. Get Distance and Duration

Calculate distance and duration between two locations.

**Endpoint:** `GET /shipments/distance-duration`

**Query Parameters:**

- `pickupAddress` (string, required): Pickup location address
- `dropAddress` (string, required): Delivery location address

**Example:** `GET /shipments/distance-duration?pickupAddress=Mumbai&dropAddress=Delhi`

**Response:**

```json
{
  "status": "success",
  "message": "Distance and duration calculated successfully",
  "data": {
    "distance": {
      "text": "1,407 km",
      "value": 1407000
    },
    "duration": {
      "text": "1 day 2 hours",
      "value": 93600
    }
  }
}
```

## Error Responses

### Validation Error (400)

```json
{
  "status": "error",
  "message": "Validation error: Vehicle type is required"
}
```

### Not Found Error (404)

```json
{
  "status": "error",
  "message": "Shipment not found"
}
```

### Server Error (500)

```json
{
  "status": "error",
  "message": "Failed to calculate shipment cost"
}
```

## Rate Limiting

Currently, there are no rate limits implemented. For production use, consider implementing rate limiting to prevent abuse.

## CORS

The API supports CORS for cross-origin requests. Configure allowed origins in your environment variables.

## Data Types

### Vehicle Types

- `truck`
- `mini_truck`
- `tempo`
- `pickup`
- `tractor_trailer`

### Add-on Services

- `express_delivery`
- `fragile_handling`
- `temperature_controlled`
- `insurance`
- `weekend_delivery`
- `night_delivery`

### Date Formats

- Dates: `YYYY-MM-DD`
- Times: `HH:MM` (24-hour format)
- ISO 8601 for database timestamps

## Pagination

Pagination is supported for list endpoints with the following metadata:

- `total`: Total number of records
- `page`: Current page number
- `limit`: Number of items per page
- `totalPages`: Total number of pages
