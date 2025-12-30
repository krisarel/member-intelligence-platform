import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { getVIPBenefits, hasVIPAccess } from '../services/membership.service';
import openaiService from '../services/openai.service';

/**
 * @desc    Get current user with tier and onboarding status
 * @route   GET /api/onboarding/me
 * @access  Private
 */
export const getOnboardingStatus = async (
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

    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          membershipTier: user.membershipTier,
          onboardingCompleted: user.onboardingCompleted,
          onboarding: user.onboarding,
        },
        benefits: getVIPBenefits(user.membershipTier),
        isVIP: hasVIPAccess(user),
      },
    });
  } catch (error: any) {
    console.error('Get onboarding status error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching onboarding status',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Save core intent (Prompt 1 - Required)
 * @route   POST /api/onboarding/step/1
 * @access  Private
 */
export const saveCoreIntent = async (
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

    const { coreIntent } = req.body;

    if (!coreIntent || coreIntent.trim().length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Core intent is required',
      });
      return;
    }

    if (coreIntent.length > 2000) {
      res.status(400).json({
        status: 'error',
        message: 'Core intent must be less than 2000 characters',
      });
      return;
    }

    // Analyze intent using AI
    let aiAnalysis;
    try {
      aiAnalysis = await openaiService.analyzeIntent(coreIntent);
    } catch (aiError) {
      console.error('AI analysis error:', aiError);
      aiAnalysis = null;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'onboarding.coreIntent': coreIntent,
          'onboarding.currentStep': 1,
          ...(aiAnalysis && {
            'onboarding.domainFocus': aiAnalysis.domains || [],
          }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Core intent saved successfully',
      data: {
        user: {
          id: user._id,
          onboarding: user.onboarding,
        },
        aiSuggestions: aiAnalysis,
      },
    });
  } catch (error: any) {
    console.error('Save core intent error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error saving core intent',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Save intent modes (Prompt 2 - Required)
 * @route   POST /api/onboarding/step/2
 * @access  Private
 */
export const saveIntentModes = async (
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

    const { intentModes } = req.body;

    if (!intentModes || !Array.isArray(intentModes) || intentModes.length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'At least one intent mode is required',
      });
      return;
    }

    const validIntentModes = [
      'seeking_mentorship',
      'offering_mentorship',
      'exploring_jobs',
      'hiring',
      'speaking',
      'organizing_events',
      'volunteering',
      'learning',
      'collaborating',
      'recruitment_hiring',
      'recruitment_seeking',
    ];

    const invalidModes = intentModes.filter(mode => !validIntentModes.includes(mode));
    if (invalidModes.length > 0) {
      res.status(400).json({
        status: 'error',
        message: `Invalid intent modes: ${invalidModes.join(', ')}`,
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'onboarding.intentModes': intentModes,
          'onboarding.currentStep': 2,
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Intent modes saved successfully',
      data: {
        user: {
          id: user._id,
          onboarding: user.onboarding,
        },
      },
    });
  } catch (error: any) {
    console.error('Save intent modes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error saving intent modes',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Save visibility preference (Prompt 3 - Required)
 * @route   POST /api/onboarding/step/3
 * @access  Private
 */
export const saveVisibility = async (
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

    const { visibilityPreference } = req.body;

    if (!visibilityPreference) {
      res.status(400).json({
        status: 'error',
        message: 'Visibility preference is required',
      });
      return;
    }

    const validVisibility = ['open', 'review', 'limited'];
    if (!validVisibility.includes(visibilityPreference)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid visibility preference',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'onboarding.visibilityPreference': visibilityPreference,
          'onboarding.currentStep': 3,
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Visibility preference saved successfully',
      data: {
        user: {
          id: user._id,
          onboarding: user.onboarding,
        },
      },
    });
  } catch (error: any) {
    console.error('Save visibility error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error saving visibility preference',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Save domain focus (Prompt 4 - Optional)
 * @route   POST /api/onboarding/step/4
 * @access  Private
 */
export const saveDomainFocus = async (
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

    const { domainFocus } = req.body;

    const updateData: any = {
      'onboarding.currentStep': 4,
    };

    if (domainFocus && Array.isArray(domainFocus) && domainFocus.length > 0) {
      updateData['onboarding.domainFocus'] = domainFocus;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Domain focus saved successfully',
      data: {
        user: {
          id: user._id,
          onboarding: user.onboarding,
        },
      },
    });
  } catch (error: any) {
    console.error('Save domain focus error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error saving domain focus',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Save experience level (Prompt 5 - Optional)
 * @route   POST /api/onboarding/step/5
 * @access  Private
 */
export const saveExperienceLevel = async (
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

    const { experienceLevel } = req.body;

    const updateData: any = {
      'onboarding.currentStep': 5,
    };

    if (experienceLevel) {
      const validLevels = ['exploring', 'mid_level', 'senior', 'founder'];
      if (!validLevels.includes(experienceLevel)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid experience level',
        });
        return;
      }
      updateData['onboarding.experienceLevel'] = experienceLevel;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Experience level saved successfully',
      data: {
        user: {
          id: user._id,
          onboarding: user.onboarding,
        },
      },
    });
  } catch (error: any) {
    console.error('Save experience level error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error saving experience level',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Save skills (Prompt 6 - Optional, max 10)
 * @route   POST /api/onboarding/step/6
 * @access  Private
 */
export const saveSkills = async (
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

    const { skills } = req.body;

    const updateData: any = {
      'onboarding.currentStep': 6,
    };

    if (skills && Array.isArray(skills)) {
      if (skills.length > 10) {
        res.status(400).json({
          status: 'error',
          message: 'Maximum 10 skills allowed',
        });
        return;
      }
      updateData['onboarding.skills'] = skills;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Skills saved successfully',
      data: {
        user: {
          id: user._id,
          onboarding: user.onboarding,
        },
      },
    });
  } catch (error: any) {
    console.error('Save skills error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error saving skills',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Save availability (Prompt 7 - Optional)
 * @route   POST /api/onboarding/step/7
 * @access  Private
 */
export const saveAvailability = async (
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

    const { availability } = req.body;

    const updateData: any = {
      'onboarding.currentStep': 7,
    };

    if (availability) {
      const validAvailability = ['actively_looking', 'open_to_conversations', 'limited', 'not_available'];
      if (!validAvailability.includes(availability)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid availability',
        });
        return;
      }
      updateData['onboarding.availability'] = availability;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Availability saved successfully',
      data: {
        user: {
          id: user._id,
          onboarding: user.onboarding,
        },
      },
    });
  } catch (error: any) {
    console.error('Save availability error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error saving availability',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Save contribution areas (Prompt 8 - Optional)
 * @route   POST /api/onboarding/step/8
 * @access  Private
 */
export const saveContribution = async (
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

    const { contributionAreas } = req.body;

    const updateData: any = {
      'onboarding.currentStep': 8,
    };

    if (contributionAreas && Array.isArray(contributionAreas) && contributionAreas.length > 0) {
      updateData['onboarding.contributionAreas'] = contributionAreas;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Contribution areas saved successfully',
      data: {
        user: {
          id: user._id,
          onboarding: user.onboarding,
        },
      },
    });
  } catch (error: any) {
    console.error('Save contribution error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error saving contribution areas',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};

/**
 * @desc    Complete onboarding
 * @route   POST /api/onboarding/complete
 * @access  Private
 */
export const completeOnboarding = async (
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

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    // Validate required fields (Prompts 1, 2, 3)
    if (!user.onboarding?.coreIntent || user.onboarding.coreIntent.trim().length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Core intent is required to complete onboarding',
      });
      return;
    }

    if (!user.onboarding?.intentModes || user.onboarding.intentModes.length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'At least one intent mode is required to complete onboarding',
      });
      return;
    }

    if (!user.onboarding?.visibilityPreference) {
      res.status(400).json({
        status: 'error',
        message: 'Visibility preference is required to complete onboarding',
      });
      return;
    }

    // Mark onboarding as complete
    user.onboardingCompleted = true;
    user.onboarding.completedAt = new Date();
    user.onboarding.currentStep = 8;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Onboarding completed successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          membershipTier: user.membershipTier,
          onboardingCompleted: user.onboardingCompleted,
          onboarding: user.onboarding,
        },
        benefits: getVIPBenefits(user.membershipTier),
        isVIP: hasVIPAccess(user),
      },
    });
  } catch (error: any) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error completing onboarding',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
};