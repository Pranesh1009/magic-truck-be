const { GoogleMapsService } = require('./services/googleMaps.service')
require('dotenv').config()

async function testGoogleMapsIntegration () {
  console.log('🧪 Testing Google Maps Integration...\n')

  try {
    // Initialize the service
    const googleMapsService = new GoogleMapsService()
    console.log('✅ Google Maps Service initialized successfully')

    // Test API key validation
    console.log('\n🔑 Testing API key validation...')
    const isValid = await googleMapsService.validateApiKey()
    if (isValid) {
      console.log('✅ API key is valid')
    } else {
      console.log('❌ API key validation failed')
      return
    }

    // Test geocoding
    console.log('\n📍 Testing geocoding...')
    const geocoded = await googleMapsService.geocodeAddress(
      'Mumbai, Maharashtra, India'
    )
    console.log('✅ Geocoding successful:', {
      lat: geocoded.lat,
      lng: geocoded.lng,
      formattedAddress: geocoded.formattedAddress
    })

    // Test reverse geocoding
    console.log('\n🔄 Testing reverse geocoding...')
    const reverseGeocoded = await googleMapsService.reverseGeocode(
      19.076,
      72.8777
    )
    console.log('✅ Reverse geocoding successful:', {
      formattedAddress: reverseGeocoded.formattedAddress
    })

    // Test distance calculation
    console.log('\n📏 Testing distance calculation...')
    const distanceDuration =
      await googleMapsService.calculateDistanceAndDuration(
        { address: 'Mumbai, Maharashtra, India' },
        { address: 'Delhi, India' }
      )
    console.log('✅ Distance calculation successful:', {
      distance: distanceDuration.distance.text,
      duration: distanceDuration.duration.text
    })

    // Test directions
    console.log('\n🗺️ Testing directions...')
    const directions = await googleMapsService.getDirections(
      { address: 'Mumbai, Maharashtra, India' },
      { address: 'Delhi, India' }
    )
    console.log('✅ Directions successful:', {
      distance: directions.distance.text,
      duration: directions.duration.text,
      waypoints: directions.waypoints.length
    })

    // Test shipment cost calculation
    console.log('\n💰 Testing shipment cost calculation...')
    const costRequest = {
      pickupLocation: { address: 'Mumbai, Maharashtra, India' },
      dropLocation: { address: 'Delhi, India' },
      vehicleType: 'truck',
      weight: 1000, // 1 ton
      addOns: ['express_delivery', 'fragile_handling']
    }
    const costResult = await googleMapsService.calculateShipmentCost(
      costRequest
    )
    console.log('✅ Cost calculation successful:', {
      distance: costResult.distance.text,
      duration: costResult.duration.text,
      totalCost: `₹${costResult.totalCost}`,
      breakdown: costResult.breakdown
    })

    // Test elevation
    console.log('\n⛰️ Testing elevation...')
    const elevation = await googleMapsService.getElevation(19.076, 72.8777)
    console.log('✅ Elevation successful:', `${elevation} meters`)

    // Test timezone
    console.log('\n🕐 Testing timezone...')
    const timezone = await googleMapsService.getTimezone(19.076, 72.8777)
    console.log('✅ Timezone successful:', {
      timeZoneId: timezone.timeZoneId,
      timeZoneName: timezone.timeZoneName
    })

    console.log('\n🎉 All Google Maps tests passed successfully!')
    console.log('\n📋 Summary:')
    console.log('- ✅ API Key validation')
    console.log('- ✅ Geocoding')
    console.log('- ✅ Reverse geocoding')
    console.log('- ✅ Distance calculation')
    console.log('- ✅ Directions')
    console.log('- ✅ Shipment cost calculation')
    console.log('- ✅ Elevation')
    console.log('- ✅ Timezone')
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error('\n🔧 Troubleshooting tips:')
    console.error('1. Check if GOOGLE_MAPS_API_KEY is set in your .env file')
    console.error(
      '2. Verify your API key is valid and has the required permissions'
    )
    console.error('3. Ensure the required Google Maps APIs are enabled')
    console.error('4. Check your internet connection')
    console.error('\n📖 For more help, see: docs/google-maps-setup.md')
  }
}

// Run the test
testGoogleMapsIntegration()
