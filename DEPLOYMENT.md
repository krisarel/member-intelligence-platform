# Deployment Guide for Member Intelligence Platform

## Overview
This guide covers deploying the Member Intelligence Platform to Render.com using the included `render.yaml` configuration.

## Prerequisites
- GitHub repository connected to Render
- MongoDB Atlas database (or other MongoDB hosting)
- OpenAI API key
- Render.com account

## Deployment Issues Fixed

### Previous Errors
The deployment was failing because:
1. **Wrong runtime detected**: Render was detecting Python instead of Node.js
2. **Missing root directory**: The `backend` directory wasn't properly configured
3. **Missing requirements.txt**: Render was looking for Python dependencies

### Solution
Created a `render.yaml` file that explicitly configures:
- Node.js runtime for both backend and frontend
- Correct root directories (`backend/` and `frontend/`)
- Proper build and start commands
- Environment variables

## Deployment Steps

### 1. Push Changes to GitHub
```bash
git add render.yaml backend/src/app.ts DEPLOYMENT.md
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Configure Render Dashboard

#### Option A: Using render.yaml (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Configure environment variables (see below)
6. Click "Apply"

#### Option B: Manual Service Creation
If you prefer manual setup:

**Backend Service:**
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `member-intelligence-backend`
   - **Runtime**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

**Frontend Service:**
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `member-intelligence-frontend`
   - **Runtime**: Node
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3. Configure Environment Variables

#### Backend Environment Variables
Set these in the Render dashboard for your backend service:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secure-jwt-secret>
OPENAI_API_KEY=<your-openai-api-key>
FRONTEND_URL=<your-frontend-render-url>
```

**Important Notes:**
- `PORT` is automatically set by Render to 10000
- `MONGODB_URI` should be your MongoDB Atlas connection string
- `JWT_SECRET` should be a long, random string (generate with: `openssl rand -base64 32`)
- `FRONTEND_URL` will be provided after frontend deployment (e.g., `https://member-intelligence-frontend.onrender.com`)

#### Frontend Environment Variables
Set these in the Render dashboard for your frontend service:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=<your-backend-render-url>
```

**Important Notes:**
- `NEXT_PUBLIC_API_URL` should be your backend URL (e.g., `https://member-intelligence-backend.onrender.com`)

### 4. MongoDB Atlas Configuration

Ensure your MongoDB Atlas cluster allows connections from Render:
1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (allows all IPs - for production, use Render's IP ranges)
3. Or add Render's specific IP addresses for better security

### 5. Verify Deployment

After deployment completes:

**Backend Health Check:**
```bash
curl https://your-backend-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "API is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Frontend:**
Visit your frontend URL in a browser to verify it loads correctly.

## Project Structure

```
member-intelligence-platform/
├── render.yaml              # Render deployment configuration
├── backend/                 # Backend API (Node.js/Express/TypeScript)
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── frontend/                # Frontend (Next.js/React/TypeScript)
    ├── app/
    ├── components/
    ├── package.json
    └── next.config.ts
```

## Health Check Endpoints

The backend includes health check endpoints for monitoring:
- `/health` - Basic health check
- `/api/health` - API-specific health check (used by Render)

## Troubleshooting

### Build Fails
- Check that `package.json` exists in both `backend/` and `frontend/` directories
- Verify all dependencies are listed in `package.json`
- Check build logs for specific errors

### Runtime Errors
- Verify all environment variables are set correctly
- Check that MongoDB connection string is valid
- Ensure MongoDB Atlas allows connections from Render

### Connection Issues
- Verify `FRONTEND_URL` in backend matches your frontend URL
- Verify `NEXT_PUBLIC_API_URL` in frontend matches your backend URL
- Check CORS configuration in backend

### Free Tier Limitations
Render's free tier has some limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month of runtime per service

## Updating Deployment

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically detect the push and redeploy your services.

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/deploy-node-express-app)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)