#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('🚀 MagicTruck Environment Setup\n')

const envPath = path.join(process.cwd(), '.env')
const envExamplePath = path.join(process.cwd(), '.env.example')

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!')
  rl.question('Do you want to overwrite it? (y/N): ', answer => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      createEnvFile()
    } else {
      console.log('Setup cancelled.')
      rl.close()
    }
  })
} else {
  createEnvFile()
}

function createEnvFile () {
  const envVars = {}

  console.log('\n📝 Please provide the following configuration values:\n')

  // Database Configuration
  rl.question(
    'Database URL (postgresql://username:password@localhost:5432/magictruck_db): ',
    answer => {
      envVars.DATABASE_URL =
        answer || 'postgresql://username:password@localhost:5432/magictruck_db'

      // JWT Configuration
      rl.question('JWT Secret (random string for token signing): ', answer => {
        envVars.JWT_SECRET = answer || 'your-super-secret-jwt-key-here'
        envVars.JWT_EXPIRES_IN = '24h'

        // Google Maps Configuration
        rl.question(
          'Google Maps API Key (required for location services): ',
          answer => {
            envVars.GOOGLE_MAPS_API_KEY = answer || ''

            if (!envVars.GOOGLE_MAPS_API_KEY) {
              console.log(
                '\n⚠️  Warning: Google Maps API Key is required for location services!'
              )
              console.log('   You can add it later by editing the .env file')
              console.log(
                '   Get your API key from: https://console.cloud.google.com/'
              )
            }

            // Email Configuration
            rl.question(
              'SendGrid API Key (optional, for email notifications): ',
              answer => {
                envVars.SENDGRID_API_KEY = answer || ''
                envVars.FROM_EMAIL = 'noreply@magictruck.com'

                // Server Configuration
                rl.question('Server Port (default: 3000): ', answer => {
                  envVars.PORT = answer || '3000'
                  envVars.NODE_ENV = 'development'

                  // Logging Configuration
                  envVars.LOG_LEVEL = 'info'
                  envVars.LOG_FILE_PATH = './logs'

                  // CORS Configuration
                  envVars.CORS_ORIGIN = 'http://localhost:3000'

                  // Rate Limiting
                  envVars.RATE_LIMIT_WINDOW_MS = '900000'
                  envVars.RATE_LIMIT_MAX_REQUESTS = '100'

                  // Write .env file
                  writeEnvFile(envVars)
                })
              }
            )
          }
        )
      })
    }
  )
}

function writeEnvFile (envVars) {
  let envContent = '# MagicTruck Environment Configuration\n\n'

  // Add comments and values
  envContent += '# Database Configuration\n'
  envContent += `DATABASE_URL="${envVars.DATABASE_URL}"\n\n`

  envContent += '# JWT Configuration\n'
  envContent += `JWT_SECRET="${envVars.JWT_SECRET}"\n`
  envContent += `JWT_EXPIRES_IN="${envVars.JWT_EXPIRES_IN}"\n\n`

  envContent += '# Google Maps API Configuration\n'
  envContent += `GOOGLE_MAPS_API_KEY="${envVars.GOOGLE_MAPS_API_KEY}"\n\n`

  envContent += '# Email Configuration (SendGrid)\n'
  envContent += `SENDGRID_API_KEY="${envVars.SENDGRID_API_KEY}"\n`
  envContent += `FROM_EMAIL="${envVars.FROM_EMAIL}"\n\n`

  envContent += '# Server Configuration\n'
  envContent += `PORT=${envVars.PORT}\n`
  envContent += `NODE_ENV="${envVars.NODE_ENV}"\n\n`

  envContent += '# Logging Configuration\n'
  envContent += `LOG_LEVEL="${envVars.LOG_LEVEL}"\n`
  envContent += `LOG_FILE_PATH="${envVars.LOG_FILE_PATH}"\n\n`

  envContent += '# CORS Configuration\n'
  envContent += `CORS_ORIGIN="${envVars.CORS_ORIGIN}"\n\n`

  envContent += '# Rate Limiting\n'
  envContent += `RATE_LIMIT_WINDOW_MS=${envVars.RATE_LIMIT_WINDOW_MS}\n`
  envContent += `RATE_LIMIT_MAX_REQUESTS=${envVars.RATE_LIMIT_MAX_REQUESTS}\n`

  try {
    fs.writeFileSync(envPath, envContent)
    console.log('\n✅ .env file created successfully!')

    if (!envVars.GOOGLE_MAPS_API_KEY) {
      console.log('\n📋 Next Steps:')
      console.log(
        '1. Get your Google Maps API key from: https://console.cloud.google.com/'
      )
      console.log(
        '2. Add it to the .env file: GOOGLE_MAPS_API_KEY="your_key_here"'
      )
      console.log('3. Enable the required Google Maps APIs:')
      console.log('   - Geocoding API')
      console.log('   - Directions API')
      console.log('   - Distance Matrix API')
      console.log('   - Elevation API')
      console.log('   - Time Zone API')
      console.log('4. Test the integration: npm run test:maps')
    } else {
      console.log('\n🎉 Setup complete! You can now:')
      console.log('1. Start the development server: npm run dev')
      console.log('2. Test Google Maps integration: npm run test:maps')
      console.log('3. Run the API tests: npm test')
    }

    console.log('\n📖 For more information, see: docs/google-maps-setup.md')
  } catch (error) {
    console.error('\n❌ Error creating .env file:', error.message)
  }

  rl.close()
}
