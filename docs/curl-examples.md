# cURL Examples

This document provides comprehensive cURL examples for all MagicTruck API endpoints.

## Base Configuration

Set the base URL as a variable for easier use:

```bash
BASE_URL="http://localhost:3000/api"
```

## 1. Calculate Shipment Cost

### Basic Cost Calculation

```bash
curl -X POST "$BASE_URL/shipments/calculate-cost" \
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

### Cost Calculation with Different Vehicle Type

```bash
curl -X POST "$BASE_URL/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Bangalore, Karnataka, India",
    "dropAddress": "Chennai, Tamil Nadu, India",
    "vehicleType": "mini_truck",
    "weight": 2000,
    "commodity": "Textiles",
    "addOns": ["fragile_handling", "temperature_controlled"]
  }'
```

### Cost Calculation with All Add-ons

```bash
curl -X POST "$BASE_URL/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Pune, Maharashtra, India",
    "dropAddress": "Hyderabad, Telangana, India",
    "vehicleType": "tractor_trailer",
    "weight": 10000,
    "commodity": "Heavy Machinery",
    "addOns": [
      "express_delivery",
      "fragile_handling",
      "temperature_controlled",
      "insurance",
      "weekend_delivery",
      "night_delivery"
    ]
  }'
```

### Cost Calculation for Pickup Vehicle

```bash
curl -X POST "$BASE_URL/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Gurgaon, Haryana, India",
    "dropAddress": "Noida, Uttar Pradesh, India",
    "vehicleType": "pickup",
    "weight": 500,
    "commodity": "Documents",
    "addOns": ["express_delivery"]
  }'
```

## 2. Create Shipment

### Basic Shipment Creation

```bash
curl -X POST "$BASE_URL/shipments" \
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

### Complete Shipment with All Fields

```bash
curl -X POST "$BASE_URL/shipments" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleType": "truck",
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "commodity": "Electronics",
    "weight": "5000",
    "specialInstructions": "Handle with care, fragile items",
    "pickupContactName": "John Doe",
    "pickupContactNumber": "+91-9876543210",
    "dropContactName": "Jane Smith",
    "dropContactNumber": "+91-9876543211",
    "addOns": ["express_delivery", "insurance", "fragile_handling"],
    "pickupDate": "2024-01-15",
    "pickupTime": "09:00",
    "dropDate": "2024-01-16",
    "dropTime": "18:00",
    "truckOption": "refrigerated"
  }'
```

### Shipment with Different Vehicle Type

```bash
curl -X POST "$BASE_URL/shipments" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleType": "tempo",
    "pickupAddress": "Ahmedabad, Gujarat, India",
    "dropAddress": "Surat, Gujarat, India",
    "commodity": "Textiles",
    "weight": "3000",
    "specialInstructions": "Keep dry",
    "pickupContactName": "Rajesh Kumar",
    "pickupContactNumber": "+91-9876543212",
    "dropContactName": "Priya Sharma",
    "dropContactNumber": "+91-9876543213",
    "addOns": ["temperature_controlled"],
    "pickupDate": "2024-01-20",
    "pickupTime": "08:00"
  }'
```

## 3. Get All Shipments

### Basic List Request

```bash
curl -X GET "$BASE_URL/shipments"
```

### With Pagination

```bash
curl -X GET "$BASE_URL/shipments?page=1&limit=20"
```

### Get Second Page

```bash
curl -X GET "$BASE_URL/shipments?page=2&limit=10"
```

## 4. Get Shipment by ID

Replace `{shipment_id}` with the actual shipment ID from the create response:

```bash
curl -X GET "$BASE_URL/shipments/{shipment_id}"
```

### Example with Real ID

```bash
curl -X GET "$BASE_URL/shipments/123e4567-e89b-12d3-a456-426614174000"
```

## 5. Update Shipment

### Update Vehicle Type

```bash
curl -X PUT "$BASE_URL/shipments/{shipment_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleType": "mini_truck"
  }'
```

### Update Multiple Fields

```bash
curl -X PUT "$BASE_URL/shipments/{shipment_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleType": "truck",
    "specialInstructions": "Updated handling instructions",
    "addOns": ["express_delivery", "insurance", "fragile_handling"],
    "pickupTime": "10:00",
    "dropTime": "19:00"
  }'
```

### Update Add-ons Only

```bash
curl -X PUT "$BASE_URL/shipments/{shipment_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "addOns": ["express_delivery", "insurance"]
  }'
```

## 6. Delete Shipment

```bash
curl -X DELETE "$BASE_URL/shipments/{shipment_id}"
```

### Example with Real ID

```bash
curl -X DELETE "$BASE_URL/shipments/123e4567-e89b-12d3-a456-426614174000"
```

## 7. Get Distance and Duration

### Basic Distance Calculation

```bash
curl -X GET "$BASE_URL/shipments/distance-duration?pickupAddress=Mumbai&dropAddress=Delhi"
```

### With Full Addresses

```bash
curl -X GET "$BASE_URL/shipments/distance-duration?pickupAddress=Mumbai%2C%20Maharashtra%2C%20India&dropAddress=Delhi%2C%20India"
```

### URL Encoded Version

```bash
curl -X GET "$BASE_URL/shipments/distance-duration" \
  -G \
  -d "pickupAddress=Mumbai, Maharashtra, India" \
  -d "dropAddress=Delhi, India"
```

## Advanced Examples

### Batch Cost Calculations

Create a script to calculate costs for multiple routes:

```bash
#!/bin/bash

# Array of routes
routes=(
  '{"pickup": "Mumbai", "drop": "Delhi", "vehicle": "truck", "weight": 5000}'
  '{"pickup": "Bangalore", "drop": "Chennai", "vehicle": "mini_truck", "weight": 2000}'
  '{"pickup": "Pune", "drop": "Hyderabad", "vehicle": "tempo", "weight": 3000}'
)

for route in "${routes[@]}"; do
  pickup=$(echo $route | jq -r '.pickup')
  drop=$(echo $route | jq -r '.drop')
  vehicle=$(echo $route | jq -r '.vehicle')
  weight=$(echo $route | jq -r '.weight')

  echo "Calculating cost for $pickup to $drop..."

  curl -X POST "$BASE_URL/shipments/calculate-cost" \
    -H "Content-Type: application/json" \
    -d "{
      \"pickupAddress\": \"$pickup, India\",
      \"dropAddress\": \"$drop, India\",
      \"vehicleType\": \"$vehicle\",
      \"weight\": $weight
    }" | jq '.data.totalCost'

  echo "---"
done
```

### Error Handling Examples

### Invalid Vehicle Type

```bash
curl -X POST "$BASE_URL/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "invalid_vehicle",
    "weight": 5000
  }'
```

### Missing Required Fields

```bash
curl -X POST "$BASE_URL/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "weight": 5000
  }'
```

### Invalid Weight

```bash
curl -X POST "$BASE_URL/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": -1000
  }'
```

## Testing Scripts

### Complete API Test Script

```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "🚚 MagicTruck API Test Script"
echo "=============================="

# Test 1: Calculate cost
echo "1. Testing cost calculation..."
COST_RESPONSE=$(curl -s -X POST "$BASE_URL/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000,
    "addOns": ["express_delivery", "insurance"]
  }')

echo "Cost calculation response:"
echo $COST_RESPONSE | jq '.'

# Test 2: Create shipment
echo -e "\n2. Testing shipment creation..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/shipments" \
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
  }')

SHIPMENT_ID=$(echo $CREATE_RESPONSE | jq -r '.data.shipment.id')
echo "Created shipment ID: $SHIPMENT_ID"

# Test 3: Get shipment
echo -e "\n3. Testing get shipment..."
curl -s -X GET "$BASE_URL/shipments/$SHIPMENT_ID" | jq '.'

# Test 4: Update shipment
echo -e "\n4. Testing update shipment..."
curl -s -X PUT "$BASE_URL/shipments/$SHIPMENT_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "specialInstructions": "Updated instructions"
  }' | jq '.'

# Test 5: Get all shipments
echo -e "\n5. Testing get all shipments..."
curl -s -X GET "$BASE_URL/shipments?page=1&limit=5" | jq '.'

# Test 6: Distance calculation
echo -e "\n6. Testing distance calculation..."
curl -s -X GET "$BASE_URL/shipments/distance-duration?pickupAddress=Mumbai&dropAddress=Delhi" | jq '.'

# Test 7: Delete shipment
echo -e "\n7. Testing delete shipment..."
curl -s -X DELETE "$BASE_URL/shipments/$SHIPMENT_ID" | jq '.'

echo -e "\n✅ All tests completed!"
```

### Save this as `test-api.sh` and run:

```bash
chmod +x test-api.sh
./test-api.sh
```

## Environment-Specific Examples

### Development Environment

```bash
BASE_URL="http://localhost:3000/api"
```

### Staging Environment

```bash
BASE_URL="https://staging-api.magictruck.com/api"
```

### Production Environment

```bash
BASE_URL="https://api.magictruck.com/api"
```

## Troubleshooting

### Check if server is running

```bash
curl -I "$BASE_URL/shipments"
```

### Test with verbose output

```bash
curl -v -X POST "$BASE_URL/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000
  }'
```

### Check response headers

```bash
curl -I -X POST "$BASE_URL/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000
  }'
```
