import express from 'express';
import {
  createOrUpdateIntent,
  getUserIntent,
  pauseIntent,
  resumeIntent,
  deleteIntent,
  updateIntentVisibility,
  updateConsent,
  generateMatches,
  getUserMatches,
  markMatchAsViewed,
  updateMatchStatus,
} from '../controllers/intentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createOrUpdateIntent);
router.get('/', protect, getUserIntent);
router.patch('/pause', protect, pauseIntent);
router.patch('/resume', protect, resumeIntent);
router.delete('/', protect, deleteIntent);
router.patch('/visibility', protect, updateIntentVisibility);
router.patch('/consent', protect, updateConsent);

router.post('/matches/generate', protect, generateMatches);
router.get('/matches', protect, getUserMatches);
router.patch('/matches/:matchId/view', protect, markMatchAsViewed);
router.patch('/matches/:matchId/status', protect, updateMatchStatus);

export default router;