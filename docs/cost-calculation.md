# Shipment Cost Calculation with Google Maps

## Overview

This feature provides real-time shipment cost calculation using Google Maps API for accurate distance calculation and comprehensive cost breakdown.

## Features

- ✅ Real-time distance calculation using Google Maps
- ✅ Duration estimation for shipments
- ✅ Vehicle type-based pricing
- ✅ Weight-based cost calculation
- ✅ Add-on services pricing
- ✅ Comprehensive cost breakdown
- ✅ Address geocoding support

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @googlemaps/google-maps-services-js
```

### 2. Environment Variables

Add the following to your `.env` file:

```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Distance Matrix API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

## API Endpoints

### Calculate Shipment Cost

```http
POST /api/shipments/calculate-cost
```

**Request:**

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

### Create Shipment with Cost

```http
POST /api/shipments
```

### Get Distance & Duration

```http
GET /api/shipments/distance-duration?pickupAddress=Mumbai&dropAddress=Delhi
```

## Pricing Structure

### Vehicle Types

| Type            | Rate/km | Base Cost |
| --------------- | ------- | --------- |
| truck           | ₹15     | ₹1,000    |
| mini_truck      | ₹12     | ₹800      |
| tempo           | ₹10     | ₹600      |
| pickup          | ₹8      | ₹400      |
| tractor_trailer | ₹20     | ₹1,500    |

### Add-on Services

| Service                | Cost  |
| ---------------------- | ----- |
| express_delivery       | ₹500  |
| fragile_handling       | ₹300  |
| temperature_controlled | ₹2/km |
| insurance              | ₹200  |
| weekend_delivery       | ₹400  |
| night_delivery         | ₹600  |

## Cost Calculation Formula

```
Total Cost = Distance Cost + Weight Cost + Vehicle Type Cost + Add-on Costs

Where:
- Distance Cost = Distance (km) × Vehicle Rate per km
- Weight Cost = Weight (tons) × ₹500 per ton
- Vehicle Type Cost = Base cost for vehicle type
- Add-on Costs = Sum of all selected add-on costs
```

## Error Handling

The system handles various error scenarios:

- Invalid addresses
- Google Maps API errors
- Missing required fields
- Database connection issues

## Testing

### Using cURL

```bash
# Calculate cost
curl -X POST http://localhost:3000/api/shipments/calculate-cost \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "Mumbai, Maharashtra, India",
    "dropAddress": "Delhi, India",
    "vehicleType": "truck",
    "weight": 5000,
    "addOns": ["express_delivery"]
  }'
```

### Using Postman

1. Import the provided collection
2. Set up environment variables
3. Test each endpoint with sample data

## Security Considerations

1. **API Key Security**: Restrict your Google Maps API key to your domain
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Input Validation**: All inputs are validated using Zod schemas
4. **Error Logging**: Errors are logged for monitoring

## Performance Optimization

1. **Caching**: Consider caching frequently requested routes
2. **Batch Processing**: For multiple calculations, use batch endpoints
3. **Connection Pooling**: Database connections are pooled for efficiency

## Monitoring

Monitor the following metrics:

- API response times
- Google Maps API usage
- Error rates
- Cost calculation accuracy

## Troubleshooting

### Common Issues

1. **"GOOGLE_MAPS_API_KEY environment variable is required"**

   - Ensure the API key is set in your environment variables

2. **"Unable to calculate distance and duration"**

   - Check if the addresses are valid
   - Verify Google Maps API is enabled

3. **"Address not found"**
   - Ensure addresses are properly formatted
   - Try using more specific addresses

### Debug Mode

Enable debug logging by setting:

```
NODE_ENV=development
```

## Future Enhancements

- [ ] Multi-stop route optimization
- [ ] Real-time traffic consideration
- [ ] Fuel cost calculation
- [ ] Carbon footprint estimation
- [ ] Route visualization
- [ ] Mobile app integration
