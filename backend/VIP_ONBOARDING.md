# VIP Onboarding System Documentation

## Overview

The VIP Onboarding System is a comprehensive, AI-powered onboarding flow designed for the WiW3CH (Women in Web3 Switzerland) member intelligence platform. It provides a streamlined, intelligent onboarding experience that captures member intent, expertise, and consent preferences to power personalized recommendations and introductions.

## Key Features

- **Automatic Tier Detection**: Verifies membership tier (Free, VIP, Admin, SuperAdmin) during registration
- **AI-Powered Intent Analysis**: Uses GPT-4o-mini to extract structured data from natural language intent statements
- **Progressive Onboarding**: 5-step flow with progress tracking and resume capability
- **Consent-First Design**: Explicit consent controls for introductions, opportunities, and visibility
- **VIP Benefits**: Automatic benefit assignment based on membership tier

## Architecture

### Data Models

#### User Model Enhancement
```typescript
interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member';
  membershipTier: 'free' | 'vip' | 'admin' | 'superadmin';  // NEW
  onboarding?: IOnboardingData;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IOnboardingData {
  // Step 1: Intent (free text)
  intentText?: string;
  
  // Step 2: Intent confirmation (multi-select)
  intentModes: string[];
  
  // Step 3: Expertise signals (optional)
  visibilityPreference: 'open' | 'review' | 'limited';
  domainFocus: string[];
  experienceLevel?: 'exploring' | 'mid_level' | 'senior' | 'founder';
  skills?: string[];
  availability?: 'actively_looking' | 'open_to_conversations' | 'limited' | 'not_available';
  contributionAreas?: string[];
  
  // Step 4: Consent & visibility
  consentToIntros?: boolean;
  consentToOpportunities?: boolean;
  consentToSpeaking?: boolean;
  
  // Progress tracking
  currentStep?: number;
  completedAt?: Date;
}
```

### Services

#### Membership Service (`src/services/membership.service.ts`)

Handles membership tier verification and benefit management:

```typescript
// Verify membership tier for email
verifyMembershipTier(email: string): Promise<MembershipTier>

// Update user's membership tier
updateUserTier(userId: string, tier: MembershipTier): Promise<IUser | null>

// Check if user has VIP access
hasVIPAccess(user: IUser): boolean

// Get VIP benefits based on tier
getVIPBenefits(tier: MembershipTier): string[]
```

**VIP Member List** (MVP Implementation):
- Currently uses a hardcoded list of VIP emails
- In production, this would integrate with an external membership database or API
- VIP emails: `alex@fintech.com`, `sarah@defi.io`, `emma@web3.org`

#### OpenAI Service (`src/services/openai.service.ts`)

Provides AI-powered intent analysis:

```typescript
analyzeIntent(rawText: string): Promise<IntentAnalysisResult>
```

**Intent Analysis Output**:
```typescript
{
  intentType: 'receiving' | 'giving' | 'both',
  categories: [{
    category: string,
    subcategories: string[],
    confidence: number
  }],
  domains: string[],
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert',
  availability?: 'immediate' | 'within_month' | 'flexible' | 'not_specified'
}
```

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
```

**Request Body**:
```json
{
  "email": "alex@fintech.com",
  "password": "password123",
  "firstName": "Alex",
  "lastName": "Chen"
}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "email": "alex@fintech.com",
      "firstName": "Alex",
      "lastName": "Chen",
      "role": "member",
      "membershipTier": "vip",
      "onboardingCompleted": false,
      "createdAt": "2025-12-21T19:17:50.040Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "benefits": [
      "Priority matching for introductions",
      "AI-powered intent understanding",
      "Advanced profile customization",
      "Early access to job postings",
      "VIP-only networking events",
      "Direct messaging with other VIPs",
      "Featured profile placement"
    ],
    "isVIP": true
  }
}
```

#### Login User
```
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "alex@fintech.com",
  "password": "password123"
}
```

**Response**: Same as registration

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "email": "alex@fintech.com",
      "firstName": "Alex",
      "lastName": "Chen",
      "role": "member",
      "membershipTier": "vip",
      "onboardingCompleted": true,
      "onboarding": { ... },
      "createdAt": "...",
      "updatedAt": "..."
    },
    "benefits": [...],
    "isVIP": true
  }
}
```

### Onboarding Flow

All onboarding endpoints require authentication via Bearer token.

#### Get Onboarding Status
```
GET /api/onboarding/me
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "email": "alex@fintech.com",
      "firstName": "Alex",
      "lastName": "Chen",
      "membershipTier": "vip",
      "onboardingCompleted": false,
      "onboarding": {
        "intentModes": [],
        "domainFocus": [],
        "skills": [],
        "contributionAreas": [],
        "consentToIntros": false,
        "consentToOpportunities": false,
        "consentToSpeaking": false,
        "currentStep": 0
      }
    },
    "benefits": [...],
    "isVIP": true
  }
}
```

#### Step 1: Save Intent Text
```
POST /api/onboarding/intent
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "intentText": "I am transitioning from traditional finance to DeFi and looking to connect with experienced professionals in the Web3 space."
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Intent saved successfully",
  "data": {
    "user": {
      "id": "...",
      "onboarding": {
        "intentText": "I am transitioning...",
        "domainFocus": ["DeFi", "Web3"],
        "currentStep": 1,
        ...
      }
    },
    "aiSuggestions": {
      "intentType": "receiving",
      "categories": [{
        "category": "Career",
        "subcategories": ["career_transition", "networking"],
        "confidence": 0.9
      }],
      "domains": ["DeFi", "Web3"],
      "experienceLevel": "intermediate",
      "availability": "not_specified"
    }
  }
}
```

**Features**:
- Automatically analyzes intent using AI
- Extracts domains and categories
- Provides AI suggestions for next steps
- Updates `currentStep` to 1

#### Step 2: Save Intent Modes
```
POST /api/onboarding/intent-modes
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "intentModes": [
    "seeking_mentorship",
    "learning",
    "exploring_jobs"
  ]
}
```

**Valid Intent Modes**:
- `seeking_mentorship`
- `offering_mentorship`
- `exploring_jobs`
- `hiring`
- `speaking`
- `organizing_events`
- `volunteering`
- `learning`
- `collaborating`

**Response**:
```json
{
  "status": "success",
  "message": "Intent modes saved successfully",
  "data": {
    "user": {
      "id": "...",
      "onboarding": {
        "intentModes": ["seeking_mentorship", "learning", "exploring_jobs"],
        "currentStep": 2,
        ...
      }
    }
  }
}
```

#### Step 3: Save Expertise (Optional)
```
POST /api/onboarding/expertise
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "domainFocus": ["DeFi", "Web3 Infrastructure", "Engineering"],
  "experienceLevel": "mid_level",
  "skills": ["JavaScript", "Solidity", "React", "Node.js", "Smart Contracts"]
}
```

**Valid Experience Levels**:
- `exploring`
- `mid_level`
- `senior`
- `founder`

**Constraints**:
- Maximum 10 skills allowed

**Response**:
```json
{
  "status": "success",
  "message": "Expertise saved successfully",
  "data": {
    "user": {
      "id": "...",
      "onboarding": {
        "domainFocus": ["DeFi", "Web3 Infrastructure", "Engineering"],
        "experienceLevel": "mid_level",
        "skills": ["JavaScript", "Solidity", "React", "Node.js", "Smart Contracts"],
        "currentStep": 3,
        ...
      }
    }
  }
}
```

#### Step 4: Save Consent & Visibility
```
POST /api/onboarding/consent
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "visibilityPreference": "open",
  "consentToIntros": true,
  "consentToOpportunities": true,
  "consentToSpeaking": false
}
```

**Valid Visibility Preferences**:
- `open`: Visible to all members, open to connections
- `review`: Visible but prefer to review requests first
- `limited`: Limited visibility, selective connections

**Response**:
```json
{
  "status": "success",
  "message": "Consent preferences saved successfully",
  "data": {
    "user": {
      "id": "...",
      "onboarding": {
        "visibilityPreference": "open",
        "consentToIntros": true,
        "consentToOpportunities": true,
        "consentToSpeaking": false,
        "currentStep": 4,
        ...
      }
    }
  }
}
```

#### Step 5: Complete Onboarding
```
POST /api/onboarding/complete
Authorization: Bearer <token>
```

**No Request Body Required**

**Validation**:
- `intentText` must be provided
- At least one `intentMode` must be selected
- `visibilityPreference` must be set

**Response**:
```json
{
  "status": "success",
  "message": "Onboarding completed successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "alex@fintech.com",
      "firstName": "Alex",
      "lastName": "Chen",
      "membershipTier": "vip",
      "onboardingCompleted": true,
      "onboarding": {
        "intentText": "...",
        "intentModes": [...],
        "domainFocus": [...],
        "skills": [...],
        "experienceLevel": "mid_level",
        "visibilityPreference": "open",
        "consentToIntros": true,
        "consentToOpportunities": true,
        "consentToSpeaking": false,
        "currentStep": 5,
        "completedAt": "2025-12-21T19:20:52.125Z"
      }
    },
    "benefits": [...],
    "isVIP": true
  }
}
```

## Onboarding Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Registration                         │
│  - Email verification                                        │
│  - Automatic tier detection (VIP/Free/Admin/SuperAdmin)     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              VIP Recognition Screen                          │
│  "Welcome, you're a VIP member!"                            │
│  Display VIP benefits                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Intent (Required)                                  │
│  "What brings you to WiW3CH right now?"                     │
│  - Free text input (max 2000 chars)                         │
│  - AI analysis extracts domains & categories                │
│  - Progress: currentStep = 1                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Intent Modes (Required)                            │
│  "What are you open to right now?"                          │
│  - Multi-select checkboxes                                  │
│  - Options: mentorship, jobs, speaking, etc.                │
│  - Progress: currentStep = 2                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Expertise Signals (Optional)                       │
│  - Domain focus (multi-select)                              │
│  - Experience level (single select)                         │
│  - Skills (up to 10 tags)                                   │
│  - Progress: currentStep = 3                                │
│  - Can skip this step                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Consent & Visibility (Required)                    │
│  - Visibility preference (open/review/limited)              │
│  - Consent toggles (intros, opportunities, speaking)        │
│  - "You can change this anytime"                            │
│  - Progress: currentStep = 4                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 5: Completion                                         │
│  - Validate required fields                                 │
│  - Set onboardingCompleted = true                           │
│  - Set completedAt timestamp                                │
│  - Progress: currentStep = 5                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Confirmation Screen                             │
│  "You're all set!"                                          │
│  - Display VIP benefits unlocked                            │
│  - CTA: "Go to Dashboard"                                   │
└─────────────────────────────────────────────────────────────┘
```

## How This Powers Recommendations

### Intent Intelligence

The onboarding system captures both **structured** and **unstructured** intent data:

1. **Raw Intent Text**: Natural language statement of user's goals
2. **AI-Extracted Categories**: Structured categories with confidence scores
3. **Intent Modes**: Explicit selections (seeking/offering)
4. **Domain Focus**: Areas of expertise and interest
5. **Skills**: Specific technical and professional skills

### Matching Algorithm

The system uses this data to power intelligent matching:

```typescript
// Example matching logic
const matchScore = calculateMatchScore({
  sharedDomains: 15 points each,
  complementaryIntents: 30 points (seeking ↔ offering),
  sharedCategories: 10 points each,
  categoryConfidence: 20 points (weighted),
  matchingAvailability: 5 points
});

// Maximum score: 100
```

### Match Explanations

Every match includes an AI-generated explanation:

```
"You both expressed mentorship intent in DeFi. Sarah is seeking 
mentorship as she transitions from TradFi, while you're offering 
mentorship to women entering DeFi."
```

### Privacy & Consent

- All matches respect visibility preferences
- Consent flags control introduction types
- Users can pause or update intent anytime
- Contact details hidden by default

## VIP Benefits

### Free Tier
- Access to member directory
- Basic profile visibility
- Community events access

### VIP Tier
- Priority matching for introductions
- AI-powered intent understanding
- Advanced profile customization
- Early access to job postings
- VIP-only networking events
- Direct messaging with other VIPs
- Featured profile placement

### Admin Tier
- All VIP benefits
- Member management access
- Event organization tools
- Analytics dashboard

### SuperAdmin Tier
- All admin benefits
- Full platform access
- System configuration
- User tier management

## Testing

### Test Script

Run the complete VIP onboarding flow:

```bash
cd member-intelligence-platform/backend
./test-vip-onboarding.sh
```

### Manual Testing

1. **Register VIP User**:
```bash
curl -X POST "http://localhost:5001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex@fintech.com",
    "password": "password123",
    "firstName": "Alex",
    "lastName": "Chen"
  }'
```

2. **Check Onboarding Status**:
```bash
curl -X GET "http://localhost:5001/api/onboarding/me" \
  -H "Authorization: Bearer <token>"
```

3. **Complete Each Step** (see API endpoints above)

## Error Handling

### Common Errors

**400 Bad Request**:
```json
{
  "status": "error",
  "message": "Intent text is required"
}
```

**401 Unauthorized**:
```json
{
  "status": "error",
  "message": "Not authorized to access this route. Please login."
}
```

**500 Server Error**:
```json
{
  "status": "error",
  "message": "Error saving intent",
  "error": "Detailed error message (development only)"
}
```

## Future Enhancements

1. **Magic Link Authentication**: Passwordless login via email
2. **Multi-Intent Support**: Allow multiple active intents
3. **Intent Decay**: Prompt users to refresh stale intents
4. **Feedback Loop**: Learn from accepted/declined matches
5. **Smart Notifications**: AI-powered timing for match notifications
6. **Batch Matching**: Weekly digest of top matches
7. **External Membership API**: Integration with wiw3ch.com membership database

## Security Considerations

- All passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 30 days
- CORS configured for frontend origin
- Helmet.js for security headers
- Input validation on all endpoints
- Rate limiting (to be implemented)

## Support

For technical support or questions about the VIP onboarding system:
- Review this documentation
- Check the test script for examples
- Consult the API documentation
- Contact the development team

---

**Last Updated**: December 21, 2025
**Version**: 1.0.0
**Status**: Production Ready