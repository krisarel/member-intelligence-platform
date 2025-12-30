# WiW3CH Intelligence Platform - Onboarding Flow

## Overview

This document describes the one-time onboarding flow for new users joining the WiW3CH Intelligence Platform. The onboarding captures user intent and preferences to enable intelligent AI-powered recommendations and matching.

## Canonical User Flow

### New User (First-Time Experience)
1. Public Welcome Page
2. Sign Up
3. Sign In (immediate or implicit after signup)
4. **Onboarding Flow** (one-time only)
5. Redirected to Dashboard

### Returning User
1. Public Welcome Page
2. Sign In
3. Redirected to Dashboard (skip onboarding entirely)

## Demo User Accounts

### Aliya AI (Test Onboarding Flow)
- **Email:** `aliya@example.com`
- **Password:** `hellothere`
- **Purpose:** Test the onboarding flow repeatedly
- **Note:** This user always has `onboardingCompleted = false`, so they will see the onboarding flow every time they sign in

### Maya Chen (VIP User - Skip Onboarding)
- **Email:** `maya@example.com`
- **Password:** `password123`
- **Purpose:** Test returning user flow (skip onboarding)
- **Note:** This user has completed onboarding and goes directly to dashboard

## Onboarding Prompts (8 Steps)

### Required Prompts (Steps 1-3)

#### Prompt 1: Core Intent (Free Text)
**Question:** "Why are you joining the WiW3CH community right now?"

**Format:** Free text area (max 2000 characters)

**Helper Text Examples:**
- "I'm looking for mentorship as I transition into DeFi."
- "I want to mentor women entering Web3 marketing."
- "I'm hoping to speak at events and contribute to the community."

**Purpose:** Captures natural language intent for AI analysis

---

#### Prompt 2: Intent Mode (Multi-Select)
**Question:** "Which best describes what you're open to right now?"

**Options:**
- Seeking mentorship
- Offering mentorship
- Exploring job opportunities
- Hiring / building a team
- Speaking at events
- Organizing events or panels
- Volunteering or contributing
- Learning / exploring
- Collaborating on projects
- Recruitment (Hiring)
- Recruitment (Seeking Opportunities)

**Purpose:** Structured confirmation of intent for matching

---

#### Prompt 3: Visibility & Consent
**Question:** "How visible would you like to be to other members?"

**Options:**
- **Open to connections and opportunities** - Your profile is visible and you can be contacted by other members
- **Open, but prefer to review requests** - You will receive connection requests that you can approve
- **Limited visibility for now** - Your profile is private and you control who can see it

**Purpose:** Sets trust tone early and aligns with GDPR standards

---

### Optional Prompts (Steps 4-8)

#### Prompt 4: Domain Focus (Multi-Select)
**Question:** "What areas are you most active or interested in?"

**Options:**
- DeFi
- CeFi
- AI / ML
- Web3 Infrastructure
- Engineering
- Product
- Marketing / Growth
- BD / Partnerships
- Legal / Compliance
- Research
- Design
- Operations
- Other

---

#### Prompt 5: Experience Level (Single Select)
**Question:** "How would you describe your experience level?"

**Options:**
- Exploring / early career
- Mid-level
- Senior / leadership
- Founder / executive

---

#### Prompt 6: Skills & Strengths (Tags, Max 10)
**Question:** "What skills or strengths best describe you?"

**Example Options:**
- Solidity
- Python
- Tokenomics
- GTM Strategy
- Hiring
- Public speaking
- DAO operations
- Community building
- Marketing
- Executive Leadership
- Vibe Coding
- Blockchain Education

---

#### Prompt 7: Availability (Single Select)
**Question:** "What best describes your availability right now?"

**Options:**
- Actively looking for opportunities
- Open to conversations
- Limited availability
- Not available right now

---

#### Prompt 8: Community Contribution (Multi-Select)
**Question:** "How would you like to contribute to WiW3CH?"

**Options:**
- Mentoring
- Speaking
- Volunteering for WiW3CH
- Organizing events
- Technical support
- Advisory support
- Job Opportunities (Hiring Recruiter)

---

## Technical Implementation

### Backend

#### User Model (`backend/src/models/User.ts`)
```typescript
interface IOnboardingData {
  coreIntent?: string;                    // Prompt 1
  intentModes: string[];                  // Prompt 2
  visibilityPreference?: string;          // Prompt 3
  domainFocus?: string[];                 // Prompt 4
  experienceLevel?: string;               // Prompt 5
  skills?: string[];                      // Prompt 6
  availability?: string;                  // Prompt 7
  contributionAreas?: string[];           // Prompt 8
  currentStep?: number;
  completedAt?: Date;
}
```

#### API Endpoints

**Get Onboarding Status:**
```
GET /api/onboarding/me
Authorization: Bearer {token}
```

**Save Each Step:**
```
POST /api/onboarding/step/1  (Core Intent)
POST /api/onboarding/step/2  (Intent Modes)
POST /api/onboarding/step/3  (Visibility)
POST /api/onboarding/step/4  (Domain Focus)
POST /api/onboarding/step/5  (Experience Level)
POST /api/onboarding/step/6  (Skills)
POST /api/onboarding/step/7  (Availability)
POST /api/onboarding/step/8  (Contribution)
Authorization: Bearer {token}
```

**Complete Onboarding:**
```
POST /api/onboarding/complete
Authorization: Bearer {token}
```

#### Auth Response
Both login and register endpoints now return:
```json
{
  "status": "success",
  "data": {
    "user": { ... },
    "token": "...",
    "requiresOnboarding": true/false
  }
}
```

### Frontend

#### Routes
- `/auth` - Sign in / Sign up page
- `/onboarding` - 8-step onboarding flow
- `/dashboard` - Main dashboard (post-onboarding)

#### Onboarding Page (`frontend/app/onboarding/page.tsx`)
- Single-page component with 8 steps
- Progress bar showing completion
- Back button for navigation
- Skip button for optional steps (4-8)
- Auto-saves progress at each step
- Validates required fields before proceeding

#### Auth Page (`frontend/app/auth/page.tsx`)
- Integrated with backend API
- Routes to `/onboarding` for new users
- Routes to `/dashboard` for returning users
- Displays demo account credentials

## UX Principles

1. **"Right now" language** - Allows intent to evolve over time
2. **No career-pressure framing** - Welcoming and inclusive
3. **Value reinforcement** - "This helps us make better introductions"
4. **Flexibility** - "You can change this anytime"
5. **Fast and focused** - Under 2 minutes to complete
6. **Progress saved** - Each step saves automatically

## AI Integration

The core intent (Prompt 1) is analyzed using OpenAI to:
- Extract domain focus suggestions
- Identify intent patterns
- Improve matching accuracy
- Generate personalized recommendations

## Testing the Flow

### Test New User Onboarding
1. Navigate to `http://localhost:3000/auth`
2. Sign in with `aliya@example.com` / `hellothere`
3. Complete the 8-step onboarding flow
4. Verify redirect to dashboard
5. Sign out and sign in again to test the flow repeats

### Test Returning User
1. Navigate to `http://localhost:3000/auth`
2. Sign in with `maya@example.com` / `password123`
3. Verify immediate redirect to dashboard (skip onboarding)

### Create New Account
1. Navigate to `http://localhost:3000/auth?mode=signup`
2. Fill in registration form
3. Submit to create account
4. Verify automatic redirect to onboarding
5. Complete onboarding
6. Verify redirect to dashboard

## Database Seeding

To create/reset demo users:
```bash
cd member-intelligence-platform/backend
npm run seed
```

This creates:
- Aliya AI (test onboarding)
- Maya Chen (VIP, completed onboarding)

## Future Enhancements

1. **Intent Refresh** - Allow users to update their intent periodically
2. **Onboarding Analytics** - Track completion rates and drop-off points
3. **Smart Suggestions** - Use AI to suggest skills and domains based on free text
4. **Progressive Disclosure** - Show relevant optional prompts based on intent
5. **Social Proof** - Show how many members share similar intents
6. **Gamification** - Reward profile completion with badges or features

## Notes

- Onboarding is **one-time only** for normal users
- Demo user "Aliya AI" is special - always shows onboarding for testing
- All optional fields can be skipped
- Progress is saved at each step
- Users can go back to edit previous answers
- Maximum 10 skills can be selected
- Core intent limited to 2000 characters