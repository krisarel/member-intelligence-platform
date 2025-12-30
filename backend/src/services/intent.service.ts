import Intent, { IIntent } from '../models/Intent';
import User from '../models/User';
import openAIService from './openai.service';
import mongoose from 'mongoose';

export class IntentService {
  private static instance: IntentService;

  private constructor() {}

  public static getInstance(): IntentService {
    if (!IntentService.instance) {
      IntentService.instance = new IntentService();
    }
    return IntentService.instance;
  }

  async createOrUpdateIntent(
    userId: string,
    rawText: string,
    visibility: 'public' | 'members_only' | 'private' = 'members_only',
    consentToMatch: boolean = true,
    consentToContact: boolean = false
  ): Promise<IIntent> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const analysis = await openAIService.analyzeIntent(rawText);

      const existingIntent = await Intent.findOne({ 
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true 
      });

      if (existingIntent) {
        existingIntent.rawText = rawText;
        existingIntent.intentType = analysis.intentType;
        existingIntent.categories = analysis.categories;
        existingIntent.domains = analysis.domains;
        existingIntent.experienceLevel = analysis.experienceLevel;
        existingIntent.availability = analysis.availability;
        existingIntent.visibility = visibility;
        existingIntent.consentToMatch = consentToMatch;
        existingIntent.consentToContact = consentToContact;
        existingIntent.lastProcessedAt = new Date();

        await existingIntent.save();
        return existingIntent;
      }

      const newIntent = new Intent({
        userId: new mongoose.Types.ObjectId(userId),
        rawText,
        intentType: analysis.intentType,
        categories: analysis.categories,
        domains: analysis.domains,
        experienceLevel: analysis.experienceLevel,
        availability: analysis.availability,
        visibility,
        consentToMatch,
        consentToContact,
        isActive: true,
        isPaused: false,
        lastProcessedAt: new Date(),
      });

      await newIntent.save();
      return newIntent;
    } catch (error: any) {
      console.error('Error creating/updating intent:', error.message);
      throw error;
    }
  }

  async getUserIntent(userId: string): Promise<IIntent | null> {
    try {
      return await Intent.findOne({ 
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true 
      });
    } catch (error: any) {
      console.error('Error getting user intent:', error.message);
      throw error;
    }
  }

  async pauseIntent(userId: string): Promise<IIntent | null> {
    try {
      const intent = await Intent.findOne({ 
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true 
      });

      if (!intent) {
        throw new Error('No active intent found');
      }

      intent.isPaused = true;
      await intent.save();
      return intent;
    } catch (error: any) {
      console.error('Error pausing intent:', error.message);
      throw error;
    }
  }

  async resumeIntent(userId: string): Promise<IIntent | null> {
    try {
      const intent = await Intent.findOne({ 
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true 
      });

      if (!intent) {
        throw new Error('No active intent found');
      }

      intent.isPaused = false;
      await intent.save();
      return intent;
    } catch (error: any) {
      console.error('Error resuming intent:', error.message);
      throw error;
    }
  }

  async deleteIntent(userId: string): Promise<void> {
    try {
      const intent = await Intent.findOne({ 
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true 
      });

      if (!intent) {
        throw new Error('No active intent found');
      }

      intent.isActive = false;
      await intent.save();
    } catch (error: any) {
      console.error('Error deleting intent:', error.message);
      throw error;
    }
  }

  async updateIntentVisibility(
    userId: string,
    visibility: 'public' | 'members_only' | 'private'
  ): Promise<IIntent | null> {
    try {
      const intent = await Intent.findOne({ 
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true 
      });

      if (!intent) {
        throw new Error('No active intent found');
      }

      intent.visibility = visibility;
      await intent.save();
      return intent;
    } catch (error: any) {
      console.error('Error updating intent visibility:', error.message);
      throw error;
    }
  }

  async updateConsent(
    userId: string,
    consentToMatch: boolean,
    consentToContact: boolean
  ): Promise<IIntent | null> {
    try {
      const intent = await Intent.findOne({ 
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true 
      });

      if (!intent) {
        throw new Error('No active intent found');
      }

      intent.consentToMatch = consentToMatch;
      intent.consentToContact = consentToContact;
      await intent.save();
      return intent;
    } catch (error: any) {
      console.error('Error updating consent:', error.message);
      throw error;
    }
  }

  async findMatchableIntents(
    userId: string,
    limit: number = 20
  ): Promise<IIntent[]> {
    try {
      const userIntent = await this.getUserIntent(userId);
      if (!userIntent || !userIntent.consentToMatch || userIntent.isPaused) {
        return [];
      }

      const query: any = {
        userId: { $ne: new mongoose.Types.ObjectId(userId) },
        isActive: true,
        isPaused: false,
        consentToMatch: true,
        $or: [
          { domains: { $in: userIntent.domains } },
          { 'categories.category': { $in: userIntent.categories.map(c => c.category) } }
        ]
      };

      if (userIntent.intentType === 'receiving') {
        query.intentType = { $in: ['giving', 'both'] };
      } else if (userIntent.intentType === 'giving') {
        query.intentType = { $in: ['receiving', 'both'] };
      }

      const matchableIntents = await Intent.find(query)
        .limit(limit)
        .sort({ lastProcessedAt: -1 });

      return matchableIntents;
    } catch (error: any) {
      console.error('Error finding matchable intents:', error.message);
      throw error;
    }
  }
}

export default IntentService.getInstance();