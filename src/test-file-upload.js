const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const axios = require('axios')

// Configuration
const BASE_URL = 'http://localhost:3000'
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE' // Replace with actual token

// Test file paths (create these test files or modify paths)
const TEST_FILES = {
  image: './test-files/test-image.jpg',
  pdf: './test-files/test-document.pdf',
  text: './test-files/test-file.txt'
}

// Create test files if they don't exist
function createTestFiles () {
  const testDir = './test-files'
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir)
  }

  // Create a simple test image (1x1 pixel JPEG)
  if (!fs.existsSync(TEST_FILES.image)) {
    const imageBuffer = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
      0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
      0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
      0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
      0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xff, 0xc4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xda, 0x00, 0x0c,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3f, 0x00, 0x8a, 0x00,
      0xff, 0xd9
    ])
    fs.writeFileSync(TEST_FILES.image, imageBuffer)
    console.log('Created test image file')
  }

  // Create a simple test PDF
  if (!fs.existsSync(TEST_FILES.pdf)) {
    const pdfContent =
      '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF'
    fs.writeFileSync(TEST_FILES.pdf, pdfContent)
    console.log('Created test PDF file')
  }

  // Create a simple text file
  if (!fs.existsSync(TEST_FILES.text)) {
    fs.writeFileSync(
      TEST_FILES.text,
      'This is a test file for upload testing.\nCreated at: ' +
        new Date().toISOString()
    )
    console.log('Created test text file')
  }
}

// Test single file upload
async function testSingleFileUpload () {
  console.log('\n=== Testing Single File Upload ===')

  try {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(TEST_FILES.image))
    formData.append('folder', 'test-images')

    const response = await axios.post(
      `${BASE_URL}/api/upload/single`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
          ...formData.getHeaders()
        }
      }
    )

    console.log('✅ Single file upload successful')
    console.log('Response:', JSON.stringify(response.data, null, 2))
    return response.data.data.key
  } catch (error) {
    console.error('❌ Single file upload failed')
    console.error('Error:', error.response?.data || error.message)
    return null
  }
}

// Test multiple file upload
async function testMultipleFileUpload () {
  console.log('\n=== Testing Multiple File Upload ===')

  try {
    const formData = new FormData()
    formData.append('files', fs.createReadStream(TEST_FILES.image))
    formData.append('files', fs.createReadStream(TEST_FILES.pdf))
    formData.append('files', fs.createReadStream(TEST_FILES.text))
    formData.append('folder', 'test-multiple')

    const response = await axios.post(
      `${BASE_URL}/api/upload/multiple`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
          ...formData.getHeaders()
        }
      }
    )

    console.log('✅ Multiple file upload successful')
    console.log('Response:', JSON.stringify(response.data, null, 2))
    return response.data.data.results.map(r => r.key).filter(Boolean)
  } catch (error) {
    console.error('❌ Multiple file upload failed')
    console.error('Error:', error.response?.data || error.message)
    return []
  }
}

// Test presigned URL generation
async function testPresignedUrl () {
  console.log('\n=== Testing Presigned URL Generation ===')

  try {
    const response = await axios.post(
      `${BASE_URL}/api/upload/presigned-url`,
      {
        fileName: 'test-presigned.pdf',
        contentType: 'application/pdf',
        folder: 'test-presigned'
      },
      {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('✅ Presigned URL generation successful')
    console.log('Response:', JSON.stringify(response.data, null, 2))
    return response.data.data.key
  } catch (error) {
    console.error('❌ Presigned URL generation failed')
    console.error('Error:', error.response?.data || error.message)
    return null
  }
}

// Test get file info
async function testGetFileInfo (key) {
  if (!key) return

  console.log('\n=== Testing Get File Info ===')

  try {
    const response = await axios.get(
      `${BASE_URL}/api/upload/file/${encodeURIComponent(key)}`,
      {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`
        }
      }
    )

    console.log('✅ Get file info successful')
    console.log('Response:', JSON.stringify(response.data, null, 2))
  } catch (error) {
    console.error('❌ Get file info failed')
    console.error('Error:', error.response?.data || error.message)
  }
}

// Test delete file
async function testDeleteFile (key) {
  if (!key) return

  console.log('\n=== Testing Delete File ===')

  try {
    const response = await axios.delete(
      `${BASE_URL}/api/upload/file/${encodeURIComponent(key)}`,
      {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`
        }
      }
    )

    console.log('✅ Delete file successful')
    console.log('Response:', JSON.stringify(response.data, null, 2))
  } catch (error) {
    console.error('❌ Delete file failed')
    console.error('Error:', error.response?.data || error.message)
  }
}

// Main test function
async function runTests () {
  console.log('🚀 Starting File Upload API Tests')
  console.log('Make sure your server is running on', BASE_URL)
  console.log('Update JWT_TOKEN with a valid token before running tests')

  if (JWT_TOKEN === 'YOUR_JWT_TOKEN_HERE') {
    console.error('❌ Please update JWT_TOKEN with a valid token')
    return
  }

  // Create test files
  createTestFiles()

  // Run tests
  const singleFileKey = await testSingleFileUpload()
  const multipleFileKeys = await testMultipleFileUpload()
  const presignedKey = await testPresignedUrl()

  // Test file info and delete
  if (singleFileKey) {
    await testGetFileInfo(singleFileKey)
    await testDeleteFile(singleFileKey)
  }

  console.log('\n🎉 All tests completed!')
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = {
  testSingleFileUpload,
  testMultipleFileUpload,
  testPresignedUrl,
  testGetFileInfo,
  testDeleteFile
}
