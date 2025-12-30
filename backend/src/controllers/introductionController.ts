import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import IntroductionRequest from '../models/IntroductionRequest';
import User from '../models/User';

// Create an introduction request
export const createIntroductionRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const fromUserId = req.user?._id;
    const { toUserId, message, intentCategory, intentDescription } = req.body;

    // Validation
    if (!toUserId || !message || !intentCategory) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: toUserId, message, and intentCategory are required',
      });
      return;
    }

    // Check if trying to request intro to self
    if (fromUserId === toUserId) {
      res.status(400).json({
        success: false,
        message: 'Cannot request introduction to yourself',
      });
      return;
    }

    // Check if target user exists
    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      res.status(404).json({
        success: false,
        message: 'Target user not found',
      });
      return;
    }

    // Check for existing pending request
    const existingRequest = await IntroductionRequest.findOne({
      fromUserId,
      toUserId,
      status: 'pending',
    });

    if (existingRequest) {
      res.status(400).json({
        success: false,
        message: 'You already have a pending introduction request to this user',
      });
      return;
    }

    // Create the introduction request
    const introRequest = await IntroductionRequest.create({
      fromUserId,
      toUserId,
      message,
      intentCategory,
      intentDescription,
    });

    // Populate user details for response
    const populatedRequest = await IntroductionRequest.findById(introRequest._id)
      .populate('fromUserId', 'firstName lastName email')
      .populate('toUserId', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Introduction request sent successfully',
      data: populatedRequest,
    });
  } catch (error: any) {
    console.error('Error creating introduction request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create introduction request',
      error: error.message,
    });
  }
};

// Get introduction requests sent by the user
export const getSentRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { status } = req.query;

    const query: any = { fromUserId: userId };
    if (status) {
      query.status = status;
    }

    const requests = await IntroductionRequest.find(query)
      .populate('toUserId', 'firstName lastName email onboarding')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error: any) {
    console.error('Error fetching sent requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sent requests',
      error: error.message,
    });
  }
};

// Get introduction requests received by the user
export const getReceivedRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { status } = req.query;

    const query: any = { toUserId: userId };
    if (status) {
      query.status = status;
    }

    const requests = await IntroductionRequest.find(query)
      .populate('fromUserId', 'firstName lastName email onboarding')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error: any) {
    console.error('Error fetching received requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch received requests',
      error: error.message,
    });
  }
};

// Mark a request as viewed
export const markRequestAsViewed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { requestId } = req.params;

    const request = await IntroductionRequest.findOne({
      _id: requestId,
      toUserId: userId,
    });

    if (!request) {
      res.status(404).json({
        success: false,
        message: 'Introduction request not found',
      });
      return;
    }

    if (!request.viewedAt) {
      request.viewedAt = new Date();
      await request.save();
    }

    res.status(200).json({
      success: true,
      message: 'Request marked as viewed',
      data: request,
    });
  } catch (error: any) {
    console.error('Error marking request as viewed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark request as viewed',
      error: error.message,
    });
  }
};

// Update request status (accept/decline)
export const updateRequestStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { requestId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "accepted" or "declined"',
      });
      return;
    }

    const request = await IntroductionRequest.findOne({
      _id: requestId,
      toUserId: userId,
      status: 'pending',
    });

    if (!request) {
      res.status(404).json({
        success: false,
        message: 'Pending introduction request not found',
      });
      return;
    }

    request.status = status;
    request.respondedAt = new Date();
    await request.save();

    const populatedRequest = await IntroductionRequest.findById(request._id)
      .populate('fromUserId', 'firstName lastName email')
      .populate('toUserId', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      data: populatedRequest,
    });
  } catch (error: any) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update request status',
      error: error.message,
    });
  }
};

// Get a single introduction request
export const getIntroductionRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { requestId } = req.params;

    const request = await IntroductionRequest.findOne({
      _id: requestId,
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
      .populate('fromUserId', 'firstName lastName email onboarding')
      .populate('toUserId', 'firstName lastName email onboarding');

    if (!request) {
      res.status(404).json({
        success: false,
        message: 'Introduction request not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error: any) {
    console.error('Error fetching introduction request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch introduction request',
      error: error.message,
    });
  }
};

// Delete/cancel an introduction request (only if pending and sent by user)
export const cancelIntroductionRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { requestId } = req.params;

    const request = await IntroductionRequest.findOne({
      _id: requestId,
      fromUserId: userId,
      status: 'pending',
    });

    if (!request) {
      res.status(404).json({
        success: false,
        message: 'Pending introduction request not found or cannot be cancelled',
      });
      return;
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Introduction request cancelled successfully',
    });
  } catch (error: any) {
    console.error('Error cancelling introduction request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel introduction request',
      error: error.message,
    });
  }
};