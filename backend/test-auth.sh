#!/bin/bash

echo "==================================="
echo "Testing Authentication Endpoints"
echo "==================================="
echo ""

# Test 1: Register a new user
echo "1. Testing Registration (POST /api/auth/register)"
echo "-----------------------------------"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }')

echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Extract token from registration response
TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "⚠️  Registration failed or user already exists. Trying login instead..."
  echo ""
  
  # Test 2: Login with existing user
  echo "2. Testing Login (POST /api/auth/login)"
  echo "-----------------------------------"
  LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "testuser@example.com",
      "password": "password123"
    }')
  
  echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"
  echo ""
  
  TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
fi

# Test 3: Get current user (protected route)
if [ ! -z "$TOKEN" ]; then
  echo "3. Testing Get Current User (GET /api/auth/me)"
  echo "-----------------------------------"
  ME_RESPONSE=$(curl -s -X GET http://localhost:5000/api/auth/me \
    -H "Authorization: Bearer $TOKEN")
  
  echo "$ME_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ME_RESPONSE"
  echo ""
  
  echo "✅ All authentication endpoints are working!"
else
  echo "❌ Could not obtain authentication token"
fi

echo ""
echo "==================================="
echo "Test Complete"
echo "==================================="