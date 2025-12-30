import express from 'express';
import {
  createIntroductionRequest,
  getSentRequests,
  getReceivedRequests,
  getIntroductionRequest,
  markRequestAsViewed,
  updateRequestStatus,
  cancelIntroductionRequest,
} from '../controllers/introductionController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Create a new introduction request
router.post('/', protect, createIntroductionRequest);

// Get sent requests
router.get('/sent', protect, getSentRequests);

// Get received requests
router.get('/received', protect, getReceivedRequests);

// Get a specific request
router.get('/:requestId', protect, getIntroductionRequest);

// Mark request as viewed
router.patch('/:requestId/view', protect, markRequestAsViewed);

// Update request status (accept/decline)
router.patch('/:requestId/status', protect, updateRequestStatus);

// Cancel a pending request
router.delete('/:requestId', protect, cancelIntroductionRequest);

export default router;