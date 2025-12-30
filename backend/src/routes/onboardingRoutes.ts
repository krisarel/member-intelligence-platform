import express from 'express';
import {
  getOnboardingStatus,
  saveCoreIntent,
  saveIntentModes,
  saveVisibility,
  saveDomainFocus,
  saveExperienceLevel,
  saveSkills,
  saveAvailability,
  saveContribution,
  completeOnboarding,
} from '../controllers/onboardingController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All onboarding routes require authentication
router.use(protect);

// Get onboarding status
router.get('/me', getOnboardingStatus);

// Step 1: Save core intent (Required)
router.post('/step/1', saveCoreIntent);

// Step 2: Save intent modes (Required)
router.post('/step/2', saveIntentModes);

// Step 3: Save visibility preference (Required)
router.post('/step/3', saveVisibility);

// Step 4: Save domain focus (Optional)
router.post('/step/4', saveDomainFocus);

// Step 5: Save experience level (Optional)
router.post('/step/5', saveExperienceLevel);

// Step 6: Save skills (Optional, max 10)
router.post('/step/6', saveSkills);

// Step 7: Save availability (Optional)
router.post('/step/7', saveAvailability);

// Step 8: Save contribution areas (Optional)
router.post('/step/8', saveContribution);

// Complete onboarding
router.post('/complete', completeOnboarding);

export default router;