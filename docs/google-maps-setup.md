# Google Maps Integration Setup Guide

This guide will help you set up Google Maps integration for the MagicTruck application using the latest Google Maps Platform APIs.

## Prerequisites

1. Google Cloud Platform account
2. Google Maps Platform enabled
3. API key with appropriate restrictions

## Step 1: Enable Google Maps Platform

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Maps Platform API
4. Navigate to "APIs & Services" > "Library"
5. Search for and enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Directions API
   - Distance Matrix API
   - Elevation API
   - Time Zone API

## Step 2: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

## Step 3: Configure API Key Restrictions

For security, configure your API key with restrictions:

### Application Restrictions

- **HTTP referrers (web sites)**: Add your domain(s)
- **IP addresses**: Add your server IP(s)
- **Android apps**: Add your app's package name and SHA-1
- **iOS apps**: Add your app's bundle identifier

### API Restrictions

- Select "Restrict key"
- Choose the APIs you enabled in Step 1

## Step 4: Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
# Google Maps API Configuration
GOOGLE_MAPS_API_KEY="your_actual_api_key_here"

# Other required environment variables
DATABASE_URL="postgresql://username:password@localhost:5432/magictruck_db"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV="development"
```

## Step 5: Install Dependencies

The Google Maps service requires the following package:

```bash
npm install @googlemaps/google-maps-services-js
```

## Step 6: Verify Installation

Test your Google Maps integration:

```bash
# Start the development server
npm run dev
```

## API Usage Examples

### 1. Calculate Shipment Cost

```typescript
import { GoogleMapsService } from "./src/services/googleMaps.service";

const googleMapsService = new GoogleMapsService();

const costRequest = {
  pickupLocation: { address: "Mumbai, Maharashtra, India" },
  dropLocation: { address: "Delhi, India" },
  vehicleType: "truck",
  weight: 1000, // in kg
  addOns: ["express_delivery", "fragile_handling"],
};

const result = await googleMapsService.calculateShipmentCost(costRequest);
console.log(result);
```

### 2. Geocode Address

```typescript
const geocoded = await googleMapsService.geocodeAddress(
  "Mumbai, Maharashtra, India"
);
console.log(geocoded);
// Output: { lat: 19.076, lng: 72.8777, formattedAddress: "...", placeId: "...", types: [...] }
```

### 3. Get Directions

```typescript
const directions = await googleMapsService.getDirections(
  { address: "Mumbai, Maharashtra, India" },
  { address: "Delhi, India" }
);
console.log(directions);
```

### 4. Calculate Distance and Duration

```typescript
const distanceDuration = await googleMapsService.calculateDistanceAndDuration(
  { address: "Mumbai, Maharashtra, India" },
  { address: "Delhi, India" }
);
console.log(distanceDuration);
```

## Error Handling

The service includes comprehensive error handling for common scenarios:

- **Invalid API Key**: Check your API key configuration
- **Address Not Found**: Verify the address format
- **Rate Limiting**: Implement retry logic with exponential backoff
- **Network Errors**: Handle temporary connectivity issues

## Best Practices

### 1. API Key Security

- Never commit API keys to version control
- Use environment variables
- Implement proper restrictions
- Monitor API usage

### 2. Rate Limiting

- Implement client-side rate limiting
- Use caching for repeated requests
- Monitor quota usage

### 3. Error Handling

- Always wrap API calls in try-catch blocks
- Provide meaningful error messages
- Implement fallback mechanisms

### 4. Caching

- Cache geocoding results
- Cache distance calculations
- Implement TTL-based cache invalidation

## Troubleshooting

### Common Issues

1. **"GOOGLE_MAPS_API_KEY environment variable is required"**

   - Check if the environment variable is set
   - Verify the variable name spelling

2. **"Geocoding failed: REQUEST_DENIED"**

   - Verify API key is correct
   - Check if APIs are enabled
   - Review API key restrictions

3. **"No results found for the provided address"**

   - Verify address format
   - Try more specific addresses
   - Check if the location exists

4. **Rate limiting errors**
   - Implement exponential backoff
   - Reduce request frequency
   - Check quota limits

### Debug Mode

Enable debug logging by setting the log level:

```typescript
// In your application startup
process.env.LOG_LEVEL = "debug";
```

## API Quotas and Pricing

- **Geocoding API**: 2,500 requests per day (free tier)
- **Directions API**: 2,500 requests per day (free tier)
- **Distance Matrix API**: 100 requests per day (free tier)
- **Elevation API**: 2,500 requests per day (free tier)
- **Time Zone API**: 2,500 requests per day (free tier)

Monitor your usage in the Google Cloud Console to avoid unexpected charges.

## Support

For additional support:

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation/javascript)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Maps Platform Support](https://developers.google.com/maps/support)
