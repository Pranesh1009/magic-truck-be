# Testing Guide

This guide covers testing strategies and examples for the MagicTruck API.

## Testing Overview

The MagicTruck API includes comprehensive testing capabilities to ensure reliability and accuracy of shipment cost calculations.

## Test Categories

### 1. Unit Tests

- Individual function testing
- Service layer testing
- Utility function testing

### 2. Integration Tests

- API endpoint testing
- Database integration testing
- Google Maps API integration testing

### 3. End-to-End Tests

- Complete workflow testing
- Real-world scenario testing

## Quick Start Testing

### 1. Automated Test Script

Use the provided test script for quick API validation:

```bash
# Run the test script
node docs/test-shipment-api.js
```

### 2. Manual Testing with cURL

Test individual endpoints:

```bash
# Set base URL
BASE_URL="http://localhost:3000/api"

# Test cost calculation
curl -X POST "$BASE_URL/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000,
    "addOns": ["express_delivery", "insurance"]
  }'
```

## Test Scenarios

### 1. Cost Calculation Tests

#### Basic Cost Calculation

```bash
curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000
  }'
```

**Expected Response:**

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
    "addOnCosts": 0,
    "totalCost": 26105,
    "breakdown": {
      "distanceCost": 21105,
      "weightCost": 2500,
      "vehicleTypeCost": 1000,
      "addOnsCost": 0
    }
  }
}
```

#### Cost Calculation with Add-ons

```bash
curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Bangalore, Karnataka, India",
    "dropAddress": "Chennai, Tamil Nadu, India",
    "vehicleType": "mini_truck",
    "weight": 2000,
    "addOns": ["express_delivery", "fragile_handling", "insurance"]
  }'
```

#### Different Vehicle Types

Test all vehicle types:

```bash
# Test truck
curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000
  }'

# Test mini_truck
curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "mini_truck",
    "weight": 5000
  }'

# Test tempo
curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "tempo",
    "weight": 5000
  }'

# Test pickup
curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "pickup",
    "weight": 5000
  }'

# Test tractor_trailer
curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "tractor_trailer",
    "weight": 5000
  }'
```

### 2. Shipment CRUD Tests

#### Create Shipment

```bash
curl -X POST "http://localhost:3000/api/shipments" \
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

#### Get All Shipments

```bash
curl -X GET "http://localhost:3000/api/shipments"
```

#### Get Shipment by ID

```bash
# Replace {shipment_id} with actual ID from create response
curl -X GET "http://localhost:3000/api/shipments/{shipment_id}"
```

#### Update Shipment

```bash
# Replace {shipment_id} with actual ID
curl -X PUT "http://localhost:3000/api/shipments/{shipment_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "specialInstructions": "Updated handling instructions"
  }'
```

#### Delete Shipment

```bash
# Replace {shipment_id} with actual ID
curl -X DELETE "http://localhost:3000/api/shipments/{shipment_id}"
```

### 3. Distance and Duration Tests

#### Basic Distance Calculation

```bash
curl -X GET "http://localhost:3000/api/shipments/distance-duration?pickupAddress=Mumbai&dropAddress=Delhi"
```

#### Full Address Distance Calculation

```bash
curl -X GET "http://localhost:3000/api/shipments/distance-duration?pickupAddress=Mumbai%2C%20Maharashtra%2C%20India&dropAddress=Delhi%2C%20India"
```

## Error Testing

### 1. Validation Error Tests

#### Missing Required Fields

```bash
curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "weight": 5000
  }'
```

**Expected Response:**

```json
{
  "status": "error",
  "message": "Validation error: Drop address is required"
}
```

#### Invalid Vehicle Type

```bash
curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "invalid_vehicle",
    "weight": 5000
  }'
```

#### Invalid Weight

```bash
curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": -1000
  }'
```

### 2. Google Maps API Error Tests

#### Invalid Address

```bash
curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Invalid Address 12345",
    "dropAddress": "Another Invalid Address 67890",
    "vehicleType": "truck",
    "weight": 5000
  }'
```

### 3. Database Error Tests

#### Non-existent Shipment

```bash
curl -X GET "http://localhost:3000/api/shipments/non-existent-id"
```

**Expected Response:**

```json
{
  "status": "error",
  "message": "Shipment not found"
}
```

## Performance Testing

### 1. Load Testing

Use tools like Apache Bench (ab) or Artillery:

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test cost calculation endpoint
ab -n 100 -c 10 -T application/json -p test-data.json http://localhost:3000/api/shipments/calculate-cost
```

Create `test-data.json`:

```json
{
  "pickupAddress": "Mumbai, Maharashtra, India",
  "dropAddress": "Delhi, India",
  "vehicleType": "truck",
  "weight": 5000
}
```

### 2. Response Time Testing

```bash
# Test response time
time curl -X POST "http://localhost:3000/api/shipments/calculate-cost" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000
  }'
```

## Automated Testing

### 1. Jest Test Suite

Create test files for automated testing:

```javascript
// tests/shipment.test.js
const axios = require("axios");

const BASE_URL = "http://localhost:3000/api";

describe("Shipment API Tests", () => {
  test("should calculate shipment cost", async () => {
    const response = await axios.post(`${BASE_URL}/shipments/calculate-cost`, {
      pickupAddress: "Mumbai, Maharashtra, India",
      dropAddress: "Delhi, India",
      vehicleType: "truck",
      weight: 5000,
    });

    expect(response.status).toBe(200);
    expect(response.data.status).toBe("success");
    expect(response.data.data.totalCost).toBeGreaterThan(0);
  });

  test("should create shipment", async () => {
    const response = await axios.post(`${BASE_URL}/shipments`, {
      vehicleType: "truck",
      pickupAddress: "Mumbai, Maharashtra, India",
      dropAddress: "Delhi, India",
      commodity: "Electronics",
      weight: "5000",
      pickupContactName: "John Doe",
      pickupContactNumber: "+91-9876543210",
      dropContactName: "Jane Smith",
      dropContactNumber: "+91-9876543211",
    });

    expect(response.status).toBe(201);
    expect(response.data.status).toBe("success");
    expect(response.data.data.shipment.id).toBeDefined();
  });
});
```

### 2. Postman Collection

Import the provided Postman collection for comprehensive API testing:

1. Download the collection from `docs/postman-collection.json`
2. Import into Postman
3. Set up environment variables
4. Run the collection

### 3. Newman (Command Line Postman)

```bash
# Install Newman
npm install -g newman

# Run collection
newman run docs/postman-collection.json -e docs/postman-environment.json
```

## Test Data Management

### 1. Test Data Setup

Create test data for consistent testing:

```javascript
// test-data.js
const testShipments = [
  {
    vehicleType: "truck",
    pickupAddress: "Mumbai, Maharashtra, India",
    dropAddress: "Delhi, India",
    commodity: "Electronics",
    weight: "5000",
    pickupContactName: "John Doe",
    pickupContactNumber: "+91-9876543210",
    dropContactName: "Jane Smith",
    dropContactNumber: "+91-9876543211",
  },
  {
    vehicleType: "mini_truck",
    pickupAddress: "Bangalore, Karnataka, India",
    dropAddress: "Chennai, Tamil Nadu, India",
    commodity: "Textiles",
    weight: "2000",
    pickupContactName: "Rajesh Kumar",
    pickupContactNumber: "+91-9876543212",
    dropContactName: "Priya Sharma",
    dropContactNumber: "+91-9876543213",
  },
];

module.exports = { testShipments };
```

### 2. Database Seeding

Create seed data for testing:

```javascript
// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  // Create test shipments
  const shipment1 = await prisma.shipmentDetails.create({
    data: {
      vehicleType: "truck",
      pickupAddress: "Mumbai, Maharashtra, India",
      dropAddress: "Delhi, India",
      commodity: "Electronics",
      weight: "5000",
      pickupContactName: "John Doe",
      pickupContactNumber: "+91-9876543210",
      dropContactName: "Jane Smith",
      dropContactNumber: "+91-9876543211",
    },
  });

  console.log("Seed data created:", shipment1);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Continuous Integration Testing

### 1. GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Setup environment
        run: |
          echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test_db" >> .env
          echo "GOOGLE_MAPS_API_KEY=${{ secrets.GOOGLE_MAPS_API_KEY }}" >> .env

      - name: Run database migrations
        run: npx prisma migrate deploy

      - name: Run tests
        run: npm test
```

### 2. Test Scripts

Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testPathPattern=integration",
    "test:unit": "jest --testPathPattern=unit"
  }
}
```

## Testing Best Practices

### 1. Test Organization

- Separate unit, integration, and e2e tests
- Use descriptive test names
- Group related tests together
- Clean up test data after each test

### 2. Test Data

- Use realistic test data
- Avoid hardcoded values
- Create reusable test fixtures
- Clean up test data after tests

### 3. Error Testing

- Test all error scenarios
- Verify error messages are helpful
- Test edge cases and boundary conditions
- Ensure proper HTTP status codes

### 4. Performance Testing

- Test response times under load
- Monitor resource usage
- Test with realistic data volumes
- Set performance benchmarks

## Monitoring Test Results

### 1. Test Coverage

```bash
# Generate coverage report
npm run test:coverage
```

### 2. Test Reports

```bash
# Generate HTML test report
npm run test -- --reporter=html
```

### 3. Continuous Monitoring

- Set up test result notifications
- Monitor test failure rates
- Track performance regression
- Alert on critical test failures

## Troubleshooting Tests

### 1. Common Test Issues

#### Database Connection Issues

```bash
# Check database status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U username -d test_db
```

#### Google Maps API Issues

```bash
# Check API key
echo $GOOGLE_MAPS_API_KEY

# Test API manually
curl "https://maps.googleapis.com/maps/api/distancematrix/json?origins=Mumbai&destinations=Delhi&key=YOUR_API_KEY"
```

#### Port Conflicts

```bash
# Check port usage
lsof -i :3000

# Kill conflicting process
kill -9 <PID>
```

### 2. Debug Mode

Enable debug logging for tests:

```bash
DEBUG=magictruck:* npm test
```

### 3. Test Isolation

Ensure tests don't interfere with each other:

```javascript
beforeEach(async () => {
  // Clean up database
  await prisma.shipmentDetails.deleteMany();
});

afterEach(async () => {
  // Clean up after each test
  await prisma.shipmentDetails.deleteMany();
});
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Postman Testing](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [API Testing Best Practices](https://www.guru99.com/testing-rest-api-manually.html)
- [Performance Testing Guide](https://k6.io/docs/testing-guides/)
