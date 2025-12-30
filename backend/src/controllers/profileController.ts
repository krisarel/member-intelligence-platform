import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Get authenticated user's profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update authenticated user's profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updates = req.body;

    const user = await User.findById(req.user!._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update allowed fields
    const allowedUpdates = [
      'firstName',
      'lastName',
      'onboarding',
      'onboardingCompleted',
    ];

    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (user as any)[key] = updates[key];
      }
    });

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get public profile by user ID
export const getPublicProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password -email');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Only return public information
    const publicProfile = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      onboarding: user.onboarding,
      createdAt: user.createdAt,
    };

    res.json({ user: publicProfile });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update onboarding data
export const updateOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { onboarding } = req.body;

    if (!onboarding) {
      res.status(400).json({ message: 'Onboarding data is required' });
      return;
    }

    const user = await User.findById(req.user!._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update onboarding data
    user.onboarding = {
      ...user.onboarding,
      ...onboarding,
      completedAt: new Date(),
    };
    user.onboardingCompleted = true;

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      message: 'Onboarding completed successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update onboarding error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};