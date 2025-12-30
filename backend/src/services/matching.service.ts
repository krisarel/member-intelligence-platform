import Match, { IMatch, IMatchExplanation } from '../models/Match';
import Intent, { IIntent } from '../models/Intent';
import User from '../models/User';
import openAIService from './openai.service';
import mongoose from 'mongoose';

export class MatchingService {
  private static instance: MatchingService;

  private constructor() {}

  public static getInstance(): MatchingService {
    if (!MatchingService.instance) {
      MatchingService.instance = new MatchingService();
    }
    return MatchingService.instance;
  }

  private calculateMatchScore(intent1: IIntent, intent2: IIntent): number {
    let score = 0;

    const sharedDomains = intent1.domains.filter(d => intent2.domains.includes(d));
    score += sharedDomains.length * 15;

    const isComplementary = 
      (intent1.intentType === 'receiving' && (intent2.intentType === 'giving' || intent2.intentType === 'both')) ||
      (intent1.intentType === 'giving' && (intent2.intentType === 'receiving' || intent2.intentType === 'both')) ||
      (intent1.intentType === 'both' && intent2.intentType === 'both');

    if (isComplementary) {
      score += 30;
    }

    const sharedCategories = intent1.categories.filter(c1 => 
      intent2.categories.some(c2 => c2.category === c1.category)
    );
    score += sharedCategories.length * 10;

    const avgConfidence = sharedCategories.reduce((sum, cat) => {
      const matchingCat = intent2.categories.find(c => c.category === cat.category);
      return sum + (cat.confidence + (matchingCat?.confidence || 0)) / 2;
    }, 0) / (sharedCategories.length || 1);
    score += avgConfidence * 20;

    if (intent1.availability === intent2.availability && intent1.availability !== 'not_specified') {
      score += 5;
    }

    return Math.min(Math.round(score), 100);
  }

  private async createMatchExplanation(
    intent1: IIntent,
    intent2: IIntent,
    user1: any,
    user2: any
  ): Promise<IMatchExplanation> {
    const sharedDomains = intent1.domains.filter(d => intent2.domains.includes(d));
    
    const complementaryIntents: string[] = [];
    if (intent1.intentType === 'receiving' && intent2.intentType === 'giving') {
      complementaryIntents.push(`${user1.firstName} is seeking what ${user2.firstName} is offering`);
    } else if (intent1.intentType === 'giving' && intent2.intentType === 'receiving') {
      complementaryIntents.push(`${user1.firstName} is offering what ${user2.firstName} is seeking`);
    } else if (intent1.intentType === 'both' && intent2.intentType === 'both') {
      complementaryIntents.push('Both members have complementary giving and receiving intents');
    }

    const user1Name = `${user1.firstName} ${user1.lastName}`;
    const user2Name = `${user2.firstName} ${user2.lastName}`;

    const aiExplanation = await openAIService.generateMatchExplanation(
      intent1,
      intent2,
      user1Name,
      user2Name
    );

    const sharedCategories = intent1.categories
      .filter(c1 => intent2.categories.some(c2 => c2.category === c1.category))
      .map(c => c.category);

    const avgConfidence = sharedCategories.length > 0
      ? sharedCategories.reduce((sum, cat) => {
          const cat1 = intent1.categories.find(c => c.category === cat);
          const cat2 = intent2.categories.find(c => c.category === cat);
          return sum + ((cat1?.confidence || 0) + (cat2?.confidence || 0)) / 2;
        }, 0) / sharedCategories.length
      : 0.5;

    return {
      reason: aiExplanation,
      sharedDomains,
      complementaryIntents,
      confidence: avgConfidence,
    };
  }

  async generateMatches(userId: string, limit: number = 10): Promise<IMatch[]> {
    try {
      const userIntent = await Intent.findOne({ 
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true,
        isPaused: false,
        consentToMatch: true
      });

      if (!userIntent) {
        throw new Error('User has no active intent or has not consented to matching');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const query: any = {
        userId: { $ne: new mongoose.Types.ObjectId(userId) },
        isActive: true,
        isPaused: false,
        consentToMatch: true,
      };

      if (userIntent.intentType === 'receiving') {
        query.intentType = { $in: ['giving', 'both'] };
      } else if (userIntent.intentType === 'giving') {
        query.intentType = { $in: ['receiving', 'both'] };
      }

      if (userIntent.domains.length > 0) {
        query.domains = { $in: userIntent.domains };
      }

      const potentialMatches = await Intent.find(query).limit(limit * 2);

      const matches: IMatch[] = [];

      for (const matchIntent of potentialMatches) {
        const existingMatch = await Match.findOne({
          $or: [
            { user1Id: userId, user2Id: matchIntent.userId },
            { user1Id: matchIntent.userId, user2Id: userId }
          ],
          status: { $in: ['pending', 'accepted'] }
        });

        if (existingMatch) {
          continue;
        }

        const matchScore = this.calculateMatchScore(userIntent, matchIntent);

        if (matchScore < 30) {
          continue;
        }

        const matchUser = await User.findById(matchIntent.userId);
        if (!matchUser) {
          continue;
        }

        const explanation = await this.createMatchExplanation(
          userIntent,
          matchIntent,
          user,
          matchUser
        );

        const match = new Match({
          user1Id: new mongoose.Types.ObjectId(userId),
          user2Id: matchIntent.userId,
          intent1Id: userIntent._id,
          intent2Id: matchIntent._id,
          matchScore,
          explanation,
          status: 'pending',
          viewedByUser1: false,
          viewedByUser2: false,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        await match.save();
        matches.push(match);

        if (matches.length >= limit) {
          break;
        }
      }

      return matches;
    } catch (error: any) {
      console.error('Error generating matches:', error.message);
      throw error;
    }
  }

  async getUserMatches(
    userId: string,
    status?: 'pending' | 'accepted' | 'declined' | 'expired'
  ): Promise<IMatch[]> {
    try {
      const query: any = {
        $or: [
          { user1Id: new mongoose.Types.ObjectId(userId) },
          { user2Id: new mongoose.Types.ObjectId(userId) }
        ]
      };

      if (status) {
        query.status = status;
      }

      const matches = await Match.find(query)
        .populate('user1Id', 'firstName lastName email role')
        .populate('user2Id', 'firstName lastName email role')
        .populate('intent1Id')
        .populate('intent2Id')
        .sort({ matchScore: -1, createdAt: -1 });

      return matches;
    } catch (error: any) {
      console.error('Error getting user matches:', error.message);
      throw error;
    }
  }

  async markMatchAsViewed(matchId: string, userId: string): Promise<IMatch | null> {
    try {
      const match = await Match.findById(matchId);
      if (!match) {
        throw new Error('Match not found');
      }

      if (match.user1Id.toString() === userId) {
        match.viewedByUser1 = true;
      } else if (match.user2Id.toString() === userId) {
        match.viewedByUser2 = true;
      }

      await match.save();
      return match;
    } catch (error: any) {
      console.error('Error marking match as viewed:', error.message);
      throw error;
    }
  }

  async updateMatchStatus(
    matchId: string,
    userId: string,
    status: 'accepted' | 'declined'
  ): Promise<IMatch | null> {
    try {
      const match = await Match.findById(matchId);
      if (!match) {
        throw new Error('Match not found');
      }

      if (match.user1Id.toString() !== userId && match.user2Id.toString() !== userId) {
        throw new Error('Unauthorized to update this match');
      }

      match.status = status;
      await match.save();
      return match;
    } catch (error: any) {
      console.error('Error updating match status:', error.message);
      throw error;
    }
  }
}

export default MatchingService.getInstance();