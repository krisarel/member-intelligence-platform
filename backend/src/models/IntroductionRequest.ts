import mongoose, { Document, Schema } from 'mongoose';

export interface IIntroductionRequest extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  message: string;
  intentCategory: string;
  intentDescription?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  viewedAt?: Date;
  respondedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const introductionRequestSchema = new Schema<IIntroductionRequest>(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      minlength: [10, 'Message must be at least 10 characters'],
    },
    intentCategory: {
      type: String,
      required: [true, 'Intent category is required'],
      enum: [
        'mentorship',
        'job_opportunity',
        'collaboration',
        'networking',
        'speaking_opportunity',
        'learning',
        'hiring',
        'volunteering',
        'other',
      ],
    },
    intentDescription: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
      index: true,
    },
    viewedAt: {
      type: Date,
    },
    respondedAt: {
      type: Date,
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

// Compound indexes for efficient queries
introductionRequestSchema.index({ toUserId: 1, status: 1, createdAt: -1 });
introductionRequestSchema.index({ fromUserId: 1, status: 1, createdAt: -1 });
introductionRequestSchema.index({ expiresAt: 1, status: 1 });

// Auto-expire requests after 30 days
introductionRequestSchema.pre('save', function () {
  if (this.isNew && !this.expiresAt) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    this.expiresAt = expirationDate;
  }
});

const IntroductionRequest = mongoose.model<IIntroductionRequest>(
  'IntroductionRequest',
  introductionRequestSchema
);

export default IntroductionRequest;