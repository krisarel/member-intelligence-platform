import mongoose, { Document, Schema } from 'mongoose';

export interface IIntentCategory {
  category: string;
  subcategories: string[];
  confidence: number;
}

export interface IIntent extends Document {
  userId: mongoose.Types.ObjectId;
  rawText: string;
  intentType: 'receiving' | 'giving' | 'both';
  categories: IIntentCategory[];
  domains: string[];
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  availability?: 'immediate' | 'within_month' | 'flexible' | 'not_specified';
  isActive: boolean;
  isPaused: boolean;
  visibility: 'public' | 'members_only' | 'private';
  consentToMatch: boolean;
  consentToContact: boolean;
  lastProcessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const intentCategorySchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  subcategories: [{
    type: String,
  }],
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true,
  },
}, { _id: false });

const intentSchema = new Schema<IIntent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rawText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    intentType: {
      type: String,
      enum: ['receiving', 'giving', 'both'],
      required: true,
      index: true,
    },
    categories: [intentCategorySchema],
    domains: [{
      type: String,
      index: true,
    }],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    },
    availability: {
      type: String,
      enum: ['immediate', 'within_month', 'flexible', 'not_specified'],
      default: 'not_specified',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPaused: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ['public', 'members_only', 'private'],
      default: 'members_only',
    },
    consentToMatch: {
      type: Boolean,
      default: true,
    },
    consentToContact: {
      type: Boolean,
      default: false,
    },
    lastProcessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

intentSchema.index({ userId: 1, isActive: 1 });
intentSchema.index({ domains: 1, intentType: 1, isActive: 1 });
intentSchema.index({ 'categories.category': 1, intentType: 1 });

const Intent = mongoose.model<IIntent>('Intent', intentSchema);

export default Intent;