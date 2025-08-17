# Error Handling

This document describes the error handling mechanisms and common error scenarios in the MagicTruck API.

## Error Response Format

All error responses follow a consistent format:

```json
{
  "status": "error",
  "message": "Error description",
  "data": null
}
```

## HTTP Status Codes

| Status Code | Description           | Usage                                  |
| ----------- | --------------------- | -------------------------------------- |
| 200         | OK                    | Successful GET, PUT, DELETE operations |
| 201         | Created               | Successful POST operations             |
| 400         | Bad Request           | Validation errors, invalid input       |
| 401         | Unauthorized          | Authentication required                |
| 403         | Forbidden             | Insufficient permissions               |
| 404         | Not Found             | Resource not found                     |
| 422         | Unprocessable Entity  | Business logic validation errors       |
| 500         | Internal Server Error | Server-side errors                     |
| 503         | Service Unavailable   | External service unavailable           |

## Common Error Scenarios

### 1. Validation Errors (400)

#### Missing Required Fields

```json
{
  "status": "error",
  "message": "Validation error: Vehicle type is required"
}
```

**Common Required Fields:**

- `vehicleType`
- `pickupAddress`
- `dropAddress`
- `commodity`
- `weight`
- `pickupContactName`
- `pickupContactNumber`
- `dropContactName`
- `dropContactNumber`

#### Invalid Data Types

```json
{
  "status": "error",
  "message": "Validation error: Weight must be positive"
}
```

#### Invalid Vehicle Type

```json
{
  "status": "error",
  "message": "Validation error: Invalid vehicle type. Must be one of: truck, mini_truck, tempo, pickup, tractor_trailer"
}
```

**Valid Vehicle Types:**

- `truck`
- `mini_truck`
- `tempo`
- `pickup`
- `tractor_trailer`

#### Invalid Add-on Services

```json
{
  "status": "error",
  "message": "Validation error: Invalid add-on service: invalid_service"
}
```

**Valid Add-on Services:**

- `express_delivery`
- `fragile_handling`
- `temperature_controlled`
- `insurance`
- `weekend_delivery`
- `night_delivery`

### 2. Google Maps API Errors (500)

#### Missing API Key

```json
{
  "status": "error",
  "message": "GOOGLE_MAPS_API_KEY environment variable is required"
}
```

**Solution:**

1. Set the `GOOGLE_MAPS_API_KEY` environment variable
2. Ensure the API key is valid and not expired
3. Check if the key has the required permissions

#### Invalid Address

```json
{
  "status": "error",
  "message": "Failed to calculate distance and duration"
}
```

**Possible Causes:**

- Address not found by Google Maps
- Invalid address format
- Address in unsupported region

**Solution:**

1. Verify the address is correct and complete
2. Try using more specific addresses
3. Check if the address exists in Google Maps

#### API Quota Exceeded

```json
{
  "status": "error",
  "message": "Google Maps API quota exceeded"
}
```

**Solution:**

1. Check your Google Cloud Console for quota limits
2. Upgrade your Google Maps API plan
3. Implement caching to reduce API calls

#### Network Issues

```json
{
  "status": "error",
  "message": "Failed to connect to Google Maps API"
}
```

**Solution:**

1. Check your internet connection
2. Verify firewall settings
3. Check if Google Maps API is accessible from your server

### 3. Database Errors (500)

#### Connection Failed

```json
{
  "status": "error",
  "message": "Database connection failed"
}
```

**Solution:**

1. Verify PostgreSQL is running
2. Check database credentials
3. Ensure database exists
4. Check network connectivity

#### Record Not Found (404)

```json
{
  "status": "error",
  "message": "Shipment not found"
}
```

**Solution:**

1. Verify the shipment ID is correct
2. Check if the shipment was deleted
3. Ensure you have access to the shipment

#### Constraint Violation

```json
{
  "status": "error",
  "message": "Database constraint violation"
}
```

**Common Causes:**

- Duplicate unique values
- Foreign key constraint violations
- Check constraint violations

### 4. Authentication Errors (401/403)

#### Missing Authentication

```json
{
  "status": "error",
  "message": "Authentication required"
}
```

#### Invalid Token

```json
{
  "status": "error",
  "message": "Invalid or expired token"
}
```

#### Insufficient Permissions

```json
{
  "status": "error",
  "message": "Insufficient permissions to access this resource"
}
```

## Error Handling Best Practices

### 1. Client-Side Error Handling

#### JavaScript Example

```javascript
async function createShipment(shipmentData) {
  try {
    const response = await fetch("/api/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipmentData),
    });

    const result = await response.json();

    if (result.status === "error") {
      // Handle specific error types
      switch (response.status) {
        case 400:
          console.error("Validation error:", result.message);
          // Show validation errors to user
          break;
        case 404:
          console.error("Resource not found:", result.message);
          // Show not found message
          break;
        case 500:
          console.error("Server error:", result.message);
          // Show generic error message
          break;
        default:
          console.error("Unknown error:", result.message);
      }
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Network error:", error);
    // Handle network errors
    return null;
  }
}
```

#### React Example

```jsx
import { useState } from "react";

function ShipmentForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "error") {
        setError(result.message);
        return;
      }

      // Handle success
      console.log("Shipment created:", result.data);
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      {/* Form content */}
    </div>
  );
}
```

### 2. Server-Side Error Handling

#### Express Middleware

```typescript
// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", error);

  // Handle specific error types
  if (error.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: `Validation error: ${error.message}`,
    });
  }

  if (error.name === "PrismaClientKnownRequestError") {
    return res.status(500).json({
      status: "error",
      message: "Database operation failed",
    });
  }

  // Default error response
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});
```

#### Google Maps Error Handling

```typescript
try {
  const result = await googleMapsService.calculateDistanceAndDuration(
    pickupLocation,
    dropLocation
  );
  return result;
} catch (error) {
  if (error.message.includes("API key")) {
    throw new Error("Google Maps API key is invalid or missing");
  }

  if (error.message.includes("quota")) {
    throw new Error("Google Maps API quota exceeded");
  }

  if (error.message.includes("address")) {
    throw new Error("Invalid address provided");
  }

  throw new Error("Failed to calculate distance and duration");
}
```

## Debugging Tips

### 1. Enable Debug Logging

Set environment variables for detailed logging:

```env
NODE_ENV=development
DEBUG=magictruck:*
LOG_LEVEL=debug
```

### 2. Check Application Logs

```bash
# Development
npm run dev

# Production
pm2 logs

# Direct log files
tail -f logs/error.log
tail -f logs/combined.log
```

### 3. Test API Endpoints

Use the provided test script:

```bash
node docs/test-shipment-api.js
```

### 4. Validate Request Data

Use tools like Postman or curl to test API endpoints:

```bash
curl -v -X POST http://localhost:3000/api/shipments/calculate-cost \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000
  }'
```

## Monitoring and Alerting

### 1. Error Rate Monitoring

Monitor error rates and set up alerts:

```typescript
// Error rate monitoring
const errorCounts = new Map();

app.use((req, res, next) => {
  const originalSend = res.send;

  res.send = function (data) {
    const response = JSON.parse(data);

    if (response.status === "error") {
      const errorType = res.statusCode;
      errorCounts.set(errorType, (errorCounts.get(errorType) || 0) + 1);

      // Alert if error rate is high
      if (errorCounts.get(errorType) > 100) {
        // Send alert
        console.error(`High error rate for status ${errorType}`);
      }
    }

    originalSend.call(this, data);
  };

  next();
});
```

### 2. Health Check Endpoint

```typescript
app.get("/health", async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Google Maps API
    await googleMapsService.calculateDistanceAndDuration(
      { address: "Mumbai, India" },
      { address: "Delhi, India" }
    );

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});
```

## Common Troubleshooting

### 1. Google Maps API Issues

**Problem:** "Failed to calculate distance and duration"

**Debugging Steps:**

1. Check if API key is set: `echo $GOOGLE_MAPS_API_KEY`
2. Verify API key is valid in Google Cloud Console
3. Check if required APIs are enabled
4. Test API key manually with curl
5. Check API quota usage

### 2. Database Connection Issues

**Problem:** "Database connection failed"

**Debugging Steps:**

1. Check if PostgreSQL is running: `sudo systemctl status postgresql`
2. Test connection: `psql -h localhost -U username -d magictruck`
3. Verify database URL in `.env`
4. Check firewall settings
5. Verify database exists

### 3. Validation Errors

**Problem:** "Validation error: Field is required"

**Debugging Steps:**

1. Check request body structure
2. Verify all required fields are present
3. Check data types match expected format
4. Validate enum values (vehicle types, add-ons)
5. Check field length limits

## Support and Resources

For additional help:

1. **Check the logs** for detailed error information
2. **Review the API documentation** for correct request formats
3. **Test with the provided examples** in the cURL documentation
4. **Contact support** with error details and request examples

**Error Reporting Template:**

```
Error: [Error message]
Status Code: [HTTP status code]
Request: [Request details]
Response: [Full error response]
Environment: [Development/Production]
Steps to Reproduce: [Detailed steps]
```
