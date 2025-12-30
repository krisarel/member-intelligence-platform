# Backend API Documentation

## Base URL
```
http://localhost:5001/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Job Listings API

### Create Job
**POST** `/api/jobs`
- **Auth Required**: Yes
- **Description**: Create a new job listing

**Request Body:**
```json
{
  "title": "Senior Software Engineer",
  "company": "Tech Corp",
  "description": "We are looking for...",
  "requirements": ["5+ years experience", "React", "Node.js"],
  "type": "remote",
  "location": "San Francisco, CA",
  "salary": {
    "min": 120000,
    "max": 180000,
    "currency": "USD"
  },
  "status": "active"
}
```

**Response:**
```json
{
  "message": "Job created successfully",
  "job": { ... }
}
```

---

### Get All Jobs
**GET** `/api/jobs`
- **Auth Required**: No
- **Description**: Get all job listings with optional filters

**Query Parameters:**
- `type`: Filter by job type (remote, hybrid, onsite)
- `status`: Filter by status (active, closed, draft) - defaults to "active"
- `company`: Filter by company name (case-insensitive)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Example:**
```
GET /api/jobs?type=remote&page=1&limit=10
```

**Response:**
```json
{
  "jobs": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### Get Job by ID
**GET** `/api/jobs/:id`
- **Auth Required**: No
- **Description**: Get a single job listing by ID

**Response:**
```json
{
  "job": {
    "_id": "...",
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "description": "...",
    "requirements": [...],
    "type": "remote",
    "postedBy": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "applicants": [...],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Update Job
**PUT** `/api/jobs/:id`
- **Auth Required**: Yes (must be job poster)
- **Description**: Update a job listing

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "closed"
}
```

**Response:**
```json
{
  "message": "Job updated successfully",
  "job": { ... }
}
```

---

### Delete Job
**DELETE** `/api/jobs/:id`
- **Auth Required**: Yes (must be job poster)
- **Description**: Delete a job listing

**Response:**
```json
{
  "message": "Job deleted successfully"
}
```

---

### Apply to Job
**POST** `/api/jobs/:id/apply`
- **Auth Required**: Yes
- **Description**: Apply to a job listing

**Response:**
```json
{
  "message": "Application submitted successfully"
}
```

---

### Get My Jobs
**GET** `/api/jobs/my/listings`
- **Auth Required**: Yes
- **Description**: Get all jobs posted by the authenticated user

**Response:**
```json
{
  "jobs": [...]
}
```

---

## Profile Management API

### Get My Profile
**GET** `/api/profile/me`
- **Auth Required**: Yes
- **Description**: Get the authenticated user's profile

**Response:**
```json
{
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "member",
    "onboarding": {
      "intentModes": ["networking", "job_seeking"],
      "visibilityPreference": "open",
      "domainFocus": ["technology", "startups"],
      "experienceLevel": "senior",
      "skills": ["JavaScript", "React", "Node.js"],
      "availability": "open_to_conversations",
      "contributionAreas": ["mentoring", "speaking"],
      "completedAt": "..."
    },
    "onboardingCompleted": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Update Profile
**PUT** `/api/profile/me`
- **Auth Required**: Yes
- **Description**: Update the authenticated user's profile

**Request Body:** (all fields optional)
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "onboarding": {
    "skills": ["Python", "Django", "PostgreSQL"],
    "availability": "actively_looking"
  }
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### Update Onboarding
**PUT** `/api/profile/onboarding`
- **Auth Required**: Yes
- **Description**: Complete or update onboarding data

**Request Body:**
```json
{
  "onboarding": {
    "intentModes": ["networking", "collaboration"],
    "visibilityPreference": "open",
    "domainFocus": ["AI", "Machine Learning"],
    "experienceLevel": "senior",
    "skills": ["Python", "TensorFlow", "PyTorch"],
    "availability": "open_to_conversations",
    "contributionAreas": ["mentoring", "open_source"]
  }
}
```

**Response:**
```json
{
  "message": "Onboarding completed successfully",
  "user": { ... }
}
```

---

### Get Public Profile
**GET** `/api/profile/:userId`
- **Auth Required**: Yes
- **Description**: Get a user's public profile (limited information)

**Response:**
```json
{
  "user": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "role": "member",
    "onboarding": { ... },
    "createdAt": "..."
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Missing required fields: ..."
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Not authorized to access this route. Please login."
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to update this job"
}
```

### 404 Not Found
```json
{
  "message": "Job not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error"
}
```

---

## Data Models

### Job Model
```typescript
{
  title: string;
  company: string;
  description: string;
  requirements: string[];
  type: 'remote' | 'hybrid' | 'onsite';
  location?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  postedBy: ObjectId; // User reference
  status: 'active' | 'closed' | 'draft';
  applicants?: ObjectId[]; // User references
  createdAt: Date;
  updatedAt: Date;
}
```

### User/Profile Model
```typescript
{
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  role: 'admin' | 'member';
  onboarding?: {
    intentModes: string[];
    visibilityPreference: 'open' | 'review' | 'limited';
    domainFocus: string[];
    experienceLevel?: 'exploring' | 'mid_level' | 'senior' | 'founder';
    skills?: string[];
    availability?: 'actively_looking' | 'open_to_conversations' | 'limited' | 'not_available';
    contributionAreas?: string[];
    completedAt?: Date;
  };
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}