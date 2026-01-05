import { Router, Request, Response } from 'express';
import User from '../models/User';

const router = Router();

// Admin endpoint to seed database
// WARNING: This should be protected in production with proper authentication
router.post('/seed-database', async (req: Request, res: Response) => {
  try {
    // Simple security check - require a secret key
    const adminSecret = req.headers['x-admin-secret'];
    
    if (adminSecret !== process.env.ADMIN_SECRET) {
      res.status(403).json({
        status: 'error',
        message: 'Unauthorized - Invalid admin secret'
      });
      return;
    }

    // Create demo users matching the auth page
    const demoUsers = [
      {
        email: 'aliya@example.com',
        password: 'hellothere',
        firstName: 'Aliya',
        lastName: 'Johnson',
        role: 'member' as const,
        membershipTier: 'free' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'light' as const,
        onboardingCompleted: false,
        lastLoginAt: new Date(),
        onboarding: {
          intentModes: [],
          currentStep: 0,
        },
      },
      {
        email: 'maya@example.com',
        password: 'password123',
        firstName: 'Maya',
        lastName: 'Rodriguez',
        role: 'member' as const,
        membershipTier: 'vip' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'dark' as const,
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: 'I want to mentor women entering Web3 and connect with other senior leaders in the DeFi space.',
          intentModes: ['offering_mentorship', 'speaking', 'collaborating', 'hiring'],
          visibilityPreference: 'open' as const,
          domainFocus: ['DeFi', 'Web3 Infrastructure', 'Engineering'],
          experienceLevel: 'senior' as const,
          skills: ['Solidity', 'Tokenomics', 'Executive Leadership'],
          availability: 'open_to_conversations' as const,
          contributionAreas: ['Mentoring', 'Speaking', 'Advisory support'],
          currentStep: 8,
          completedAt: new Date(),
        },
      },
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }
      
      const user = await User.create(userData);
      createdUsers.push(user.email);
      console.log(`✅ Created user: ${user.email}`);
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Database seeded successfully',
      created: createdUsers,
      skipped: demoUsers.length - createdUsers.length
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

export default router;