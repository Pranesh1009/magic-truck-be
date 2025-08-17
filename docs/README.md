# MagicTruck API Documentation

## Overview

MagicTruck is a comprehensive logistics and transportation management system that provides real-time shipment cost calculation using Google Maps API, along with complete shipment lifecycle management.

## 🚚 Features

- **Real-time Cost Calculation**: Accurate shipment pricing using Google Maps Distance Matrix API
- **Advanced Location Services**: Geocoding, reverse geocoding, directions, and elevation data
- **Vehicle Type Management**: Support for multiple vehicle types with different pricing models
- **Add-on Services**: Flexible add-on services with dynamic pricing
- **Shipment Lifecycle**: Complete CRUD operations for shipment management
- **Address Geocoding**: Automatic address validation and coordinate extraction
- **Route Optimization**: Detailed directions with waypoints and polyline data
- **Timezone Support**: Automatic timezone detection for global operations
- **Comprehensive API**: RESTful API with proper validation and error handling

## 📚 Documentation Structure

### Core Documentation

- [API Reference](./api-reference.md) - Complete API endpoint documentation
- [Setup Guide](./setup-guide.md) - Installation and configuration instructions
- [Google Maps Setup](./google-maps-setup.md) - Google Maps integration guide
- [Cost Calculation](./cost-calculation.md) - Detailed pricing structure and formulas
- [Error Handling](./error-handling.md) - Error codes and troubleshooting

### Developer Resources

- [Database Schema](./database-schema.md) - Prisma schema and data models
- [Testing Guide](./testing-guide.md) - API testing and validation
- [Deployment Guide](./deployment-guide.md) - Production deployment instructions

### Examples & Tutorials

- [Quick Start](./quick-start.md) - Get started in 5 minutes
- [cURL Examples](./curl-examples.md) - Complete cURL command reference
- [Postman Collection](./postman-collection.md) - Import ready Postman collection

## 🚀 Quick Start

1. **Setup Environment**

   ```bash
   npm install
   npm run setup  # Interactive setup wizard
   # Or manually: cp .env.example .env
   # Add your Google Maps API key to .env
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Test API**
   ```bash
   npm run test:maps  # Test Google Maps integration
   node test-shipment-api.js  # Test API endpoints
   ```

## 🔧 Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Maps API key
- npm or yarn package manager

## 📋 API Endpoints Summary

| Method | Endpoint                           | Description             |
| ------ | ---------------------------------- | ----------------------- |
| POST   | `/api/shipments/calculate-cost`    | Calculate shipment cost |
| POST   | `/api/shipments`                   | Create new shipment     |
| GET    | `/api/shipments`                   | Get all shipments       |
| GET    | `/api/shipments/:id`               | Get shipment by ID      |
| PUT    | `/api/shipments/:id`               | Update shipment         |
| DELETE | `/api/shipments/:id`               | Delete shipment         |
| GET    | `/api/shipments/distance-duration` | Get distance & duration |

## 💰 Pricing Structure

### Vehicle Types

- **Truck**: ₹15/km + ₹1,000 base
- **Mini Truck**: ₹12/km + ₹800 base
- **Tempo**: ₹10/km + ₹600 base
- **Pickup**: ₹8/km + ₹400 base
- **Tractor Trailer**: ₹20/km + ₹1,500 base

### Add-on Services

- **Express Delivery**: ₹500
- **Fragile Handling**: ₹300
- **Temperature Controlled**: ₹2/km
- **Insurance**: ₹200
- **Weekend Delivery**: ₹400
- **Night Delivery**: ₹600

## 🔒 Security

- API key validation
- Input sanitization
- Rate limiting support
- Error logging
- CORS configuration

## 📊 Monitoring

- API response times
- Google Maps API usage
- Error rates
- Database performance
- Cost calculation accuracy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Check the [Error Handling](./error-handling.md) guide
- Review the [Troubleshooting](./troubleshooting.md) section
- Open an issue on GitHub

---

**Last Updated**: August 2024  
**Version**: 1.0.0  
**API Version**: v1
