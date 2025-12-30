#!/bin/bash

# Test VIP Onboarding Flow
# This script tests the complete VIP onboarding process

BASE_URL="http://localhost:5001/api"
EMAIL="alex@fintech.com"
PASSWORD="password123"

echo "=== Testing VIP Onboarding Flow ==="
echo ""

# Step 1: Register a new VIP user
echo "1. Registering VIP user (alex@fintech.com)..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"firstName\": \"Alex\",
    \"lastName\": \"Chen\"
  }")

echo "$REGISTER_RESPONSE" | jq '.'
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.token')
IS_VIP=$(echo "$REGISTER_RESPONSE" | jq -r '.data.isVIP')
TIER=$(echo "$REGISTER_RESPONSE" | jq -r '.data.user.membershipTier')

echo ""
echo "Token: $TOKEN"
echo "Is VIP: $IS_VIP"
echo "Tier: $TIER"
echo ""

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Registration failed. Trying to login instead..."
  
  # Try login if user already exists
  LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$EMAIL\",
      \"password\": \"$PASSWORD\"
    }")
  
  echo "$LOGIN_RESPONSE" | jq '.'
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
  IS_VIP=$(echo "$LOGIN_RESPONSE" | jq -r '.data.isVIP')
  TIER=$(echo "$LOGIN_RESPONSE" | jq -r '.data.user.membershipTier')
  
  echo ""
  echo "Token: $TOKEN"
  echo "Is VIP: $IS_VIP"
  echo "Tier: $TIER"
  echo ""
fi

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Failed to get authentication token"
  exit 1
fi

echo "✅ Authentication successful"
echo ""

# Step 2: Check onboarding status
echo "2. Checking onboarding status..."
curl -s -X GET "$BASE_URL/onboarding/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# Step 3: Save intent text (Step 1)
echo "3. Saving intent text..."
curl -s -X POST "$BASE_URL/onboarding/intent" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "intentText": "I am transitioning from traditional finance to DeFi and looking to connect with experienced professionals in the Web3 space. I want to learn about decentralized protocols and potentially find mentorship opportunities."
  }' | jq '.'
echo ""

# Step 4: Save intent modes (Step 2)
echo "4. Saving intent modes..."
curl -s -X POST "$BASE_URL/onboarding/intent-modes" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "intentModes": ["seeking_mentorship", "learning", "exploring_jobs"]
  }' | jq '.'
echo ""

# Step 5: Save expertise (Step 3 - Optional)
echo "5. Saving expertise signals..."
curl -s -X POST "$BASE_URL/onboarding/expertise" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "domainFocus": ["DeFi", "Web3 Infrastructure", "Engineering"],
    "experienceLevel": "mid_level",
    "skills": ["JavaScript", "Solidity", "React", "Node.js", "Smart Contracts"]
  }' | jq '.'
echo ""

# Step 6: Save consent (Step 4)
echo "6. Saving consent and visibility..."
curl -s -X POST "$BASE_URL/onboarding/consent" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "visibilityPreference": "open",
    "consentToIntros": true,
    "consentToOpportunities": true,
    "consentToSpeaking": false
  }' | jq '.'
echo ""

# Step 7: Complete onboarding
echo "7. Completing onboarding..."
curl -s -X POST "$BASE_URL/onboarding/complete" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# Step 8: Verify completion
echo "8. Verifying onboarding completion..."
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
echo ""

echo "=== VIP Onboarding Test Complete ==="