import User, { IUser } from '../models/User';

/**
 * Membership tier verification service
 * In production, this would integrate with an external membership database
 * For MVP, we'll use a simple email-based lookup
 */

// Mock VIP member list - in production, this would be a database lookup or API call
const VIP_MEMBERS = [
  'alex@fintech.com',
  'sarah@defi.io',
  'emma@web3.org',
  // Add more VIP members as needed
];

const ADMIN_MEMBERS = [
  'admin@wiw3ch.com',
];

const SUPERADMIN_MEMBERS = [
  'superadmin@wiw3ch.com',
];

export type MembershipTier = 'free' | 'vip' | 'admin' | 'superadmin';

/**
 * Verify membership tier for a given email
 * @param email - User's email address
 * @returns Membership tier
 */
export const verifyMembershipTier = async (email: string): Promise<MembershipTier> => {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check superadmin first (highest privilege)
  if (SUPERADMIN_MEMBERS.includes(normalizedEmail)) {
    return 'superadmin';
  }
  
  // Check admin
  if (ADMIN_MEMBERS.includes(normalizedEmail)) {
    return 'admin';
  }
  
  // Check VIP
  if (VIP_MEMBERS.includes(normalizedEmail)) {
    return 'vip';
  }
  
  // Default to free tier
  return 'free';
};

/**
 * Update user's membership tier
 * @param userId - User's ID
 * @param tier - New membership tier
 * @returns Updated user
 */
export const updateUserTier = async (
  userId: string,
  tier: MembershipTier
): Promise<IUser | null> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { membershipTier: tier },
    { new: true, runValidators: true }
  );
  
  return user;
};

/**
 * Check if user has VIP access
 * @param user - User object
 * @returns True if user is VIP or higher
 */
export const hasVIPAccess = (user: IUser): boolean => {
  return ['vip', 'admin', 'superadmin'].includes(user.membershipTier);
};

/**
 * Check if user has admin access
 * @param user - User object
 * @returns True if user is admin or superadmin
 */
export const hasAdminAccess = (user: IUser): boolean => {
  return ['admin', 'superadmin'].includes(user.membershipTier);
};

/**
 * Get VIP benefits based on tier
 * @param tier - Membership tier
 * @returns List of benefits
 */
export const getVIPBenefits = (tier: MembershipTier): string[] => {
  const benefits: Record<MembershipTier, string[]> = {
    free: [
      'Access to member directory',
      'Basic profile visibility',
      'Community events access',
    ],
    vip: [
      'Priority matching for introductions',
      'AI-powered intent understanding',
      'Advanced profile customization',
      'Early access to job postings',
      'VIP-only networking events',
      'Direct messaging with other VIPs',
      'Featured profile placement',
    ],
    admin: [
      'All VIP benefits',
      'Member management access',
      'Event organization tools',
      'Analytics dashboard',
    ],
    superadmin: [
      'All admin benefits',
      'Full platform access',
      'System configuration',
      'User tier management',
    ],
  };
  
  return benefits[tier] || benefits.free;
};