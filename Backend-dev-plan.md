
# Backend Development Plan

## 1️⃣ Executive Summary

**What Will Be Built:**
- FastAPI backend for Women in Web3 Switzerland Member Intelligence Platform
- RESTful API serving frontend with member profiles, connection recommendations, double opt-in introductions, job board, and membership tier management
- MongoDB Atlas database for all persistent data
- JWT-based authentication with email/password
- Background recommendation engine for AI-powered member matching

**Why:**
- Frontend currently uses dummy data in Zustand store
- Backend needed to persist data, enable multi-user access, and provide real-time updates
- Support 700+ members with secure, scalable infrastructure

**Constraints:**
- Python 3.13 + FastAPI (async)
- MongoDB Atlas only (no local instance)
- No Docker
- Manual testing after every task via frontend UI
- Single Git branch (`main`) workflow
- API base path: `/api/v1/*`

**Sprint Structure:**
- **S0:** Environment setup + frontend connection
- **S1:** Basic auth (signup/login/logout)
- **S2:** Member profiles + directory
- **S3:** Connection recommendations engine
- **S4:** Double opt-in introductions
- **S5:** Job board + applications
- **S6:** Admin features + tier management

---

## 2️⃣ In-Scope & Success Criteria

**In-Scope Features:**
- User authentication (signup, login, logout, JWT tokens)
- Member profile CRUD with visibility controls
- Member directory with search/filter
- AI-powered connection recommendations (refresh on profile update)
- Double opt-in introduction workflow with email notifications
- Job listings with tier-based access (Free vs VIP)
- Job applications + warm intro requests to hiring leaders
- Membership tier management (Free, VIP, Admin, SuperAdmin)
- Admin panel for job management and user role assignment
- Profile completion tracking

**Success Criteria:**
- All frontend features functional end-to-end
- All task-level manual tests pass via UI
- Each sprint's code pushed to `main` after verification
- MongoDB Atlas connection stable
- JWT auth working across all protected routes
- Email notifications sent for intro requests/responses
- Recommendation algorithm generates 5-10 matches per user
- Tier-based access controls enforced

---

## 3️⃣ API Design

**Base Path:** `/api/v1`

**Error Envelope:** `{ "error": "message" }`

### Health Check
- **GET** [`/healthz`](backend/main.py:1)
- Purpose: Health check with DB ping
- Response: `{ "status": "ok", "database": "connected" }`

### Authentication
- **POST** [`/api/v1/auth/signup`](backend/routes/auth.py:1)
- Purpose: Register new user
- Request: `{ "email": "user@example.com", "password": "secure123", "fullName": "Jane Doe" }`
- Response: `{ "user": {...}, "token": "jwt_token" }`
- Validation: Email unique, password min 8 chars

- **POST** [`/api/v1/auth/login`](backend/routes/auth.py:1)
- Purpose: Authenticate user
- Request: `{ "email": "user@example.com", "password": "secure123" }`
- Response: `{ "user": {...}, "token": "jwt_token" }`

- **POST** [`/api/v1/auth/logout`](backend/routes/auth.py:1)
- Purpose: Invalidate token (client-side primarily)
- Response: `{ "message": "Logged out successfully" }`

- **GET** [`/api/v1/auth/me`](backend/routes/auth.py:1)
- Purpose: Get current user profile
- Headers: `Authorization: Bearer <token>`
- Response: `{ "user": {...} }`

### Users/Profiles
- **GET** [`/api/v1/users`](backend/routes/users.py:1)
- Purpose: List all members (respects visibility)
- Query: `?search=keyword&industry=DeFi&functionalArea=Engineering`
- Response: `{ "users": [...] }`

- **GET** [`/api/v1/users/:id`](backend/routes/users.py:1)
- Purpose: Get single user profile
- Response: `{ "user": {...} }`

- **PATCH** [`/api/v1/users/me`](backend/routes/users.py:1)
- Purpose: Update own profile
- Request: `{ "headline": "New headline", "skills": ["Solidity", "React"] }`
- Response: `{ "user": {...} }`

- **PATCH** [`/api/v1/users/:id/tier`](backend/routes/users.py:1)
- Purpose: Update user tier (Admin only)
- Request: `{ "tier": "VIP" }`
- Response: `{ "user": {...} }`

### Recommendations
- **GET** [`/api/v1/recommendations`](backend/routes/recommendations.py:1)
- Purpose: Get personalized recommendations for current user
- Response: `{ "recommendations": [{ "user": {...}, "score": 85, "reasons": ["Shared Industry", "Shared Goals: Mentorship"] }] }`

- **POST** [`/api/v1/recommendations/refresh`](backend/routes/recommendations.py:1)
- Purpose: Regenerate recommendations
- Response: `{ "recommendations": [...] }`

### Introductions
- **GET** [`/api/v1/introductions`](backend/routes/introductions.py:1)
- Purpose: Get all introductions (sent + received)
- Query: `?type=sent|received&status=Pending|Accepted|Declined`
- Response: `{ "introductions": [...] }`

- **POST** [`/api/v1/introductions`](backend/routes/introductions.py:1)
- Purpose: Request introduction
- Request: `{ "toUserId": "user_id", "message": "Hi, I'd love to connect!" }`
- Response: `{ "introduction": {...} }`
- Validation: Free tier max 3 pending, VIP unlimited

- **PATCH** [`/api/v1/introductions/:id`](backend/routes/introductions.py:1)
- Purpose: Accept/decline introduction
- Request: `{ "status": "Accepted" }`
- Response: `{ "introduction": {...} }`
- Side Effect: Send email notification with contact details if accepted

### Jobs
- **GET** [`/api/v1/jobs`](backend/routes/jobs.py:1)
- Purpose: List jobs (tier-based filtering)
- Query: `?search=engineer&type=Full-time`
- Response: `{ "jobs": [...] }`

- **GET** [`/api/v1/jobs/:id`](backend/routes/jobs.py:1)
- Purpose: Get single job
- Response: `{ "job": {...} }`

- **POST** [`/api/v1/jobs`](backend/routes/jobs.py:1)
- Purpose: Create job (Admin only)
- Request: `{ "title": "Senior Engineer", "company": "Sygnum", "description": "...", "requirements": [...], "location": "Zurich", "type": "Full-time", "isVipOnly": true, "hiringLeaderId": "user_id" }`
- Response: `{ "job": {...} }`

- **POST** [`/api/v1/jobs/:id/apply`](backend/routes/jobs.py:1)
- Purpose: Apply to job
- Response: `{ "application": {...} }`
- Validation: One application per user per job

---

## 4️⃣ Data Model (MongoDB Atlas)

### Collection: `users`
**Fields:**
- `_id`: ObjectId (auto)
- `email`: string (unique, required)
- `passwordHash`: string (required, Argon2)
- `fullName`: string (required)
- `tier`: enum (Free, VIP, Admin, SuperAdmin) (default: Free)
- `headline`: string (optional)
- `bio`: string (optional)
- `avatar`: string (optional, URL)
- `industry`: string (optional)
- `functionalArea`: string (optional)
- `experienceLevel`: string (optional)
- `skills`: array of strings (default: [])
- `goals`: array of strings (default: [])
- `visibility`: enum (Public, Limited, Hidden) (default: Public)
- `linkedInUrl`: string (optional)
- `telegramHandle`: string (optional)
- `location`: string (optional)
- `createdAt`: datetime (auto)
- `updatedAt`: datetime (auto)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "maya@example.com",
  "passwordHash": "$argon2id$v=19$m=65536...",
  "fullName": "Maya Web3",
  "tier": "VIP",
  "headline": "DeFi Strategist",
  "industry": "DeFi",
  "skills": ["Strategy", "Governance"],
  "goals": ["Mentorship", "Networking"],
  "visibility": "Public",
  "location": "Zurich",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### Collection: `introductions`
**Fields:**
- `_id`: ObjectId (auto)
- `fromUserId`: ObjectId (required, ref users)
- `toUserId`: ObjectId (required, ref users)
- `status`: enum (Pending, Accepted, Declined) (default: Pending)
- `message`: string (required)
- `createdAt`: datetime (auto)
- `updatedAt`: datetime (auto)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "fromUserId": "507f1f77bcf86cd799439011",
  "toUserId": "507f1f77bcf86cd799439013",
  "status": "Pending",
  "message": "Hi Sofia, I'd love to connect!",
  "createdAt": "2025-01-15T11:00:00Z",
  "updatedAt": "2025-01-15T11:00:00Z"
}
```

### Collection: `jobs`
**Fields:**
- `_id`: ObjectId (auto)
- `title`: string (required)
- `company`: string (required)
- `description`: string (required, min 100 chars)
- `requirements`: array of strings (required)
- `location`: string (required)
- `type`: enum (Full-time, Part-time, Contract, Freelance) (required)
- `isVipOnly`: boolean (default: false)
- `hiringLeaderId`: ObjectId (optional, ref users)
- `postedById`: ObjectId (required, ref users)
- `postedAt`: datetime (auto)
- `applicants`: array of ObjectIds (default: [], ref users)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "title": "Senior Smart Contract Engineer",
  "company": "Sygnum",
  "description": "We are looking for an experienced engineer...",
  "requirements": ["5+ years dev experience", "Solidity expert"],
  "location": "Zurich / Remote",
  "type": "Full-time",
  "isVipOnly": true,
  "hiringLeaderId": "507f1f77bcf86cd799439013",
  "postedById": "507f1f77bcf86cd799439011",
  "postedAt": "2025-01-15T09:00:00Z",
  "applicants": []
}
```

### Collection: `recommendations`
**Fields:**
- `_id`: ObjectId (auto)
- `userId`: ObjectId (required, ref users)
- `recommendedUserId`: ObjectId (required, ref users)
- `score`: int (0-100)
- `reasons`: array of strings
- `generatedAt`: datetime (auto)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "userId": "507f1f77bcf86cd799439011",
  "recommendedUserId": "507f1f77bcf86cd799439013",
  "score": 85,
  "reasons": ["Shared Industry: DeFi", "Shared Goals: Mentorship"],
  "generatedAt": "2025-01-15T10:30:00Z"
}
```

---

## 5️⃣ Frontend Audit & Feature Map

### Dashboard ([`/`](frontend/app/page.tsx:1))
- **Purpose:** Personalized landing with recommendations, stats, recent jobs
- **Data Needed:** Current user, recommendations (5-10), pending intro count, recent jobs (3)
- **Backend Endpoints:**
  - [`GET /api/v1/auth/me`](backend/routes/auth.py:1)
  - [`GET /api/v1/recommendations`](backend/routes/recommendations.py:1)
  - [`GET /api/v1/introductions?status=Pending`](backend/routes/introductions.py:1)
  - [`GET /api/v1/jobs?limit=3`](backend/routes/jobs.py:1)
- **Auth:** Required (JWT)

### Login ([`/login`](frontend/app/login/page.tsx:1))
- **Purpose:** User authentication
- **Data Needed:** Email, password
- **Backend Endpoints:**
  - [`POST /api/v1/auth/login`](backend/routes/auth.py:1)
- **Auth:** None

### Register ([`/register`](frontend/app/register/page.tsx:1))
- **Purpose:** New user signup
- **Data Needed:** Email, password, fullName
- **Backend Endpoints:**
  - [`POST /api/v1/auth/signup`](backend/routes/auth.py:1)
- **Auth:** None

### Member Directory ([`/members`](frontend/app/members/page.tsx:1))
- **Purpose:** Browse all members with search/filter
- **Data Needed:** All users (respecting visibility), search query, industry filter
- **Backend Endpoints:**
  - [`GET /api/v1/users?search=keyword&industry=DeFi`](backend/routes/users.py:1)
  - [`POST /api/v1/introductions`](backend/routes/introductions.py:1) (request intro)
- **Auth:** Required (JWT)

### Profile View ([`/profile`](frontend/app/profile/page.tsx:1))
- **Purpose:** View/edit own profile
- **Data Needed:** Current user full profile
- **Backend Endpoints:**
  - [`GET /api/v1/auth/me`](backend/routes/auth.py:1)
  - [`PATCH /api/v1/users/me`](backend/routes/users.py:1)
- **Auth:** Required (JWT)

### Introductions ([`/introductions`](frontend/app/introductions/page.tsx:1))
- **Purpose:** Manage sent/received intro requests
- **Data Needed:** All introductions (sent + received), user details for each
- **Backend Endpoints:**
  - [`GET /api/v1/introductions`](backend/routes/introductions.py:1)
  - [`PATCH /api/v1/introductions/:id`](backend/routes/introductions.py:1) (accept/decline)
- **Auth:** Required (JWT)
- **Notes:** Contact details revealed only after acceptance

### Jobs Board ([`/jobs`](frontend/app/jobs/page.tsx:1))
- **Purpose:** Browse job listings with tier-based access
- **Data Needed:** All jobs (filtered by tier), search query
- **Backend Endpoints:**
  - [`GET /api/v1/jobs?search=engineer`](backend/routes/jobs.py:1)
  - [`POST /api/v1/jobs/:id/apply`](backend/routes/jobs.py:1)
  - [`POST /api/v1/introductions`](backend/routes/introductions.py:1) (warm intro to hiring leader)
- **Auth:** Required (JWT)
- **Notes:** VIP-only jobs hidden from Free tier

### Admin Panel ([`/admin`](frontend/app/admin/page.tsx:1))
- **Purpose:** Job management, user role assignment, analytics
- **Data Needed:** All users, all jobs, intro stats
- **Backend Endpoints:**
  - [`GET /api/v1/users`](backend/routes/users.py:1)
  - [`PATCH /api/v1/users/:id/tier`](backend/routes/users.py:1)
  - [`POST /api/v1/jobs`](backend/routes/jobs.py:1)
  - [`GET /api/v1/jobs`](backend/routes/jobs.py:1)
- **Auth:** Required (Admin/SuperAdmin only)

---

## 6️⃣ Configuration & ENV Vars

**Core Environment Variables:**
- `APP_ENV` — environment (development, production)
- `PORT` — HTTP port (default: 8000)
- `MONGODB_URI` — MongoDB Atlas connection string (required)
- `JWT_SECRET` — token signing key (required, min 32 chars)
- `JWT_EXPIRES_IN` — seconds before JWT expiry (default: 2592000 = 30 days)
- `CORS_ORIGINS` — allowed frontend URL(s) (comma-separated)
- `SENDGRID_API_KEY` — email service API key (optional for MVP, required for production)
- `SENDGRID_FROM_EMAIL` — sender email address

**Example `.env` file:**
```
APP_ENV=development
PORT=8000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/wiw3ch?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-min-32-characters-long
JWT_EXPIRES_IN=2592000
CORS_ORIGINS=http://localhost:3000,https://app.wiw3ch.com
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@wiw3ch.com
```

---

## 7️⃣ Background Work

### Recommendation Generation
- **Trigger:** User profile update, new user signup, nightly batch job
- **Purpose:** Generate 5-10 personalized connection recommendations
- **Algorithm:**
  - Shared goals (highest weight: +15 per match)
  - Shared industry (+20)
  - Complementary skills (+10)
  - Geographic proximity (+5)
  - Randomize slightly for diversity
- **Idempotency:** Overwrite existing recommendations for user
- **UI Check:** Frontend calls [`GET /api/v1/recommendations`](backend/routes/recommendations.py:1) to fetch latest
- **Implementation:** Synchronous function called after profile update, no background queue needed for MVP

---

## 8️⃣ Integrations

### SendGrid Email Service
- **Purpose:** Transactional emails for intro requests, acceptances, password reset
- **Flow:**
  1. User requests intro → backend creates intro record
  2. Backend calls SendGrid API to send email to recipient
  3. Email contains Accept/Decline links (magic tokens or direct to app)
  4. Recipient clicks Accept → frontend calls [`PATCH /api/v1/introductions/:id`](backend/routes/introductions.py:1)
  5. Backend sends confirmation email to both parties with contact details
- **Extra ENV Vars:** `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
- **Error Handling:** Log failures, retry up to 3 times, fallback to in-app notification

---

## 9️⃣ Testing Strategy (Manual via Frontend)

**Validation Approach:**
- Every task includes **Manual Test Step** (exact UI action + expected result)
- Every task includes **User Test Prompt** (copy-paste instruction)
- After all tasks in sprint pass → commit and push to `main`
- If any fail → fix and retest before pushing

**Example Test Format:**
- **Manual Test Step:** Click "Request Intro" on Sofia's profile → modal opens → enter message → submit → toast shows "Introduction requested to Sofia"
- **User Test Prompt:** "Request an introduction to Sofia from the member directory and confirm the success toast appears."

---

## 🔟 Dynamic Sprint Plan & Backlog

---

## 🧱 S0 – Environment Setup & Frontend Connection

**Objectives:**
- Create FastAPI skeleton with [`/healthz`](backend/main.py:1) and [`/api/v1`](backend/main.py:1) base
- Connect to MongoDB Atlas using `MONGODB_URI`
- [`/healthz`](backend/main.py:1) performs DB ping and returns JSON status
- Enable CORS for frontend
- Replace dummy API URLs in frontend with real backend URLs
- Initialize Git at root, set default branch to `main`, push to GitHub
- Create single [`.gitignore`](backend/.gitignore:1) at root

**User Stories:**
- As a developer, I can run the backend locally and see health check succeed
- As a frontend, I can call [`/healthz`](backend/main.py:1) and receive DB connection status
- As a developer, I can push code to GitHub `main` branch

**Tasks:**

1. **Create FastAPI project structure**
   - Create [`backend/`](backend/:1) directory
   - Create [`backend/main.py`](backend/main.py:1) with FastAPI app
   - Create [`backend/requirements.txt`](backend/requirements.txt:1) with dependencies: `fastapi`, `uvicorn[standard]`, `motor`, `pydantic`, `pydantic-settings`, `python-jose[cryptography]`, `passlib[argon2]`, `python-multipart`, `sendgrid`
   - Create [`backend/.env.example`](backend/.env.example:1) with all required env vars
   - Manual Test Step: Run `pip install -r requirements.txt` → all packages install successfully
   - User Test Prompt: "Install backend dependencies and confirm no errors."

2. **Implement health check endpoint**
   - Add [`GET /healthz`](backend/main.py:1) route
   - Connect to MongoDB Atlas using Motor (async driver)
   - Perform DB ping in health check
   - Return `{ "status": "ok", "database": "connected" }` or error
   - Manual Test Step: Run `uvicorn backend.main:app --reload` → visit `http://localhost:8000/healthz` → see `{"status":"ok","database":"connected"}`
   - User Test Prompt: "Start the backend and navigate to /healthz in your browser. Confirm the response shows database connected."

3. **Configure CORS for frontend**
   - Add CORS middleware to FastAPI app
   - Allow origins from `CORS_ORIGINS` env var
   - Allow credentials, all methods, all headers
   - Manual Test Step: Frontend running on `localhost:3000` → can call `localhost:8000/healthz` without CORS error
   - User Test Prompt: "With both frontend and backend running, open browser console and verify no CORS errors when calling /healthz."

4. **Initialize Git repository**
   - Run `git init` at project root (if not already initialized)
   - Set default branch to `main`: `git branch -M main`
   - Create [`.gitignore`](backend/.gitignore:1) at root: ignore `__pycache__`, `.env`, `*.pyc`, `.DS_Store`, `node_modules`, `.next`
   - Add all files: `git add .`
   - Commit: `git commit -m "S0: Initial backend setup with health check"`
   - Create GitHub repo and push: `git remote add origin <url>` → `git push -u origin main`
   - Manual Test Step: Visit GitHub repo → see initial commit with backend files
   - User Test Prompt: "Push the initial commit to GitHub and confirm the repository is live with all backend files."

**Definition of Done:**
- Backend runs locally on port 8000
- [`/healthz`](backend/main.py:1) returns 200 OK with DB connection status
- MongoDB Atlas connection successful
- CORS enabled for frontend origin
- Git repo initialized with `main` branch
- Code pushed to GitHub

---

## 🧩 S1 – Basic Auth (Signup / Login / Logout)

**Objectives:**
- Implement JWT-based signup, login, and logout
- Store users in MongoDB with hashed passwords (Argon2)
- Protect one backend route + one frontend page

**User Stories:**
- As a new user, I can sign up with email/password and receive a JWT token
- As a returning user, I can log in and access protected pages
- As a logged-in user, I can log out and lose access to protected pages

**Endpoints:**
- [`POST /api/v1/auth/signup`](backend/routes/auth.py:1)
- [`POST /api/v1/auth/login`](backend/routes/auth.py:1)
- [`POST /api/v1/auth/logout`](backend/routes/auth.py:1)
- [`GET /api/v1/auth/me`](backend/routes/auth.py:1)

**Tasks:**

1. **Create User model and auth utilities**
   - Create [`backend/models/user.py`](backend/models/user.py:1) with Pydantic model for User
   - Create [`backend/utils/auth.py`](backend/utils/auth.py:1) with functions: `hash_password()`, `verify_password()`, `create_jwt_token()`, `decode_jwt_token()`
   - Use Argon2 for password hashing
   - Use `python-jose` for JWT encoding/decoding
   - Manual Test Step: Run Python REPL → import functions → hash password → verify password → create/decode token → all work correctly
   - User Test Prompt: "Test auth utilities in Python REPL: hash a password, verify it, create a JWT token, and decode it. Confirm all operations succeed."

2. **Implement signup endpoint**
   - Create [`backend/routes/auth.py`](backend/routes/auth.py:1)
   - Add [`POST /api/v1/auth/signup`](backend/routes/auth.py:1) route
   - Validate email uniqueness in MongoDB
   - Hash password with Argon2
   - Insert user into `users` collection with default tier `Free`
   - Return user object + JWT token
   - Manual Test Step: Use Postman/curl → POST to `/api/v1/auth/signup` with `{"email":"test@example.com","password":"secure123","fullName":"Test User"}` → receive 201 with user + token
   - User Test Prompt: "Sign up via the frontend registration page. Confirm you receive a success message and are redirected to the dashboard."

3. **Implement login endpoint**
   - Add [`POST /api/v1/auth/login`](backend/routes/auth.py:1) route
   - Find user by email in MongoDB
   - Verify password with Argon2
   - Return user object + JWT token
   - Manual Test Step: Use Postman/curl → POST to `/api/v1/auth/login` with existing user credentials → receive 200 with user + token
   - User Test Prompt: "Log in via the frontend login page with maya@example.com. Confirm you are redirected to the dashboard."

4. **Implement logout endpoint**
   - Add [`POST /api/v1/auth/logout`](backend/routes/auth.py:1) route
   - Return success message (token invalidation handled client-side)
   - Manual Test Step: Call logout endpoint → receive 200 OK
   - User Test Prompt: "Click logout in the frontend. Confirm you are redirected to the login page."

5. **Implement protected route middleware**
   - Create [`backend/middleware/auth.py`](backend/middleware/auth.py:1) with JWT verification dependency
   - Add [`GET /api/v1/auth/me`](backend/routes/auth.py:1) route (protected)
   - Return current user from JWT token
   - Manual Test Step: Call `/api/v1/auth/me` with valid token → receive user object; call without token → receive 401
   - User Test Prompt: "After logging in, refresh the dashboard. Confirm your profile data loads correctly."

6. **Update frontend to use real auth endpoints**
   - Replace Zustand mock login/logout with API calls
   - Store JWT token in localStorage
   - Add token to all API requests via Authorization header
   - Manual Test Step: Sign up → log in → access dashboard → log out → try to access dashboard → redirected to login
   - User Test Prompt: "Complete the full auth flow: sign up, log in, access dashboard, log out, and confirm you cannot access dashboard without logging in again."

**Definition of Done:**
- Signup, login, logout work end-to-end via frontend
- JWT tokens issued and verified correctly
- Protected routes require valid token
- Passwords hashed with Argon2
- Users stored in MongoDB `users` collection

**Post-sprint:**
- Commit: `git commit -m "S1: Implement JWT auth (signup/login/logout)"`
- Push: `git push origin main`

---

## 🧱 S2 – Member Profiles & Directory

**Objectives:**
- Implement profile CRUD operations
- Build member directory with search/filter
- Respect visibility settings (Public, Limited, Hidden)

**User Stories:**
- As a user, I can view and edit my profile
- As a user, I can browse the member directory with search/filter
- As a user, I can view other members' profiles (respecting visibility)

**Endpoints:**
- [`GET /api/v1/users`](backend/routes/users.py:1)
- [`GET /api/v1/users/:id`](backend/routes/users.py:1)
- [`PATCH /api/v1/users/me`](backend/routes/users.py:1)

**Tasks:**

1. **Implement get current user profile**
   - Already done in S1 ([`GET /api/v1/auth/me`](backend/routes/auth.py:1))
   - Manual Test Step: Call `/api/v1/auth/me` with token → receive full user profile
   - User Test Prompt: "Navigate to your profile page and confirm all your data displays correctly."

2. **Implement update profile endpoint**
   - Create [`backend/routes/users.py`](backend/routes/users.py:1)
   - Add [`PATCH /api/v1/users/me`](backend/routes/users.py:1) route (protected)
   - Allow updating: `headline`, `bio`, `industry`, `functionalArea`, `experienceLevel`, `skills`, `goals`, `visibility`, `linkedInUrl`, `telegramHandle`, `location`
   - Update `updatedAt` timestamp
   - Return updated user object
   - Manual Test Step: Edit profile in frontend → save → see updated data immediately
   - User Test Prompt: "Edit your headline and bio in the profile page, save, and confirm the changes persist after refresh."

3. **Implement member directory endpoint**
   - Add [`GET /api/v1/users`](backend/routes/users.py:1) route (protected)
   - Filter by visibility: exclude `Hidden` profiles, include `Public` and `Limited` (if user has accepted intro)
   - Support query params: `?search=keyword&industry=DeFi&functionalArea=Engineering`
   - Search across `fullName`, `headline`, `skills`
   - Return array of user objects (exclude `passwordHash`)
   - Manual Test Step: Call `/api/v1/users?search=engineer` → receive filtered list
   - User Test Prompt: "Search for 'engineer' in the member directory and confirm relevant results appear."

4. **Implement get single user profile**
   - Add [`GET /api/v1/users/:id`](backend/routes/users.py:1) route (protected)
   - Respect visibility: return full profile if `Public`, limited if `Limited` and no intro, error if `Hidden`
   - Return user object (exclude `passwordHash`, `email` unless intro accepted)
   - Manual Test Step: Click on a member card in directory → see full profile page
   - User Test Prompt: "Click on a member in the directory and confirm their profile page loads with all visible details."

5. **Update frontend to use real profile endpoints**
   - Replace Zustand mock profile data with API calls
   - Update profile edit form to call [`PATCH /api/v1/users/me`](backend/routes/users.py:1)
   - Update member directory to call [`GET /api/v1/users`](backend/routes/users.py:1)
   - Manual Test Step: Browse directory → search/filter → view profiles → edit own profile → all work correctly
