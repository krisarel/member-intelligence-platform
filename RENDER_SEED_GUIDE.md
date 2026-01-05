# Seeding Production Database on Render

## Quick Guide

After deploying your application to Render, you need to seed the production database with demo users.

### Step 1: Deploy to Render

1. Push your code to GitHub:
```bash
git add .
git commit -m "Add admin seed endpoint and demo users"
git push origin main
```

2. Render will automatically deploy your changes

### Step 2: Set Environment Variables on Render

In your Render dashboard for the **backend service**, add this environment variable:

```
ADMIN_SECRET=your-super-secret-admin-key-change-this-in-production
```

**Important:** Use a strong, unique secret key for production!

### Step 3: Seed the Production Database

Once your backend is deployed and running, use this curl command to seed the database:

```bash
curl -X POST https://member-intelligence-platform-backend.onrender.com/api/admin/seed-database \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: your-super-secret-admin-key-change-this-in-production"
```

Replace `your-super-secret-admin-key-change-this-in-production` with the actual secret you set in Render.

### Expected Response

```json
{
  "status": "success",
  "message": "Database seeded successfully",
  "created": ["aliya@example.com", "maya@example.com"],
  "skipped": 0
}
```

### Demo Accounts Created

After seeding, these accounts will be available:

1. **aliya@example.com** / **hellothere**
   - Free tier member
   - Requires onboarding (for testing onboarding flow)

2. **maya@example.com** / **password123**
   - VIP tier member
   - Onboarding completed (skip to dashboard)

## Troubleshooting

### "Unauthorized - Invalid admin secret"
- Check that `ADMIN_SECRET` is set correctly in Render dashboard
- Ensure the header value matches exactly

### "Failed to seed database"
- Check that `MONGODB_URI` is set correctly in Render
- Verify MongoDB Atlas allows connections from Render (0.0.0.0/0 or Render's IP ranges)
- Check backend logs in Render dashboard for specific error

### Users Already Exist
If you run the seed command multiple times, it will skip existing users:
```json
{
  "status": "success",
  "message": "Database seeded successfully",
  "created": [],
  "skipped": 2
}
```

## Security Note

**Important:** The admin seed endpoint is protected by a secret key. Make sure to:
1. Use a strong, unique secret in production
2. Never commit the secret to your repository
3. Only share the secret with authorized team members
4. Consider removing or disabling this endpoint after initial setup

## Alternative: Manual Seeding via Render Shell

If you prefer, you can also seed the database using Render's shell:

1. Go to your backend service in Render dashboard
2. Click "Shell" tab
3. Run: `npm run seed`

This will run the full seed script with all 51 users.