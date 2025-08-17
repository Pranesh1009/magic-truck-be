#!/bin/bash

# Business Dealer API - cURL Collection
# This script contains all cURL commands for testing the Business Dealer Onboarding API

# Configuration
BASE_URL="http://localhost:3000/api"
BUSINESS_TYPE_ID=""
BUSINESS_DEALER_ID=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to execute cURL command and show response
execute_curl() {
    local description="$1"
    local curl_command="$2"
    
    echo -e "\n${YELLOW}$description${NC}"
    echo -e "${YELLOW}Command:${NC} $curl_command"
    echo -e "${YELLOW}Response:${NC}"
    
    eval "$curl_command"
    echo ""
}

# 1. HEALTH CHECK
print_header "1. HEALTH CHECK"

execute_curl "Health Check" "curl -X GET \"${BASE_URL}/health\" -s | jq '.'"

# 2. BUSINESS TYPES
print_header "2. BUSINESS TYPES"

execute_curl "Create Business Type" "curl -X POST \"${BASE_URL}/business-types\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"name\": \"Transportation\",
    \"description\": \"Transportation and logistics business\"
  }' -s | jq '.'"

execute_curl "Get All Business Types" "curl -X GET \"${BASE_URL}/business-types?page=1&limit=10\" -s | jq '.'"

execute_curl "Get Business Type by ID" "curl -X GET \"${BASE_URL}/business-types/${BUSINESS_TYPE_ID}\" -s | jq '.'"

# 3. ROLES
print_header "3. ROLES"

execute_curl "Create Dealer Role" "curl -X POST \"${BASE_URL}/role\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"name\": \"dealer\",
    \"description\": \"Business dealer role with access to dealer-specific features\"
  }' -s | jq '.'"

execute_curl "Get All Roles" "curl -X GET \"${BASE_URL}/role\" -s | jq '.'"

# 4. BUSINESS DEALER ONBOARDING
print_header "4. BUSINESS DEALER ONBOARDING"

execute_curl "Create Business Dealer (Full Data)" "curl -X POST \"${BASE_URL}/business-dealers\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"name\": \"John Doe\",
    \"email\": \"john.doe@example.com\",
    \"phoneNumber\": \"+1234567890\",
    \"password\": \"securePassword123\",
    \"gst\": \"GST123456789\",
    \"gst_doc\": \"https://example.com/documents/gst_certificate.pdf\",
    \"other_doc\": [
      \"https://example.com/documents/business_license.pdf\",
      \"https://example.com/documents/tax_certificate.pdf\"
    ],
    \"identity_doc\": [
      \"https://example.com/documents/aadhar_card.pdf\",
      \"https://example.com/documents/pan_card.pdf\"
    ],
    \"businessTypeId\": \"${BUSINESS_TYPE_ID}\"
  }' -s | jq '.'"

execute_curl "Create Business Dealer (Minimal Data)" "curl -X POST \"${BASE_URL}/business-dealers\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"name\": \"Jane Smith\",
    \"email\": \"jane.smith@example.com\",
    \"phoneNumber\": \"+1987654321\",
    \"password\": \"password123\",
    \"gst\": \"GST987654321\",
    \"businessTypeId\": \"${BUSINESS_TYPE_ID}\"
  }' -s | jq '.'"

# 5. BUSINESS DEALER MANAGEMENT
print_header "5. BUSINESS DEALER MANAGEMENT"

execute_curl "Get All Business Dealers" "curl -X GET \"${BASE_URL}/business-dealers?page=1&limit=10\" -s | jq '.'"

execute_curl "Get Business Dealer by ID" "curl -X GET \"${BASE_URL}/business-dealers/${BUSINESS_DEALER_ID}\" -s | jq '.'"

execute_curl "Update Business Dealer (Full)" "curl -X PUT \"${BASE_URL}/business-dealers/${BUSINESS_DEALER_ID}\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"name\": \"John Doe Updated\",
    \"email\": \"john.updated@example.com\",
    \"phoneNumber\": \"+1234567890\",
    \"gst\": \"GST123456789\",
    \"gst_doc\": \"https://example.com/documents/updated_gst_certificate.pdf\",
    \"other_doc\": [
      \"https://example.com/documents/updated_business_license.pdf\",
      \"https://example.com/documents/updated_tax_certificate.pdf\"
    ],
    \"identity_doc\": [
      \"https://example.com/documents/updated_aadhar_card.pdf\",
      \"https://example.com/documents/updated_pan_card.pdf\"
    ],
    \"businessTypeId\": \"${BUSINESS_TYPE_ID}\"
  }' -s | jq '.'"

execute_curl "Update Business Dealer (Partial)" "curl -X PUT \"${BASE_URL}/business-dealers/${BUSINESS_DEALER_ID}\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"name\": \"John Doe Updated Name Only\",
    \"gst_doc\": \"https://example.com/documents/new_gst_certificate.pdf\"
  }' -s | jq '.'"

execute_curl "Delete Business Dealer" "curl -X DELETE \"${BASE_URL}/business-dealers/${BUSINESS_DEALER_ID}\" -s | jq '.'"

# 6. AUTHENTICATION
print_header "6. AUTHENTICATION"

execute_curl "Register User" "curl -X POST \"${BASE_URL}/auth/register\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"name\": \"Test User\",
    \"email\": \"test.user@example.com\",
    \"phoneNumber\": \"+1111111111\",
    \"password\": \"password123\",
    \"roleId\": \"dealer-role-id\"
  }' -s | jq '.'"

execute_curl "Login User" "curl -X POST \"${BASE_URL}/auth/login\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"email\": \"john.doe@example.com\",
    \"password\": \"securePassword123\"
  }' -s | jq '.'"

# 7. ERROR TESTING
print_header "7. ERROR TESTING"

execute_curl "Test Missing Required Fields" "curl -X POST \"${BASE_URL}/business-dealers\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"name\": \"John Doe\",
    \"email\": \"john.doe@example.com\"
  }' -s | jq '.'"

execute_curl "Test Duplicate Email" "curl -X POST \"${BASE_URL}/business-dealers\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"name\": \"John Doe\",
    \"email\": \"john.doe@example.com\",
    \"phoneNumber\": \"+1234567890\",
    \"password\": \"securePassword123\",
    \"gst\": \"GST123456789\",
    \"businessTypeId\": \"${BUSINESS_TYPE_ID}\"
  }' -s | jq '.'"

execute_curl "Test Invalid Business Type ID" "curl -X POST \"${BASE_URL}/business-dealers\" \
  -H \"Content-Type: application/json\" \
  -d '{
    \"name\": \"John Doe\",
    \"email\": \"john.doe@example.com\",
    \"phoneNumber\": \"+1234567890\",
    \"password\": \"securePassword123\",
    \"gst\": \"GST123456789\",
    \"businessTypeId\": \"invalid-uuid\"
  }' -s | jq '.'"

# 8. TESTING WORKFLOW
print_header "8. COMPLETE TESTING WORKFLOW"

echo -e "${GREEN}Step 1: Health Check${NC}"
curl -X GET "${BASE_URL}/health" -s | jq '.'

echo -e "\n${GREEN}Step 2: Create Business Type${NC}"
BUSINESS_TYPE_RESPONSE=$(curl -X POST "${BASE_URL}/business-types" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Transportation",
    "description": "Transportation and logistics business"
  }' -s)
echo "$BUSINESS_TYPE_RESPONSE" | jq '.'

# Extract business type ID
BUSINESS_TYPE_ID=$(echo "$BUSINESS_TYPE_RESPONSE" | jq -r '.data.id')
echo -e "\n${YELLOW}Extracted Business Type ID: $BUSINESS_TYPE_ID${NC}"

echo -e "\n${GREEN}Step 3: Create Business Dealer${NC}"
DEALER_RESPONSE=$(curl -X POST "${BASE_URL}/business-dealers" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"John Doe\",
    \"email\": \"john.doe@example.com\",
    \"phoneNumber\": \"+1234567890\",
    \"password\": \"securePassword123\",
    \"gst\": \"GST123456789\",
    \"businessTypeId\": \"$BUSINESS_TYPE_ID\"
  }" -s)
echo "$DEALER_RESPONSE" | jq '.'

# Extract business dealer ID
BUSINESS_DEALER_ID=$(echo "$DEALER_RESPONSE" | jq -r '.data.businessDealer.id')
echo -e "\n${YELLOW}Extracted Business Dealer ID: $BUSINESS_DEALER_ID${NC}"

echo -e "\n${GREEN}Step 4: Verify Business Dealer Creation${NC}"
curl -X GET "${BASE_URL}/business-dealers" -s | jq '.'

echo -e "\n${GREEN}Step 5: Test Login${NC}"
curl -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }' -s | jq '.'

print_success "Testing workflow completed!"
print_warning "Remember to update BUSINESS_TYPE_ID and BUSINESS_DEALER_ID variables if needed"

# 9. ENVIRONMENT SETUP
print_header "9. ENVIRONMENT SETUP"

echo -e "${YELLOW}To set up environment variables, run:${NC}"
echo "export BASE_URL=\"http://localhost:3000/api\""
echo "export BUSINESS_TYPE_ID=\"$BUSINESS_TYPE_ID\""
echo "export BUSINESS_DEALER_ID=\"$BUSINESS_DEALER_ID\""

echo -e "\n${YELLOW}To run individual commands with variables:${NC}"
echo "curl -X GET \"\${BASE_URL}/business-dealers/\${BUSINESS_DEALER_ID}\""

print_success "cURL Collection ready for use!"
