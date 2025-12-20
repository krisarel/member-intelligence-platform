export type UserTier = 'Free' | 'VIP' | 'Admin' | 'SuperAdmin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  tier: UserTier;
  headline?: string;
  bio?: string;
  avatar?: string;
  industry?: string;
  functionalArea?: string;
  experienceLevel?: string;
  skills: string[];
  goals: string[];
  visibility: 'Public' | 'Limited' | 'Hidden';
  linkedInUrl?: string;
  telegramHandle?: string;
  location?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  isVipOnly: boolean;
  hiringLeaderId?: string; // If null, it's a general application
  postedAt: string;
  applicants: string[]; // User IDs
}

export type IntroStatus = 'Pending' | 'Accepted' | 'Declined';

export interface Introduction {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: IntroStatus;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  id: string;
  userId: string; // The user receiving the recommendation
  recommendedUserId: string; // The user being recommended
  score: number; // 0-100
  reasons: string[];
}
