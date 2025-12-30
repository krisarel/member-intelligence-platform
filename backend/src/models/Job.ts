import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  type: 'remote' | 'hybrid' | 'onsite';
  location?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  postedBy: mongoose.Types.ObjectId;
  status: 'active' | 'closed' | 'draft';
  applicants?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    applicants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
JobSchema.index({ postedBy: 1, status: 1 });
JobSchema.index({ type: 1, status: 1 });
JobSchema.index({ createdAt: -1 });

export default mongoose.model<IJob>('Job', JobSchema);