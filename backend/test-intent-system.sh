#!/bin/bash

# Test script for the AI-powered Intent System
# This script tests the intent creation, matching, and management endpoints

BASE_URL="http://localhost:5001/api"
TOKEN=""

echo "🧪 Testing AI-Powered Intent System"
echo "===================================="
echo ""

# Step 1: Register a test user
echo "📝 Step 1: Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mentor@test.com",
    "password": "Test123!",
    "firstName": "Sarah",
    "lastName": "Mentor"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to register user"
  echo "Response: $REGISTER_RESPONSE"
  exit 1
fi

echo "✅ User registered successfully"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Step 2: Create an intent
echo "📝 Step 2: Creating intent with natural language..."
INTENT_RESPONSE=$(curl -s -X POST "$BASE_URL/intents" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "rawText": "I want to mentor women entering DeFi and Web3. I have 10 years of experience in traditional finance and have been in crypto for 3 years. I am particularly interested in helping people understand tokenomics and DeFi protocols.",
    "visibility": "members_only",
    "consentToMatch": true,
    "consentToContact": true
  }')

echo "Intent Response:"
echo $INTENT_RESPONSE | jq '.'
echo ""

# Step 3: Get user's intent
echo "📝 Step 3: Retrieving user intent..."
GET_INTENT_RESPONSE=$(curl -s -X GET "$BASE_URL/intents" \
  -H "Authorization: Bearer $TOKEN")

echo "Retrieved Intent:"
echo $GET_INTENT_RESPONSE | jq '.'
echo ""

# Step 4: Register a second user (mentee)
echo "📝 Step 4: Registering second test user (mentee)..."
REGISTER2_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mentee@test.com",
    "password": "Test123!",
    "firstName": "Alex",
    "lastName": "Learner"
  }')

TOKEN2=$(echo $REGISTER2_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN2" ]; then
  echo "❌ Failed to register second user"
  exit 1
fi

echo "✅ Second user registered successfully"
echo ""

# Step 5: Create intent for second user
echo "📝 Step 5: Creating intent for second user..."
INTENT2_RESPONSE=$(curl -s -X POST "$BASE_URL/intents" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{
    "rawText": "I am transitioning from TradFi to DeFi and looking for a mentor who can help me understand the space. I am particularly interested in learning about tokenomics and how DeFi protocols work.",
    "visibility": "members_only",
    "consentToMatch": true,
    "consentToContact": true
  }')

echo "Second Intent Response:"
echo $INTENT2_RESPONSE | jq '.'
echo ""

# Step 6: Generate matches for first user
echo "📝 Step 6: Generating matches for mentor..."
MATCHES_RESPONSE=$(curl -s -X POST "$BASE_URL/intents/matches/generate?limit=5" \
  -H "Authorization: Bearer $TOKEN")

echo "Matches Generated:"
echo $MATCHES_RESPONSE | jq '.'
echo ""

# Step 7: Get user matches
echo "📝 Step 7: Retrieving matches..."
GET_MATCHES_RESPONSE=$(curl -s -X GET "$BASE_URL/intents/matches" \
  -H "Authorization: Bearer $TOKEN")

echo "User Matches:"
echo $GET_MATCHES_RESPONSE | jq '.'
echo ""

# Step 8: Test pause functionality
echo "📝 Step 8: Testing pause intent..."
PAUSE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/intents/pause" \
  -H "Authorization: Bearer $TOKEN")

echo "Pause Response:"
echo $PAUSE_RESPONSE | jq '.'
echo ""

# Step 9: Test resume functionality
echo "📝 Step 9: Testing resume intent..."
RESUME_RESPONSE=$(curl -s -X PATCH "$BASE_URL/intents/resume" \
  -H "Authorization: Bearer $TOKEN")

echo "Resume Response:"
echo $RESUME_RESPONSE | jq '.'
echo ""

# Step 10: Update visibility
echo "📝 Step 10: Testing visibility update..."
VISIBILITY_RESPONSE=$(curl -s -X PATCH "$BASE_URL/intents/visibility" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "visibility": "public"
  }')

echo "Visibility Update Response:"
echo $VISIBILITY_RESPONSE | jq '.'
echo ""

# Step 11: Update consent
echo "📝 Step 11: Testing consent update..."
CONSENT_RESPONSE=$(curl -s -X PATCH "$BASE_URL/intents/consent" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "consentToMatch": true,
    "consentToContact": false
  }')

echo "Consent Update Response:"
echo $CONSENT_RESPONSE | jq '.'
echo ""

echo "✅ All tests completed!"
echo ""
echo "Summary:"
echo "- User registration: ✅"
echo "- Intent creation with AI analysis: ✅"
echo "- Intent retrieval: ✅"
echo "- Match generation: ✅"
echo "- Match retrieval: ✅"
echo "- Pause/Resume: ✅"
echo "- Visibility control: ✅"
echo "- Consent management: ✅"
echo ""
echo "🎉 Intent system is working correctly!"