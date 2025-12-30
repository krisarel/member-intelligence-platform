import express from 'express';
import User from '../models/User';
import { protect } from '../middleware/auth';

const router = express.Router();

// Get all users (for members directory)
router.get('/users', protect, async (_req, res) => {
  try {
    const users = await User.find(
      { onboardingCompleted: true },
      'firstName lastName email membershipTier onboarding.domainFocus onboarding.skills onboarding.experienceLevel onboarding.coreIntent createdAt'
    ).sort({ createdAt: -1 });

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      tier: user.membershipTier,
      headline: user.onboarding?.coreIntent?.substring(0, 100) || 'Member',
      bio: user.onboarding?.coreIntent || '',
      industry: user.onboarding?.domainFocus?.[0] || 'Web3',
      skills: user.onboarding?.skills || [],
      experienceLevel: user.onboarding?.experienceLevel || 'mid_level',
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
      memberSince: user.createdAt,
    }));

    res.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
});

// Get single user profile
router.get('/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const formattedUser = {
      id: user._id.toString(),
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      tier: user.membershipTier,
      headline: user.onboarding?.coreIntent?.substring(0, 100) || 'Member',
      bio: user.onboarding?.coreIntent || '',
      industry: user.onboarding?.domainFocus?.[0] || 'Web3',
      skills: user.onboarding?.skills || [],
      experienceLevel: user.onboarding?.experienceLevel || 'mid_level',
      domainFocus: user.onboarding?.domainFocus || [],
      intentModes: user.onboarding?.intentModes || [],
      availability: user.onboarding?.availability,
      contributionAreas: user.onboarding?.contributionAreas || [],
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
      memberSince: user.createdAt,
    };

    res.json({
      success: true,
      data: formattedUser,
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
});

export default router;