# AI-Powered Intent Understanding & Matching System

## Overview

The WiW3CH Member Intelligence Platform features an AI-powered intent understanding and matching system that treats user intent as a first-class, intelligent signal. The system uses natural language processing to understand member goals and facilitates meaningful connections through complementary intent matching.

## Core Principles

1. **Intent as Primary Signal**: User intent is captured through natural language and treated as the most important matching criterion
2. **Human-Centric Design**: The system feels warm and respectful, not transactional or algorithmic
3. **Transparency**: Users always understand why they were matched with someone
4. **Privacy & Consent**: Users have full control over their visibility and matching preferences
5. **Evolution**: Intent can change over time and users can update it anytime

## System Architecture

### 1. Data Models

#### Intent Model (`src/models/Intent.ts`)
Stores both structured and unstructured intent data:
- **rawText**: Natural language intent statement (up to 2000 characters)
- **intentType**: 'receiving' (seeking), 'giving' (offering), or 'both'
- **categories**: AI-extracted categories with confidence scores
- **domains**: Focus areas (DeFi, Web3, AI/ML, etc.)
- **experienceLevel**: beginner, intermediate, advanced, expert
- **availability**: immediate, within_month, flexible, not_specified
- **visibility**: public, members_only, private
- **consentToMatch**: Boolean for matching consent
- **consentToContact**: Boolean for direct contact consent
- **isPaused**: Allows temporary pause without deletion

#### Match Model (`src/models/Match.ts`)
Stores matches with explanations:
- **matchScore**: 0-100 score based on complementary intents
- **explanation**: Human-readable reason for the match
- **sharedDomains**: Common areas of interest
- **complementaryIntents**: How intents complement each other
- **status**: pending, accepted, declined, expired
- **expiresAt**: Matches expire after 30 days

#### User Model (`src/models/User.ts`)
Enhanced with onboarding data:
- **onboarding.intentModes**: Structured intent categories
- **onboarding.visibilityPreference**: open, review, limited
- **onboarding.domainFocus**: Areas of expertise/interest
- **onboarding.experienceLevel**: Career stage
- **onboarding.skills**: Specific skills and strengths
- **onboarding.availability**: Current availability status
- **onboarding.contributionAreas**: How they want to contribute

### 2. AI Services

#### OpenAI Service (`src/services/openai.service.ts`)
Uses GPT-4o-mini for:
- **Intent Analysis**: Extracts structured data from natural language
- **Match Explanations**: Generates human-friendly match reasons

Intent analysis extracts:
- Intent type (receiving/giving/both)
- Categories with subcategories and confidence scores
- Domain focus areas
- Experience level
- Availability

#### Intent Service (`src/services/intent.service.ts`)
Manages intent lifecycle:
- Create/update intent with AI analysis
- Pause/resume intent
- Update visibility and consent preferences
- Find matchable intents based on complementary goals

#### Matching Service (`src/services/matching.service.ts`)
Implements intelligent matching:
- **Scoring Algorithm**:
  - Shared domains: +15 points each
  - Complementary intent types: +30 points
  - Shared categories: +10 points each
  - Category confidence: +20 points (weighted)
  - Matching availability: +5 points
  - Maximum score: 100

- **Match Generation**:
  - Finds users with complementary intents
  - Filters by consent and visibility
  - Generates AI-powered explanations
  - Creates match records with 30-day expiration

## Privacy & Consent Controls

### Built-in Privacy Features

1. **Visibility Control**
   - **Public**: Visible to all members
   - **Members Only**: Visible only to authenticated members (default)
   - **Private**: Not visible in matching, intent stored for future use

2. **Consent Management**
   - **consentToMatch**: Must be true for matching to occur
   - **consentToContact**: Controls whether others can directly contact
   - Both can be updated independently at any time

3. **Pause Functionality**
   - Users can pause intent without deleting it
   - Paused intents are excluded from matching
   - Easy to resume when ready

4. **Intent Deletion**
   - Soft delete (marks as inactive)
   - Preserves historical data for analytics
   - Removes from all active matching

### GDPR & Privacy Compliance

- Users can view all their data
- Users can update or delete their intent anytime
- Clear consent mechanisms for matching and contact
- Transparent explanations for all matches
- No hidden algorithmic decisions

## API Endpoints

### Intent Management

```
POST   /api/intents              - Create or update intent
GET    /api/intents              - Get user's current intent
PATCH  /api/intents/pause        - Pause intent
PATCH  /api/intents/resume       - Resume intent
DELETE /api/intents              - Delete intent
PATCH  /api/intents/visibility   - Update visibility
PATCH  /api/intents/consent      - Update consent preferences
```

### Matching

```
POST   /api/intents/matches/generate        - Generate new matches
GET    /api/intents/matches                 - Get user's matches
PATCH  /api/intents/matches/:id/view        - Mark match as viewed
PATCH  /api/intents/matches/:id/status      - Accept or decline match
```

## Onboarding Flow

### Primary Prompts (Required)

1. **Core Intent** (Free Text)
   - "Why are you joining the WiW3CH community right now?"
   - Captures natural language intent
   - Allows dual intent organically

2. **Intent Mode** (Multi-Select)
   - Seeking mentorship
   - Offering mentorship
   - Exploring job opportunities
   - Hiring / building a team
   - Speaking at events
   - Organizing events or panels
   - Volunteering or contributing
   - Learning / exploring
   - Collaborating on projects

3. **Visibility & Consent**
   - Open to connections and opportunities
   - Open, but prefer to review requests
   - Limited visibility for now

### Secondary Prompts (Optional)

4. **Domain Focus** (Multi-Select)
   - DeFi, CeFi, AI/ML, Web3 Infrastructure
   - Engineering, Product, Marketing, etc.

5. **Experience Level**
   - Exploring / early career
   - Mid-level
   - Senior / leadership
   - Founder / executive

6. **Skills & Strengths** (Tags, up to 10)

7. **Availability**
   - Actively looking for opportunities
   - Open to conversations
   - Limited availability
   - Not available right now

8. **Community Contribution**
   - Mentoring, Speaking, Volunteering, etc.

## UX Principles

### Language & Tone
- Use "right now" to allow evolution
- Avoid career-pressure framing
- Never say "required to access features"
- Reinforce value: "This helps us make better introductions"
- Always include: "You can change this anytime"

### Matching Transparency
Every match includes:
- Clear explanation of why you were matched
- Shared domains and interests
- Complementary intent description
- Confidence score

Example: "You both expressed mentorship intent in DeFi. Sarah is seeking mentorship as she transitions from TradFi, while you're offering mentorship to women entering DeFi."

## Technical Implementation

### Environment Variables
```
OPENAI_API_KEY=your-openai-api-key
```

### Dependencies
- `openai`: OpenAI API client
- `mongoose`: MongoDB ODM
- `express`: Web framework
- `jsonwebtoken`: Authentication

### AI Model
- **Model**: GPT-4o-mini
- **Temperature**: 0.3 (for intent analysis), 0.7 (for explanations)
- **Response Format**: JSON for structured data

## Best Practices

### For Developers

1. **Always validate consent** before matching
2. **Respect visibility settings** in all queries
3. **Generate explanations** for every match
4. **Handle intent evolution** gracefully
5. **Test with diverse intent statements**

### For Users

1. **Be specific** in your intent statement
2. **Update regularly** as goals change
3. **Review matches** and provide feedback
4. **Adjust visibility** based on comfort level
5. **Pause when needed** instead of deleting

## Future Enhancements

1. **Intent Decay**: Automatically prompt users to refresh stale intents
2. **Feedback Loop**: Learn from accepted/declined matches
3. **Multi-Intent Support**: Allow multiple active intents
4. **Intent History**: Track how intent evolves over time
5. **Smart Notifications**: AI-powered timing for match notifications
6. **Batch Matching**: Weekly digest of top matches
7. **Intent Strength**: Weight recent activity and engagement

## Support & Troubleshooting

### Common Issues

**Q: Why am I not getting matches?**
A: Check that:
- Your intent is active (not paused)
- You've consented to matching
- Your visibility is not set to private
- Your intent has clear domains/categories

**Q: How do I change my intent?**
A: Simply submit a new intent statement. The system will update your profile and regenerate matches.

**Q: Can I have multiple intents?**
A: Currently, you can have one active intent that can be "both" (seeking + offering). Future versions will support multiple distinct intents.

**Q: How long do matches last?**
A: Matches expire after 30 days if not acted upon. This keeps the system fresh and relevant.

## Contact

For technical support or questions about the intent system, please contact the development team.