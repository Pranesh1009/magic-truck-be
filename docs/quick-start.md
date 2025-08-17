# Shipment Cost Calculation API Documentation

## Overview

This API provides shipment cost calculation using Google Maps for distance calculation and comprehensive cost breakdown.

## Prerequisites

1. Set up Google Maps API key in your environment variables:

   ```
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

2. Install dependencies:
   ```bash
   npm install @googlemaps/google-maps-services-js
   ```

## API Endpoints

### 1. Calculate Shipment Cost

**POST** `/api/shipments/calculate-cost`

Calculate shipment cost without creating a shipment record.

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

### 2. Create Shipment with Cost Calculation

**POST** `/api/shipments`

Create a new shipment with automatic cost calculation.

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
  "pickupTime": "09:00"
}
```

### 3. Get Distance and Duration

**GET** `/api/shipments/distance-duration?pickupAddress=Mumbai&dropAddress=Delhi`

Get distance and duration between two locations.

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

## Vehicle Types and Rates

| Vehicle Type    | Rate per km | Base Cost |
| --------------- | ----------- | --------- |
| truck           | ₹15         | ₹1,000    |
| mini_truck      | ₹12         | ₹800      |
| tempo           | ₹10         | ₹600      |
| pickup          | ₹8          | ₹400      |
| tractor_trailer | ₹20         | ₹1,500    |

## Add-on Services

| Add-on                 | Cost        |
| ---------------------- | ----------- |
| express_delivery       | ₹500 (flat) |
| fragile_handling       | ₹300 (flat) |
| temperature_controlled | ₹2/km       |
| insurance              | ₹200 (flat) |
| weekend_delivery       | ₹400 (flat) |
| night_delivery         | ₹600 (flat) |

## Cost Calculation Formula

1. **Distance Cost**: Distance (km) × Vehicle Rate per km
2. **Weight Cost**: Weight (tons) × ₹500 per ton
3. **Vehicle Type Cost**: Base cost for vehicle type
4. **Add-on Costs**: Sum of all selected add-on costs
5. **Total Cost**: Distance Cost + Weight Cost + Vehicle Type Cost + Add-on Costs

## Error Handling

The API returns appropriate error messages for:

- Invalid addresses
- Missing required fields
- Google Maps API errors
- Database errors

## Example Usage with cURL

```bash
# Calculate shipment cost
curl -X POST http://localhost:3000/api/shipments/calculate-cost \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000,
    "addOns": ["express_delivery", "insurance"]
  }'

# Create shipment
curl -X POST http://localhost:3000/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleType": "truck",
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "commodity": "Electronics",
    "weight": "5000",
    "pickupContactName": "John Doe",
    "pickupContactNumber": "+91-9876543210",
    "dropContactName": "Jane Smith",
    "dropContactNumber": "+91-9876543211"
  }'
```
