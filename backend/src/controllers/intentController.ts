import { Request, Response } from 'express';
import intentService from '../services/intent.service';
import matchingService from '../services/matching.service';

export const createOrUpdateIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { rawText, visibility, consentToMatch, consentToContact } = req.body;

    if (!rawText || rawText.trim().length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Intent text is required',
      });
      return;
    }

    if (rawText.length > 2000) {
      res.status(400).json({
        status: 'error',
        message: 'Intent text must be less than 2000 characters',
      });
      return;
    }

    const intent = await intentService.createOrUpdateIntent(
      userId,
      rawText,
      visibility || 'members_only',
      consentToMatch !== undefined ? consentToMatch : true,
      consentToContact !== undefined ? consentToContact : false
    );

    res.status(200).json({
      status: 'success',
      data: {
        intent,
      },
    });
  } catch (error: any) {
    console.error('Error in createOrUpdateIntent:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create/update intent',
    });
  }
};

export const getUserIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const intent = await intentService.getUserIntent(userId);

    if (!intent) {
      res.status(404).json({
        status: 'error',
        message: 'No active intent found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        intent,
      },
    });
  } catch (error: any) {
    console.error('Error in getUserIntent:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get intent',
    });
  }
};

export const pauseIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const intent = await intentService.pauseIntent(userId);

    res.status(200).json({
      status: 'success',
      message: 'Intent paused successfully',
      data: {
        intent,
      },
    });
  } catch (error: any) {
    console.error('Error in pauseIntent:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to pause intent',
    });
  }
};

export const resumeIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const intent = await intentService.resumeIntent(userId);

    res.status(200).json({
      status: 'success',
      message: 'Intent resumed successfully',
      data: {
        intent,
      },
    });
  } catch (error: any) {
    console.error('Error in resumeIntent:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to resume intent',
    });
  }
};

export const deleteIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    await intentService.deleteIntent(userId);

    res.status(200).json({
      status: 'success',
      message: 'Intent deleted successfully',
    });
  } catch (error: any) {
    console.error('Error in deleteIntent:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to delete intent',
    });
  }
};

export const updateIntentVisibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { visibility } = req.body;

    if (!['public', 'members_only', 'private'].includes(visibility)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid visibility value',
      });
      return;
    }

    const intent = await intentService.updateIntentVisibility(userId, visibility);

    res.status(200).json({
      status: 'success',
      message: 'Intent visibility updated successfully',
      data: {
        intent,
      },
    });
  } catch (error: any) {
    console.error('Error in updateIntentVisibility:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update intent visibility',
    });
  }
};

export const updateConsent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { consentToMatch, consentToContact } = req.body;

    if (consentToMatch === undefined || consentToContact === undefined) {
      res.status(400).json({
        status: 'error',
        message: 'Both consentToMatch and consentToContact are required',
      });
      return;
    }

    const intent = await intentService.updateConsent(
      userId,
      consentToMatch,
      consentToContact
    );

    res.status(200).json({
      status: 'success',
      message: 'Consent preferences updated successfully',
      data: {
        intent,
      },
    });
  } catch (error: any) {
    console.error('Error in updateConsent:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update consent',
    });
  }
};

export const generateMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const matches = await matchingService.generateMatches(userId, limit);

    res.status(200).json({
      status: 'success',
      data: {
        matches,
        count: matches.length,
      },
    });
  } catch (error: any) {
    console.error('Error in generateMatches:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate matches',
    });
  }
};

export const getUserMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const status = req.query.status as 'pending' | 'accepted' | 'declined' | 'expired' | undefined;

    const matches = await matchingService.getUserMatches(userId, status);

    res.status(200).json({
      status: 'success',
      data: {
        matches,
        count: matches.length,
      },
    });
  } catch (error: any) {
    console.error('Error in getUserMatches:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get matches',
    });
  }
};

export const markMatchAsViewed = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { matchId } = req.params;

    const match = await matchingService.markMatchAsViewed(matchId, userId);

    res.status(200).json({
      status: 'success',
      data: {
        match,
      },
    });
  } catch (error: any) {
    console.error('Error in markMatchAsViewed:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to mark match as viewed',
    });
  }
};

export const updateMatchStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { matchId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'declined'].includes(status)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid status value',
      });
      return;
    }

    const match = await matchingService.updateMatchStatus(matchId, userId, status);

    res.status(200).json({
      status: 'success',
      message: `Match ${status} successfully`,
      data: {
        match,
      },
    });
  } catch (error: any) {
    console.error('Error in updateMatchStatus:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update match status',
    });
  }
};