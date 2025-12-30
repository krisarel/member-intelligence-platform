import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IOnboardingData {
  // Prompt 1: Core Intent (Required, Free Text)
  coreIntent?: string;
  
  // Prompt 2: Intent Mode (Required, Structured Multi-Select)
  intentModes: string[];
  
  // Prompt 3: Visibility & Consent (Required)
  visibilityPreference?: 'open' | 'review' | 'limited';
  
  // Prompt 4: Domain Focus (Optional, Multi-Select)
  domainFocus?: string[];
  
  // Prompt 5: Experience Level (Optional, Single Select)
  experienceLevel?: 'exploring' | 'mid_level' | 'senior' | 'founder';
  
  // Prompt 6: Skills & Strengths (Optional, Tags - max 10)
  skills?: string[];
  
  // Prompt 7: Availability (Optional)
  availability?: 'actively_looking' | 'open_to_conversations' | 'limited' | 'not_available';
  
  // Prompt 8: Community Contribution (Optional)
  contributionAreas?: string[];
  
  // Progress tracking
  currentStep?: number;
  completedAt?: Date;
}

export interface IUser extends Document {
  email: string;
  password?: string; // Optional for OAuth users
  firstName: string;
  lastName: string;
  role: 'admin' | 'member';
  membershipTier: 'free' | 'vip' | 'admin' | 'superadmin';
  authProviders: Array<'email' | 'google' | 'linkedin'>;
  uiThemePreference: 'light' | 'dark' | 'purple';
  lastLoginAt?: Date;
  onboarding?: IOnboardingData;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: function(this: IUser) {
        // Password required only for email auth
        return this.authProviders.includes('email');
      },
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default in queries
    },
    authProviders: [{
      type: String,
      enum: ['email', 'google', 'linkedin'],
      required: true,
    }],
    uiThemePreference: {
      type: String,
      enum: ['light', 'dark', 'purple'],
      default: 'light',
    },
    lastLoginAt: {
      type: Date,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    membershipTier: {
      type: String,
      enum: ['free', 'vip', 'admin', 'superadmin'],
      default: 'free',
    },
    onboarding: {
      coreIntent: {
        type: String,
        maxlength: 2000,
      },
      intentModes: [{
        type: String,
      }],
      visibilityPreference: {
        type: String,
        enum: ['open', 'review', 'limited'],
      },
      domainFocus: [{
        type: String,
      }],
      experienceLevel: {
        type: String,
        enum: ['exploring', 'mid_level', 'senior', 'founder'],
      },
      skills: [{
        type: String,
      }],
      availability: {
        type: String,
        enum: ['actively_looking', 'open_to_conversations', 'limited', 'not_available'],
      },
      contributionAreas: [{
        type: String,
      }],
      currentStep: {
        type: Number,
        default: 0,
      },
      completedAt: {
        type: Date,
      },
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new) and exists
  if (!this.isModified('password') || !this.password) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error;
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;