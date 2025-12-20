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
  updateUserTier: (userId: string, tier: UserTier) => void;
  
  requestIntro: (toUserId: string, message: string) => void;
  respondToIntro: (introId: string, status: 'Accepted' | 'Declined') => void;
  
  postJob: (job: Omit<Job, 'id' | 'postedAt' | 'applicants'>) => void;
  applyToJob: (jobId: string) => void;
  
  refreshRecommendations: () => void;
}

// Mock Data Generators
const generateMockUsers = (): User[] => [
  // Board / Super Admins
  {
    id: '1',
    email: 'maya@example.com',
    fullName: 'Maya Web3',
    tier: 'SuperAdmin',
    headline: 'Board Member & Head of DeFi Working Group',
    bio: 'Leading strategic initiatives for WiW3CH. Experienced finance professional transitioning to DeFi.',
    industry: 'DeFi',
    functionalArea: 'Strategy',
    experienceLevel: 'Executive',
    skills: ['Strategy', 'Governance', 'DeFi'],
    goals: ['Leadership', 'Ecosystem Growth'],
    visibility: 'Public',
    location: 'Zurich',
    linkedInUrl: 'https://linkedin.com/in/mayaweb3',
    telegramHandle: '@maya_defi',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya'
  },
  {
    id: '2',
    email: 'sofia@example.com',
    fullName: 'Sofia Community',
    tier: 'Admin',
    headline: 'Community Lead - Romandie Chapter',
    bio: 'Building the WiW3 community in French-speaking Switzerland.',
    industry: 'DAO',
    functionalArea: 'Community',
    experienceLevel: 'Senior',
    skills: ['Community Building', 'Events', 'Marketing'],
    goals: ['Networking', 'Hiring'],
    visibility: 'Public',
    location: 'Romandie',
    linkedInUrl: 'https://linkedin.com/in/sofiacommunity',
    telegramHandle: '@sofia_w3f',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia'
  },
  // Chapter Members
  {
    id: '3',
    email: 'elena@example.com',
    fullName: 'Elena Tech',
    tier: 'VIP',
    headline: 'Head of Engineering at Sygnum',
    bio: 'Building digital asset banking infrastructure.',
    industry: 'CeFi',
    functionalArea: 'Engineering',
    experienceLevel: 'Executive',
    skills: ['Rust', 'System Architecture', 'Leadership'],
    goals: ['Hiring', 'Mentorship'],
    visibility: 'Limited',
    location: 'Zurich',
    linkedInUrl: 'https://linkedin.com/in/elenatech',
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
    skills: ['Figma', 'UX/UI', 'Prototyping'],
    goals: ['Freelance', 'Learning'],
    visibility: 'Public',
    location: 'Lugano',
    telegramHandle: '@sarah_design',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: '5',
    email: 'fatima@example.com',
    fullName: 'Fatima Al-Sayed',
    tier: 'VIP',
    headline: 'Crypto Legal Consultant',
    bio: 'Advising projects on regulatory compliance in the MENA region.',
    industry: 'Legal',
    functionalArea: 'Legal',
    experienceLevel: 'Senior',
    skills: ['Regulation', 'Compliance', 'Smart Contracts'],
    goals: ['Partnerships', 'Speaking'],
    visibility: 'Public',
    location: 'UAE',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima'
  },
  {
    id: '6',
    email: 'marie@example.com',
    fullName: 'Marie Dubois',
    tier: 'Free',
    headline: 'Blockchain Developer',
    bio: 'Full stack developer passionate about Ethereum scalability.',
    industry: 'Infrastructure',
    functionalArea: 'Engineering',
    experienceLevel: 'Mid-Level',
    skills: ['Solidity', 'React', 'L2s'],
    goals: ['Job Seeking', 'Hackathons'],
    visibility: 'Public',
    location: 'France',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie'
  },
  {
    id: '7',
    email: 'jessica@example.com',
    fullName: 'Jessica Smith',
    tier: 'VIP',
    headline: 'VC Investor',
    bio: 'Investing in early-stage Web3 infrastructure and consumer apps.',
    industry: 'VC',
    functionalArea: 'Investment',
    experienceLevel: 'Senior',
    skills: ['Due Diligence', 'Deal Flow', 'Tokenomics'],
    goals: ['Deal Flow', 'Networking'],
    visibility: 'Public',
    location: 'USA',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica'
  },
  {
    id: '8',
    email: 'anastasia@example.com',
    fullName: 'Anastasia Volkov',
    tier: 'Free',
    headline: 'DeFi Analyst',
    bio: 'Researching yield strategies and protocol mechanics.',
    industry: 'DeFi',
    functionalArea: 'Research',
    experienceLevel: 'Junior',
    skills: ['Data Analysis', 'Python', 'Dune Analytics'],
    goals: ['Learning', 'Mentorship'],
    visibility: 'Public',
    location: 'Russia',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anastasia'
  },
  {
    id: '9',
    email: 'leyla@example.com',
    fullName: 'Leyla Mammadova',
    tier: 'VIP',
    headline: 'Marketing Director',
    bio: 'Leading growth for a top NFT marketplace.',
    industry: 'NFTs',
    functionalArea: 'Marketing',
    experienceLevel: 'Senior',
    skills: ['Growth Hacking', 'Brand Strategy', 'Community'],
    goals: ['Hiring', 'Partnerships'],
    visibility: 'Public',
    location: 'Azerbaijan',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leyla'
  },
  {
    id: '10',
    email: 'priya@example.com',
    fullName: 'Priya Sharma',
    tier: 'Free',
    headline: 'Smart Contract Auditor',
    bio: 'Ensuring security for DeFi protocols.',
    industry: 'Security',
    functionalArea: 'Engineering',
    experienceLevel: 'Mid-Level',
    skills: ['Security Auditing', 'EVM', 'Whitehat'],
    goals: ['Freelance', 'Networking'],
    visibility: 'Public',
    location: 'India',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  },
  {
    id: '11',
    email: 'aminata@example.com',
    fullName: 'Aminata Diallo',
    tier: 'VIP',
    headline: 'Founder of Web3 Africa',
    bio: 'Empowering women in tech across the African continent.',
    industry: 'Education',
    functionalArea: 'Founder',
    experienceLevel: 'Executive',
    skills: ['Entrepreneurship', 'Public Speaking', 'Education'],
    goals: ['Fundraising', 'Impact'],
    visibility: 'Public',
    location: 'Africa',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aminata'
  },
  {
    id: '12',
    email: 'elena.b@example.com',
    fullName: 'Elena Petrovic',
    tier: 'Free',
    headline: 'Community Moderator',
    bio: 'Managing discord communities for gaming projects.',
    industry: 'Gaming',
    functionalArea: 'Community',
    experienceLevel: 'Junior',
    skills: ['Discord', 'Moderation', 'Gaming'],
    goals: ['Job Seeking', 'Learning'],
    visibility: 'Public',
    location: 'Balkan',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaB'
  },
  {
    id: '13',
    email: 'clara@example.com',
    fullName: 'Clara Müller',
    tier: 'VIP',
    headline: 'PhD Researcher',
    bio: 'Researching DAO governance models at HSG.',
    industry: 'Research',
    functionalArea: 'Research',
    experienceLevel: 'Mid-Level',
    skills: ['Academic Research', 'Governance', 'Writing'],
    goals: ['Collaboration', 'Speaking'],
    visibility: 'Public',
    location: 'St. Gallen',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Clara'
  },
  {
    id: '14',
    email: 'yasmina@example.com',
    fullName: 'Yasmina Benali',
    tier: 'Free',
    headline: 'Graphic Designer',
    bio: 'Creating visual identities for Web3 brands.',
    industry: 'Creative',
    functionalArea: 'Design',
    experienceLevel: 'Mid-Level',
    skills: ['Branding', 'Illustration', 'Adobe Suite'],
    goals: ['Freelance', 'Portfolio'],
    visibility: 'Public',
    location: 'Morocco',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmina'
  },
  {
    id: '15',
    email: 'ji-woo@example.com',
    fullName: 'Ji-Woo Kim',
    tier: 'VIP',
    headline: 'Metaverse Architect',
    bio: 'Designing virtual spaces for fashion brands.',
    industry: 'Metaverse',
    functionalArea: 'Design',
    experienceLevel: 'Senior',
    skills: ['3D Modeling', 'Unity', 'Spatial Design'],
    goals: ['Partnerships', 'Innovation'],
    visibility: 'Public',
    location: 'South Korea',
    createdAt: new Date().toISOString(),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JiWoo'
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

      updateUserTier: (userId, tier) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, tier } : u)
        }));
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
      name: 'wiw3-storage-v3',
    }
  )
);
