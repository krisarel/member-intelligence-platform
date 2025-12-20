import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Job, Introduction, Recommendation, UserTier } from '../types';

interface AppState {
  currentUser: User | null;
  users: User[];
  jobs: Job[];
  introductions: Introduction[];
  recommendations: Recommendation[];
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateProfile: (updates: Partial<User>) => void;
  upgradeTier: () => void;
  
  requestIntro: (toUserId: string, message: string) => void;
  respondToIntro: (introId: string, status: 'Accepted' | 'Declined') => void;
  
  postJob: (job: Omit<Job, 'id' | 'postedAt' | 'applicants'>) => void;
  applyToJob: (jobId: string) => void;
  
  refreshRecommendations: () => void;
}

// Mock Data Generators
const generateMockUsers = (): User[] => [
  {
    id: '1',
    email: 'maya@example.com',
    fullName: 'Maya Web3',
    tier: 'VIP',
    headline: 'Transitioning from TradFi to DeFi',
    bio: 'Experienced finance professional looking to make the leap into Web3 protocols.',
    industry: 'DeFi',
    functionalArea: 'Finance',
    experienceLevel: 'Mid-Senior',
    skills: ['Financial Modeling', 'Solidity Basics', 'Risk Management'],
    goals: ['Career Transition', 'Mentorship'],
    visibility: 'Public',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya'
  },
  {
    id: '2',
    email: 'sofia@example.com',
    fullName: 'Sofia Community',
    tier: 'Admin',
    headline: 'Community Lead at Web3 Foundation',
    bio: 'Passionate about building inclusive communities in the decentralized space.',
    industry: 'DAO',
    functionalArea: 'Community',
    experienceLevel: 'Senior',
    skills: ['Community Management', 'Event Planning', 'Governance'],
    goals: ['Hiring', 'Networking'],
    visibility: 'Public',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia'
  },
  {
    id: '3',
    email: 'elena@example.com',
    fullName: 'Elena Tech',
    tier: 'VIP',
    headline: 'Head of Engineering at Sygnum',
    bio: 'Building the future of digital assets banking.',
    industry: 'CeFi',
    functionalArea: 'Engineering',
    experienceLevel: 'Executive',
    skills: ['System Architecture', 'Team Leadership', 'Rust'],
    goals: ['Hiring', 'Mentorship'],
    visibility: 'Limited',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
  },
  {
    id: '4',
    email: 'sarah@example.com',
    fullName: 'Sarah Design',
    tier: 'Free',
    headline: 'Product Designer',
    bio: 'Designing intuitive interfaces for complex dApps.',
    industry: 'NFTs',
    functionalArea: 'Design',
    experienceLevel: 'Mid-Level',
    skills: ['Figma', 'User Research', 'Prototyping'],
    goals: ['Freelance', 'Learning'],
    visibility: 'Public',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  }
];

const generateMockJobs = (): Job[] => [
  {
    id: '101',
    title: 'Senior Smart Contract Engineer',
    company: 'Sygnum',
    description: 'We are looking for an experienced engineer to lead our smart contract development.',
    requirements: ['5+ years dev experience', 'Solidity expert', 'Security mindset'],
    location: 'Zurich / Remote',
    type: 'Full-time',
    isVipOnly: true,
    hiringLeaderId: '3', // Elena
    postedAt: new Date().toISOString(),
    applicants: []
  },
  {
    id: '102',
    title: 'Community Manager',
    company: 'Web3 Foundation',
    description: 'Join us to grow and nurture our global ecosystem.',
    requirements: ['Excellent communication', 'Crypto native', 'Event experience'],
    location: 'Zug',
    type: 'Full-time',
    isVipOnly: false,
    hiringLeaderId: '2', // Sofia
    postedAt: new Date().toISOString(),
    applicants: []
  }
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: generateMockUsers(),
      jobs: generateMockJobs(),
      introductions: [],
      recommendations: [],

      login: (email) => {
        const user = get().users.find(u => u.email === email);
        if (user) {
          set({ currentUser: user });
          get().refreshRecommendations();
        } else {
          // Auto-register for demo purposes if not found, or throw error
          // For this demo, let's just alert or handle gracefully. 
          // Actually, let's just mock a login failure if not found, 
          // but to make it easy for the user, we'll auto-create a user if it's a new email
          // or just fail. Let's fail to encourage registration.
          console.error("User not found");
        }
      },

      logout: () => set({ currentUser: null }),

      register: (userData) => {
        const newUser: User = {
          ...userData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.fullName.replace(' ', '')}`
        };
        set(state => ({ 
          users: [...state.users, newUser],
          currentUser: newUser
        }));
        get().refreshRecommendations();
      },

      updateProfile: (updates) => {
        set(state => {
          if (!state.currentUser) return state;
          const updatedUser = { ...state.currentUser, ...updates };
          return {
            currentUser: updatedUser,
            users: state.users.map(u => u.id === state.currentUser?.id ? updatedUser : u)
          };
        });
        get().refreshRecommendations();
      },

      upgradeTier: () => {
        set(state => {
          if (!state.currentUser) return state;
          const updatedUser = { ...state.currentUser, tier: 'VIP' as UserTier };
          return {
            currentUser: updatedUser,
            users: state.users.map(u => u.id === state.currentUser?.id ? updatedUser : u)
          };
        });
      },

      requestIntro: (toUserId, message) => {
        const { currentUser } = get();
        if (!currentUser) return;
        
        const newIntro: Introduction = {
          id: Math.random().toString(36).substr(2, 9),
          fromUserId: currentUser.id,
          toUserId,
          status: 'Pending',
          message,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set(state => ({ introductions: [...state.introductions, newIntro] }));
      },

      respondToIntro: (introId, status) => {
        set(state => ({
          introductions: state.introductions.map(intro => 
            intro.id === introId 
              ? { ...intro, status, updatedAt: new Date().toISOString() } 
              : intro
          )
        }));
      },

      postJob: (jobData) => {
        const newJob: Job = {
          ...jobData,
          id: Math.random().toString(36).substr(2, 9),
          postedAt: new Date().toISOString(),
          applicants: []
        };
        set(state => ({ jobs: [...state.jobs, newJob] }));
      },

      applyToJob: (jobId) => {
        const { currentUser } = get();
        if (!currentUser) return;
        
        set(state => ({
          jobs: state.jobs.map(job => 
            job.id === jobId 
              ? { ...job, applicants: [...job.applicants, currentUser.id] } 
              : job
          )
        }));
      },

      refreshRecommendations: () => {
        const { currentUser, users } = get();
        if (!currentUser) return;

        // Simple mock algorithm
        const recs: Recommendation[] = users
          .filter(u => u.id !== currentUser.id)
          .map(u => {
            let score = 50;
            const reasons: string[] = [];
            
            // Match industry
            if (u.industry === currentUser.industry) {
              score += 20;
              reasons.push('Shared Industry');
            }
            
            // Match goals (simple overlap check)
            const sharedGoals = u.goals.filter(g => currentUser.goals.includes(g));
            if (sharedGoals.length > 0) {
              score += 15 * sharedGoals.length;
              reasons.push(`Shared Goals: ${sharedGoals.join(', ')}`);
            }

            // Randomize slightly
            score += Math.floor(Math.random() * 10);

            return {
              id: `rec-${u.id}`,
              userId: currentUser.id,
              recommendedUserId: u.id,
              score: Math.min(score, 99),
              reasons
            };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        set({ recommendations: recs });
      }
    }),
    {
      name: 'wiw3-storage',
    }
  )
);
