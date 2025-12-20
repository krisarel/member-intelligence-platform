# PRODUCT REQUIREMENTS DOCUMENT

## EXECUTIVE SUMMARY

**Product Name:** Women in Web3 Switzerland Member Intelligence Platform

**Product Vision:** An internal member intelligence and connection platform that strengthens talent mobility, visibility, and opportunity for Women in Web3 Switzerland's 700+ global community through AI-powered recommendations, consent-based warm introductions, and curated job opportunities from corporate partners.

**Core Purpose:** Transform a nonprofit community into a high-trust professional network where women in Web3 and AI can discover meaningful connections, access exclusive opportunities, and build careers through community-led infrastructure while maintaining strong privacy safeguards and psychological safety.

**Target Users:** 
- **Primary:** Women working in Web3 and AI (free and VIP members)
- **Secondary:** Volunteer contributors and administrators facilitating nonprofit operations
- **Tertiary:** Corporate partner hiring leaders (Sygnum, BitGet, etc.)

**Key MVP Features:**
- Member Profile & Onboarding - User-Generated Content
- Connection Recommendations Engine - System Data
- Double Opt-In Warm Introductions - Communication
- Curated Job Board with Partner Access - User-Generated + Communication
- Membership Tier Management - Configuration

**Platform:** Web application (responsive, accessible via browser on all devices)

**Complexity Assessment:** Moderate
- State Management: Backend with localStorage cache for performance
- External Integrations: Email service (SendGrid/similar) for notifications - reduces complexity
- Business Logic: Moderate - recommendation matching algorithm, double opt-in workflow, tiered access controls

**MVP Success Criteria:**
- Members complete onboarding and receive personalized connection recommendations
- Double opt-in introduction workflow functions end-to-end with email notifications
- Job listings display with consent-based hiring leader access
- Membership tiers correctly gate features (Free vs VIP vs Admin)
- All CRUD operations work for profiles, introductions, and job applications
- Responsive design functions on mobile, tablet, and desktop

---

## 1. USERS & PERSONAS

**Primary Persona: Maya the Career Transitioner**
- **Context:** Mid-career professional (6 years experience) transitioning from traditional finance into Web3, recently joined as VIP member seeking mentorship and job opportunities
- **Goals:** Find relevant job openings at partner companies, connect with women who've made similar transitions, gain visibility to hiring leaders, build credibility in Web3 space
- **Pain Points:** Doesn't know who to reach out to in community, cold applications to Web3 companies go nowhere, lacks warm introductions despite paying for membership, Telegram channel moves too fast to track opportunities

**Secondary Persona: Sofia the Community Volunteer**
- **Context:** Active contributor managing events and content, has admin access, deeply connected within community, wants to facilitate meaningful connections
- **Goals:** Help members find each other, surface high-quality candidates to partners, maintain community trust and safety, reduce manual introduction coordination
- **Pain Points:** Spends hours manually connecting members via email, can't track introduction outcomes, no visibility into member skills/goals at scale, partner requests for candidates are ad-hoc

**Tertiary Persona: Elena the Hiring Leader**
- **Context:** Head of Engineering at partner company (Sygnum), active community member, posts jobs but gets overwhelmed by unqualified applicants
- **Goals:** Access pre-vetted talent pool, receive warm introductions to high-signal candidates, maintain professional boundaries, build long-term hiring pipeline
- **Pain Points:** Public job boards attract low-quality applications, doesn't want contact details exposed publicly, needs community facilitation for referrals, wants to give back but protect time

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core MVP Features (Priority 0)

**FR-001: Member Profile & Onboarding**
- **Description:** Progressive disclosure onboarding collecting identity, professional context, experience level, goals/intent, and visibility preferences; optional enrichment with skills, availability, and external links
- **Entity Type:** User-Generated Content
- **Operations:** Create (signup), View (own + others based on visibility), Edit (own profile), Delete (account deletion with 30-day grace), Export (GDPR compliance)
- **Key Rules:** Email is system of record; Telegram/LinkedIn never auto-exposed; profile completion meter shows benefits; all contact details hidden until consent
- **Acceptance:** Members complete signup with required fields, see profile completion percentage, can edit anytime, and control visibility settings

**FR-002: Connection Recommendations Engine**
- **Description:** AI-powered matching algorithm surfaces 5-10 recommended connections based on shared goals (highest weight), complementary skills, industry overlap, availability/intent, and geographic compatibility
- **Entity Type:** System Data
- **Operations:** View (personalized recommendations), Refresh (regenerate based on profile updates), Dismiss (hide specific recommendations)
- **Key Rules:** Recommendations refresh when profile updated; titles/companies are low-weight signals; only shows members with "open to intro requests" enabled
- **Acceptance:** Members see personalized recommendations on dashboard, can refresh list, and initiate introduction requests directly from recommendations

**FR-003: Double Opt-In Warm Introductions**
- **Description:** Consent-based introduction workflow where Member A requests intro to Member B, Member B accepts/declines, and only upon acceptance are contact details (email) shared via system notification
- **Entity Type:** Communication
- **Operations:** Create (request intro), View (pending/accepted/declined status), Edit (add context message), Cancel (withdraw pending request), Archive (hide completed intros)
- **Key Rules:** VIP members can initiate unlimited requests; Free members limited to 3/month; contact details never revealed without acceptance; 7-day expiration on pending requests
- **Acceptance:** Members request introductions with optional context, receive email notifications on status changes, and get contact details only after mutual acceptance

**FR-004: Curated Job Board with Partner Access**
- **Description:** Job listings from corporate partners with three access paths: standard application, warm intro request to hiring leader (double opt-in), and admin-facilitated referrals for high-signal candidates
- **Entity Type:** User-Generated Content (job listings) + Communication (intro requests)
- **Operations:** Create (admin posts jobs), View (all members see listings), Apply (submit application), Request Intro (to hiring leader - VIP only), Edit (admin updates jobs), Archive (close positions)
- **Key Rules:** Hiring leader contact details never displayed publicly; VIP-only jobs mirrored from Telegram; intro requests require hiring leader acceptance; admins can facilitate referrals
- **Acceptance:** Members browse jobs with filters, apply directly or request warm intros, and receive status updates; hiring leaders approve/decline intro requests

**FR-005: Membership Tier Management**
- **Description:** Role-based access control managing Free, VIP, Volunteer, Admin, and Super Admin tiers with graduated permissions and feature access
- **Entity Type:** Configuration
- **Operations:** View (own tier + benefits), Upgrade (Free to VIP), Downgrade (VIP to Free), Assign (admin grants roles), Revoke (admin removes roles)
- **Key Rules:** Free = 3 intros/month, view-only jobs; VIP = unlimited intros, priority placement, VIP-only jobs; Admins inherit VIP + operational permissions; Super Admins access analytics dashboard
- **Acceptance:** Members see tier-specific features, upgrade flow works end-to-end, and admins can manage member roles with audit trail

**FR-006: User Authentication & Account Management**
- **Description:** Secure registration, login, session management, password reset, and account deletion with 30-day grace period
- **Entity Type:** System/Configuration
- **Operations:** Register (create account), Login (authenticate), View (profile settings), Edit (update email/password), Reset (password recovery), Logout (end session), Delete (account removal)
- **Key Rules:** Email-based authentication; secure password storage; session persistence across devices; GDPR-compliant data export before deletion
- **Acceptance:** Users register with email verification, login securely, reset passwords via email, and delete accounts with confirmation

---

## 3. USER WORKFLOWS

### 3.1 Primary Workflow: Discovery to Warm Introduction

**Trigger:** VIP member Maya logs in seeking connections for career transition
**Outcome:** Maya successfully connects with mentor via double opt-in introduction

**Steps:**
1. Maya views dashboard and sees 8 personalized connection recommendations based on shared "mentorship" goal and "Web3 + Finance" background
2. Maya clicks on Sofia's profile, reads bio and skills, and clicks "Request Introduction" button
3. Maya adds context message: "Hi Sofia, I'm transitioning from TradFi to Web3 and would love to learn about your journey into DeFi protocols"
4. System sends email notification to Sofia with Maya's profile link, context message, and Accept/Decline buttons
5. Sofia clicks Accept in email, system reveals both members' email addresses via notification, and marks introduction as "Connected"
6. Maya and Sofia continue conversation via email outside platform
7. System archives introduction after 30 days and prompts Maya to mark outcome (Connected/No Response/Not Relevant)

### 3.2 Key Supporting Workflows

**Complete Onboarding:** User registers with email → verifies account → completes required fields (identity, professional context, experience, goals, visibility) → sees profile completion meter → optionally adds skills, availability, links → lands on dashboard with recommendations

**Browse Job Listings:** User navigates to Jobs page → applies filters (industry, function, experience level) → views job cards with company, role, description → clicks "Apply" or "Request Intro to Hiring Leader" (VIP only) → submits application or intro request → receives confirmation

**Accept Introduction Request:** User receives email notification → clicks link to view requester's profile and context message → clicks Accept or Decline → if Accept, system reveals contact details to both parties via email → introduction marked as Connected

**Admin Posts Job:** Admin navigates to Jobs admin panel → clicks "Create Job" → fills required fields (company, role, description, requirements, hiring leader) → sets visibility (All Members/VIP Only) → saves → job appears on board with "Posted by [Admin Name]"

**Upgrade to VIP:** Free member clicks "Upgrade to VIP" on dashboard → views benefits comparison (unlimited intros, priority placement, VIP jobs) → enters payment details → completes checkout → tier updated immediately → sees VIP badge on profile

---

## 4. BUSINESS RULES

### 4.1 Entity Lifecycle Rules

| Entity | Type | Who Creates | Who Edits | Who Deletes | Delete Action |
|--------|------|-------------|-----------|-------------|---------------|
| Member Profile | User-Generated | Self (signup) | Self | Self + Admin | Soft delete (30-day grace) |
| Introduction Request | Communication | Self (VIP unlimited, Free 3/month) | Self (add context) | Self (cancel pending) | Soft delete (archive after 30 days) |
| Job Listing | User-Generated | Admin only | Admin only | Admin only | Soft delete (archive when closed) |
| Job Application | User-Generated | Self | None | None | Permanent (audit trail) |
| Membership Tier | Configuration | System (signup) + Admin (assign) | Admin (upgrade/downgrade) | Admin (revoke) | Hard delete (role removal) |
| Recommendation | System Data | System (algorithm) | None | Self (dismiss) | Soft delete (hidden from view) |

### 4.2 Data Validation Rules

| Entity | Required Fields | Key Constraints |
|--------|-----------------|-----------------|
| Member Profile | Full name, email, country, industry focus, functional area, experience level, primary goals, visibility preferences | Email unique and verified; goals max 3 selections; visibility default "Public to members" |
| Introduction Request | Requester ID, recipient ID, status | Free tier max 3 pending requests; VIP unlimited; expires after 7 days if no response |
| Job Listing | Company, role title, description, hiring leader ID, visibility tier | Description min 100 chars; hiring leader must be active member; visibility default "All Members" |
| Job Application | Job ID, applicant ID, application date | One application per member per job; cannot edit after submission |
| Membership Tier | Member ID, tier type, effective date | Tier changes logged with timestamp and admin ID; downgrades take effect immediately |

### 4.3 Access & Process Rules

**Profile Visibility:**
- Public to members: Profile visible in search, recommendations, and directory
- Limited: Profile visible only in accepted introductions and direct links
- Hidden: Profile not discoverable but member can browse and initiate intros

**Introduction Request Limits:**
- Free members: 3 pending requests at any time (resets when accepted/declined/expired)
- VIP members: Unlimited pending requests
- All members: Cannot request intro to same person twice within 90 days

**Job Access Tiers:**
- All Members: Standard job listings visible to Free and VIP
- VIP Only: Exclusive opportunities mirrored from Telegram, higher-touch partner roles
- Warm Intro Access: VIP members can request intros to hiring leaders (double opt-in)

**Admin Permissions:**
- Admins inherit all VIP member features without bypassing consent safeguards
- Admins can create/edit/archive job listings and facilitate referrals
- Super Admins additionally access analytics dashboard (member activity, intro success rates, job application metrics)

**Data Retention:**
- Active profiles: Retained indefinitely while account active
- Deleted accounts: 30-day grace period, then permanent deletion with GDPR-compliant data export
- Archived introductions: Retained for 12 months for analytics, then purged
- Job applications: Retained permanently for audit trail (cannot be deleted by members)

---

## 5. DATA REQUIREMENTS

### 5.1 Core Entities

**User**
- **Type:** User-Generated Content | **Storage:** Backend database with localStorage cache
- **Key Fields:** id, email (unique), fullName, country, timezone, industryFocus (array), functionalArea (array), sectorExperience (array), yearsExperience, primaryGoals (array, max 3), visibilityPreference, membershipTier, isActive, createdAt, updatedAt
- **Relationships:** has many IntroductionRequests (as requester and recipient), has many JobApplications, has many JobListings (if admin), has many Recommendations
- **Lifecycle:** Full CRUD with 30-day soft delete grace period, GDPR-compliant data export, account deletion requires confirmation

**Profile Enrichment (extends User)**
- **Type:** User-Generated Content | **Storage:** Backend database
- **Key Fields:** userId, skills (array, max 10 tags), availability (enum: new role, freelance, advisory, mentorship), timeCommitment (enum: low, medium, high), linkedInUrl, personalWebsite, githubUrl, telegramHandle (hidden by default), interestedInVolunteering, priorInvolvement, profileCompletionScore, lastUpdated
- **Relationships:** belongs to User (one-to-one)
- **Lifecycle:** Create on first enrichment, Edit anytime, Delete cascades with User deletion, Export with User data

**IntroductionRequest**
- **Type:** Communication | **Storage:** Backend database
- **Key Fields:** id, requesterId, recipientId, status (enum: pending, accepted, declined, expired, cancelled), contextMessage, requestedAt, respondedAt, expiresAt (7 days from request), archivedAt, outcomeMarked (enum: connected, no response, not relevant)
- **Relationships:** belongs to User (requester), belongs to User (recipient)
- **Lifecycle:** Create (request), View (status tracking), Edit (add context before acceptance), Cancel (withdraw pending), Archive (auto after 30 days of acceptance), no hard delete (audit trail)

**JobListing**
- **Type:** User-Generated Content | **Storage:** Backend database
- **Key Fields:** id, companyName, roleTitle, description, requirements, hiringLeaderId, visibilityTier (enum: all members, VIP only), location, employmentType, experienceLevel, functionalArea, industryFocus, postedById (admin), postedAt, closedAt, isActive, applicantCount
- **Relationships:** belongs to User (hiring leader), belongs to User (posted by admin), has many JobApplications, has many IntroductionRequests (to hiring leader)
- **Lifecycle:** Create (admin only), View (tier-based access), Edit (admin only), Archive (close position), no hard delete (historical record)

**JobApplication**
- **Type:** User-Generated Content | **Storage:** Backend database
- **Key Fields:** id, jobId, applicantId, applicationDate, resumeUrl (optional), coverLetter (optional), status (enum: submitted, under review, interview, rejected, hired), statusUpdatedAt, statusUpdatedBy
- **Relationships:** belongs to JobListing, belongs to User (applicant)
- **Lifecycle:** Create (apply), View (own applications + admin view all), no Edit/Delete (immutable audit trail), status updates by admin only

**Recommendation**
- **Type:** System Data | **Storage:** Backend database with localStorage cache
- **Key Fields:** id, userId, recommendedUserId, matchScore (0-100), matchReasons (array: shared goals, complementary skills, industry overlap, etc.), generatedAt, dismissedAt, clickedAt
- **Relationships:** belongs to User (recipient), references User (recommended member)
- **Lifecycle:** Create (algorithm generates), View (personalized list), Dismiss (hide from view), Refresh (regenerate on profile update), auto-expire after 30 days

**MembershipTier**
- **Type:** Configuration | **Storage:** Backend database
- **Key Fields:** id, userId, tierType (enum: free, VIP, volunteer, admin, super admin), effectiveDate, expiresAt (null for non-expiring), grantedBy (admin ID), revokedAt, revokedBy, changeReason
- **Relationships:** belongs to User
- **Lifecycle:** Create (signup assigns Free), Edit (upgrade/downgrade), Revoke (admin removes role), full audit trail with timestamps and admin IDs

### 5.2 Data Storage Strategy

**Primary Storage:** Backend database (PostgreSQL or similar) for all persistent data
**Cache Layer:** localStorage for frequently accessed data (user profile, recommendations, job listings) to improve performance
**Capacity:** Backend scales with member growth; localStorage ~5MB per user for offline-first experience
**Persistence:** All data persists across sessions and devices via backend sync
**Audit Fields:** All entities include createdAt, updatedAt, createdBy, updatedBy for compliance and debugging

**Data Sync Strategy:**
- On login: Fetch latest profile, recommendations, pending intro requests
- On profile edit: Immediate backend save, localStorage update, trigger recommendation refresh
- On intro request: Real-time backend write, email notification sent, localStorage cache invalidated
- On job application: Immediate backend save, no localStorage (sensitive data)

---

## 6. INTEGRATION REQUIREMENTS

**SendGrid (or similar Email Service):**
- **Purpose:** Transactional email notifications for introduction requests, acceptances, job applications, and account management
- **Type:** Backend API calls (SMTP or REST API)
- **Data Exchange:** Sends recipient email, subject, body (HTML/text), sender name; Receives delivery status, open/click tracking
- **Trigger:** Introduction request created, introduction accepted/declined, job application submitted, password reset requested, account verification
- **Error Handling:** Retry failed sends up to 3 times; log failures to admin dashboard; fallback to in-app notifications if email delivery fails

**Recommendation Algorithm (Internal Service):**
- **Purpose:** Generate personalized connection recommendations based on member profiles and goals
- **Type:** Backend microservice or scheduled job
- **Data Exchange:** Receives user profile data (goals, skills, industry, experience); Returns ranked list of recommended user IDs with match scores and reasons
- **Trigger:** New member signup, profile update, manual refresh by user, nightly batch job for all active members
- **Error Handling:** Fallback to basic recommendations (same industry + goals) if algorithm fails; log errors for debugging

**Payment Gateway (Stripe or similar - Future):**
- **Purpose:** Process VIP membership upgrades and renewals
- **Type:** Frontend + Backend API integration
- **Data Exchange:** Sends payment amount, member email, subscription plan; Receives payment confirmation, subscription ID, webhook events
- **Trigger:** Member clicks "Upgrade to VIP" and completes checkout
- **Error Handling:** Display user-friendly error messages for failed payments; retry webhook processing; admin notification for failed renewals

---

## 7. VIEWS & NAVIGATION

### 7.1 Primary Views

**Dashboard** (`/`) - Personalized landing page showing 5-10 connection recommendations with match reasons, pending introduction requests (sent/received), recent job listings (3-5 cards), profile completion meter with CTA to enrich, and quick actions (Request Intro, Browse Jobs, Edit Profile)

**Member Directory** (`/members`) - Searchable/filterable list of all members respecting visibility preferences, with filters for industry, functional area, goals, experience level, and availability; each card shows name, headline, top 3 skills, and "Request Intro" button; pagination for performance

**Profile View** (`/members/:id`) - Full member profile displaying name, headline, bio, professional context (industry, function, experience), goals, skills, availability, and external links (if shared); "Request Introduction" CTA (if not self); edit button (if own profile); respects visibility settings

**Profile Edit** (`/profile/edit`) - Multi-step form for editing profile with sections: Identity & Contact, Professional Context, Experience Level, Goals & Intent, Visibility & Consent, Skills & Expertise (optional), Availability (optional), External Links (optional); profile completion meter at top; save/cancel buttons; real-time validation

**Introduction Requests** (`/introductions`) - Two tabs: Sent (requests initiated by user with status and actions) and Received (requests from others with Accept/Decline buttons); each request shows requester/recipient profile card, context message, timestamp, and status; archived intros hidden by default with "Show Archived" toggle

**Jobs Board** (`/jobs`) - Filterable job listings with cards showing company logo, role title, location, employment type, and "Apply" or "Request Intro" buttons (VIP only for latter); filters for industry, function, experience level, and visibility tier (VIP sees VIP-only jobs); detail view shows full description, requirements, and hiring leader info (name only, no contact)

**Job Detail** (`/jobs/:id`) - Full job description, requirements, company info, hiring leader name (no contact details), application count, and three CTAs: "Apply Directly" (opens application form), "Request Intro to Hiring Leader" (VIP only, opens intro request modal), "Save Job" (bookmark for later); shows application status if already applied

**Settings** (`/settings`) - Tabs for Account (email, password, delete account), Preferences (email notifications, visibility settings), Membership (current tier, benefits, upgrade CTA), and Data Export (GDPR-compliant download of all user data)

**Admin Panel** (`/admin`) - Admin-only view with tabs for Job Management (create/edit/archive jobs, view applications), Member Management (view all profiles, assign roles, view activity), and Analytics Dashboard (Super Admin only: intro success rates, job application metrics, member growth, engagement stats)

### 7.2 Navigation Structure

**Main Nav (Desktop):** Dashboard | Members | Jobs | Introductions | [User Menu: Profile, Settings, Logout]
**Main Nav (Mobile):** Hamburger menu with same links + VIP badge (if applicable) + Admin link (if admin)
**Default Landing:** Dashboard (post-login) or Marketing Page (pre-login)
**User Menu:** Profile photo/initials, name, membership tier badge, dropdown with Profile, Settings, Admin (if applicable), Logout
**Mobile:** Bottom navigation bar with Dashboard, Members, Jobs, Introductions icons; hamburger for secondary links

---

## 8. MVP SCOPE & CONSTRAINTS

### 8.1 MVP Success Definition

The MVP is successful when:
- ✅ Members complete progressive onboarding and see personalized connection recommendations on dashboard
- ✅ Double opt-in introduction workflow completes end-to-end with email notifications and contact detail reveal
- ✅ Job listings display with tier-based access and members can apply or request warm intros (VIP only)
- ✅ Membership tiers correctly gate features (Free 3 intros/month, VIP unlimited, Admin operational access)
- ✅ All entity lifecycle operations work (profile CRUD, intro request/accept/archive, job post/apply/close)
- ✅ Responsive design functions on mobile, tablet, and desktop browsers
- ✅ Data persists across sessions and devices via backend sync
- ✅ GDPR-compliant data export and account deletion with 30-day grace period

### 8.2 In Scope for MVP

Core features included:
- FR-001: Member Profile & Onboarding (progressive disclosure, profile completion meter)
- FR-002: Connection Recommendations Engine (AI-powered matching, refresh on profile update)
- FR-003: Double Opt-In Warm Introductions (request/accept/decline workflow, email notifications)
- FR-004: Curated Job Board with Partner Access (standard apply, warm intro to hiring leader, admin-facilitated referrals)
- FR-005: Membership Tier Management (Free, VIP, Volunteer, Admin, Super Admin with graduated permissions)
- FR-006: User Authentication & Account Management (register, login, password reset, account deletion)

**Additional MVP Inclusions:**
- Member Directory with search/filter (industry, function, goals, experience)
- Profile visibility controls (public, limited, hidden)
- Email notifications for intro requests, acceptances, and job applications
- Admin panel for job management and member role assignment
- Super Admin analytics dashboard (basic metrics: member count, intro success rate, job applications)
- GDPR-compliant data export and 30-day account deletion grace period

### 8.3 Technical Constraints

**Data Storage:** Backend database (PostgreSQL or similar) with localStorage cache for performance; backend scales with member growth
**Concurrent Users:** Expected 700+ members with ~50-100 daily active users initially; backend must handle 1,000+ concurrent users at scale
**Performance:** Page loads <2s on 3G connection; instant interactions for cached data; recommendation generation <5s
**Browser Support:** Chrome, Firefox, Safari, Edge (last 2 versions); responsive design for mobile browsers (iOS Safari, Android Chrome)
**Mobile:** Responsive web design (not native app); touch-friendly UI; bottom navigation for mobile; works offline with localStorage cache
**Offline:** Basic profile viewing and job browsing via localStorage cache; intro requests and applications require internet connection
**Email Deliverability:** Transactional emails must reach inbox (not spam); use reputable service (SendGrid, Mailgun) with proper SPF/DKIM setup
**Security:** HTTPS only; secure password storage (bcrypt); session tokens expire after 30 days; GDPR-compliant data handling

### 8.4 Known Limitations

**For MVP:**
- **Introduction Request Limits:** Free members capped at 3 pending requests to prevent spam; may frustrate highly active users
- **Recommendation Refresh:** Algorithm runs nightly batch job + on-demand refresh; not real-time as profiles update
- **Job Application Tracking:** Members see own application status but cannot edit/withdraw after submission (immutable audit trail)
- **No Multi-Device Sync for Drafts:** Profile edits and intro request drafts not synced across devices until saved to backend
- **Email-Only Notifications:** No in-app push notifications or SMS; relies on email delivery (risk of missed notifications if email fails)
- **No Advanced Search:** Member directory search limited to basic filters (industry, function, goals); no full-text search or boolean operators
- **Admin-Only Job Posting:** Members cannot self-post jobs; all listings curated by admins to maintain quality (may bottleneck partner onboarding)
- **No Messaging System:** Introductions reveal email addresses for external communication; no built-in chat (reduces platform stickiness)

**Future Enhancements (Post-MVP):**
- Real-time recommendation updates as profiles change
- In-app messaging system to keep conversations on platform
- Advanced search with full-text and boolean operators
- Member-initiated job postings with admin approval workflow
- Push notifications and SMS alerts for critical actions
- Multi-language support for global community
- Integration with Telegram for seamless opportunity mirroring
- LinkedIn OAuth for faster onboarding and profile enrichment
- Analytics dashboard for members (own intro success rate, profile views)
- Mentorship program matching and tracking

---

## 9. ASSUMPTIONS & DECISIONS

### 9.1 Platform Decisions

**Type:** Full-stack web application (frontend + backend)
**Storage:** Backend database (PostgreSQL) for persistent data + localStorage cache for performance and offline-first experience
**Auth:** Backend-based authentication with email/password; session tokens stored in localStorage; future OAuth (LinkedIn, Google) for faster onboarding
**Email Service:** SendGrid or similar for transactional emails (intro requests, acceptances, job applications, account management)

### 9.2 Entity Lifecycle Decisions

**Member Profile:** Full CRUD + 30-day soft delete grace period + GDPR-compliant data export
- **Reason:** User-generated content requiring full control; soft delete allows recovery from accidental deletion; GDPR compliance mandatory for EU members

**Introduction Request:** Create + View + Edit (context message) + Cancel (pending only) + Archive (auto after 30 days)
- **Reason:** Communication entity requiring consent-based workflow; edit allows adding context before acceptance; archive preserves audit trail without cluttering UI

**Job Listing:** Create (admin only) + View (tier-based) + Edit (admin only) + Archive (close position)
- **Reason:** Admin-curated content to maintain quality; no member deletion to preserve historical record; archive keeps closed jobs for reference

**Job Application:** Create + View only (no edit/delete)
- **Reason:** Immutable audit trail for compliance and fairness; prevents applicants from gaming system by editing after submission

**Recommendation:** Create (system) + View + Dismiss (hide) + Refresh (regenerate)
- **Reason:** System-generated data requiring no user editing; dismiss allows personalization without deleting; refresh on profile update ensures relevance

**Membership Tier:** Create (system on signup) + Edit (admin upgrade/downgrade) + Revoke (admin removes role) + Full audit trail
- **Reason:** Configuration entity requiring admin control; audit trail tracks tier changes for billing and compliance

### 9.3 Key Assumptions

**1. Email is Primary Communication Channel**
- **Reasoning:** User's product idea emphasizes "email is likely the most clean" for introductions; avoids complexity of in-app messaging for MVP; leverages existing email habits

**2. Double Opt-In Protects Community Trust**
- **Reasoning:** User explicitly chose double opt-in model for "strong GDPR posture, high-quality interactions, psychological safety"; aligns with nonprofit values and prevents spam

**3. VIP Tier Drives Revenue Without Compromising Safety**
- **Reasoning:** User clarified "Paid membership increases ability to initiate introductions but does not bypass consent"; unlimited intros for VIP balanced by double opt-in safeguards

**4. Admin-Curated Jobs Maintain Quality**
- **Reasoning:** User specified "curated job opportunities from corporate partners" with "direct access to hiring leadership"; admin curation prevents low-quality listings and protects partner relationships

**5. Progressive Onboarding Reduces Friction**
- **Reasoning:** User's detailed onboarding spec emphasizes "ask only for what creates immediate value" and "progressive disclosure model"; balances data collection with user experience

**6. Recommendation Algorithm Prioritizes Goals Over Titles**
- **Reasoning:** User specified "shared goals (highest weight)" and "titles and companies should be low-weight signals"; focuses on intent and compatibility over credentials

**7. Hiring Leader Contact Details Never Public**
- **Reasoning:** User emphasized "Do NOT expose hiring leader contact details directly" and "consent-based access model"; protects partner goodwill and prevents spam

**8. Free Tier Provides Value While Incentivizing Upgrade**
- **Reasoning:** User clarified "Free members have visibility and inbound access" but "VIP members gain agency"; 3 intro limit for Free balances access with upgrade incentive

### 9.4 Clarification Q&A Summary

**Q:** Should introductions follow double opt-in or open directory?
**A:** Double opt-in by default; profiles discoverable but contact details never revealed without explicit consent
**Decision:** Implemented double opt-in workflow with email notifications; Free tier limite