import mongoose, { Document, Schema } from 'mongoose';

export interface IMatchExplanation {
  reason: string;
  sharedDomains: string[];
  complementaryIntents: string[];
  confidence: number;
}

export interface IMatch extends Document {
  user1Id: mongoose.Types.ObjectId;
  user2Id: mongoose.Types.ObjectId;
  intent1Id: mongoose.Types.ObjectId;
  intent2Id: mongoose.Types.ObjectId;
  matchScore: number;
  explanation: IMatchExplanation;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  viewedByUser1: boolean;
  viewedByUser2: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const matchExplanationSchema = new Schema({
  reason: {
    type: String,
    required: true,
  },
  sharedDomains: [{
    type: String,
  }],
  complementaryIntents: [{
    type: String,
  }],
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true,
  },
}, { _id: false });

const matchSchema = new Schema<IMatch>(
  {
    user1Id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    user2Id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    intent1Id: {
      type: Schema.Types.ObjectId,
      ref: 'Intent',
      required: true,
    },
    intent2Id: {
      type: Schema.Types.ObjectId,
      ref: 'Intent',
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },
    explanation: {
      type: matchExplanationSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
      index: true,
    },
    viewedByUser1: {
      type: Boolean,
      default: false,
    },
    viewedByUser2: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

matchSchema.index({ user1Id: 1, status: 1 });
matchSchema.index({ user2Id: 1, status: 1 });
matchSchema.index({ matchScore: -1, status: 1 });
matchSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Match = mongoose.model<IMatch>('Match', matchSchema);

export default Match;