import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { verifyMembershipTier, getVIPBenefits, hasVIPAccess } from '../services/membership.service';

// Generate JWT token
const generateToken = (id: string): string => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE as string,
  } as jwt.SignOptions);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role, authProvider, uiThemePreference } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName) {
      res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
      return;
    }

    // Validate password for email auth
    const provider = authProvider || 'email';
    if (provider === 'email' && !password) {
      res.status(400).json({
        status: 'error',
        message: 'Password is required for email authentication',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        status: 'error',
        message: 'User with this email already exists',
      });
      return;
    }

    // Verify membership tier
    const membershipTier = await verifyMembershipTier(email);

    // Create user
    const user = await User.create({
      email,
      password: provider === 'email' ? password : undefined,
      firstName,
      lastName,
      role: role || 'member',
      membershipTier,
      authProviders: [provider],
      uiThemePreference: uiThemePreference || 'light',
      lastLoginAt: new Date(),
    });

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          membershipTier: user.membershipTier,
          authProviders: user.authProviders,
          uiThemePreference: user.uiThemePreference,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt,
        },
        token,
        benefits: getVIPBenefits(user.membershipTier),
        isVIP: hasVIPAccess(user),
        requiresOnboarding: !user.onboardingCompleted,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error registering user',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
      return;
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          membershipTier: user.membershipTier,
          authProviders: user.authProviders,
          uiThemePreference: user.uiThemePreference,
          onboardingCompleted: user.onboardingCompleted,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
        },
        token,
        benefits: getVIPBenefits(user.membershipTier),
        isVIP: hasVIPAccess(user),
        requiresOnboarding: !user.onboardingCompleted,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error logging in',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Not authorized',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: req.user.role,
          membershipTier: req.user.membershipTier,
          onboardingCompleted: req.user.onboardingCompleted,
          onboarding: req.user.onboarding,
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
        },
        benefits: getVIPBenefits(req.user.membershipTier),
        isVIP: hasVIPAccess(req.user),
      },
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user data',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};