const axios = require('axios')

const BASE_URL = 'http://localhost:3000/api'

// Test data
const testShipment = {
  pickupAddress: 'Mumbai, Maharashtra, India',
  dropAddress: 'Delhi, India',
  vehicleType: 'truck',
  weight: 5000,
  commodity: 'Electronics',
  addOns: ['express_delivery', 'insurance']
}

const testCreateShipment = {
  vehicleType: 'truck',
  pickupAddress: 'Mumbai, Maharashtra, India',
  dropAddress: 'Delhi, India',
  commodity: 'Electronics',
  weight: '5000',
  specialInstructions: 'Handle with care',
  pickupContactName: 'John Doe',
  pickupContactNumber: '+91-9876543210',
  dropContactName: 'Jane Smith',
  dropContactNumber: '+91-9876543211',
  addOns: ['express_delivery', 'insurance'],
  pickupDate: '2024-01-15',
  pickupTime: '09:00'
}

async function testShipmentAPI () {
  console.log('🚚 Testing Shipment Cost Calculation API\n')

  try {
    // Test 1: Calculate shipment cost
    console.log('1. Testing Cost Calculation...')
    const costResponse = await axios.post(
      `${BASE_URL}/shipments/calculate-cost`,
      testShipment
    )
    console.log('✅ Cost calculation successful')
    console.log(
      '📊 Cost breakdown:',
      JSON.stringify(costResponse.data.data, null, 2)
    )
    console.log('')

    // Test 2: Create shipment with cost
    console.log('2. Testing Shipment Creation...')
    const createResponse = await axios.post(
      `${BASE_URL}/shipments`,
      testCreateShipment
    )
    console.log('✅ Shipment created successfully')
    console.log('📦 Shipment ID:', createResponse.data.data.shipment.id)
    console.log(
      '💰 Total Cost:',
      createResponse.data.data.costCalculation.totalCost
    )
    console.log('')

    // Test 3: Get distance and duration
    console.log('3. Testing Distance & Duration...')
    const distanceResponse = await axios.get(
      `${BASE_URL}/shipments/distance-duration`,
      {
        params: {
          pickupAddress: 'Mumbai, Maharashtra, India',
          dropAddress: 'Delhi, India'
        }
      }
    )
    console.log('✅ Distance calculation successful')
    console.log('📏 Distance:', distanceResponse.data.data.distance.text)
    console.log('⏱️ Duration:', distanceResponse.data.data.duration.text)
    console.log('')

    // Test 4: Get all shipments
    console.log('4. Testing Get All Shipments...')
    const shipmentsResponse = await axios.get(`${BASE_URL}/shipments`)
    console.log('✅ Retrieved shipments successfully')
    console.log(
      '📋 Total shipments:',
      shipmentsResponse.data.metadata?.total || 0
    )
    console.log('')

    console.log('🎉 All tests completed successfully!')
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message)

    if (error.response?.status === 500) {
      console.log('\n💡 Make sure:')
      console.log('1. Server is running (npm run dev)')
      console.log('2. Google Maps API key is set in environment variables')
      console.log('3. Database is connected')
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testShipmentAPI()
}

module.exports = { testShipmentAPI }
