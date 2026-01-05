import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    const DB_NAME = process.env.DB_NAME || 'member_intelligence_platform';
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });
    console.log('Connected to MongoDB');
    console.log('Database:', mongoose.connection.db?.databaseName);

    // Clear existing users by dropping the collection
    try {
      await mongoose.connection.db?.dropCollection('users');
      console.log('Dropped users collection');
    } catch (error: any) {
      if (error.code === 26) {
        console.log('Users collection does not exist, creating fresh');
      } else {
        throw error;
      }
    }
    
    // Small delay to ensure operation is complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create 50 comprehensive test users with full onboarding data
    const users: any[] = [
      // Demo account for testing onboarding flow
      {
        email: 'aliya@example.com',
        password: 'hellothere',
        firstName: 'Aliya',
        lastName: 'Johnson',
        role: 'member' as const,
        membershipTier: 'free' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'light' as const,
        onboardingCompleted: false,
        lastLoginAt: new Date(),
        onboarding: {
          intentModes: [],
          currentStep: 0,
        },
      },
      // Demo account for VIP with completed onboarding
      {
        email: 'maya@example.com',
        password: 'password123',
        firstName: 'Maya',
        lastName: 'Rodriguez',
        role: 'member' as const,
        membershipTier: 'vip' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'dark' as const,
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: 'I want to mentor women entering Web3 and connect with other senior leaders in the DeFi space. I\'m also looking to explore speaking opportunities at major conferences.',
          intentModes: ['offering_mentorship', 'speaking', 'collaborating', 'hiring'],
          visibilityPreference: 'open' as const,
          domainFocus: ['DeFi', 'Web3 Infrastructure', 'Engineering', 'BD / Partnerships'],
          experienceLevel: 'senior' as const,
          skills: ['Solidity', 'Tokenomics', 'Executive Leadership', 'Public speaking', 'GTM Strategy'],
          availability: 'open_to_conversations' as const,
          contributionAreas: ['Mentoring', 'Speaking', 'Advisory support'],
          currentStep: 8,
          completedAt: new Date('2024-01-15'),
        },
      },
      {
        email: 'sofia.chen@example.com',
        password: 'password123',
        firstName: 'Sofia',
        lastName: 'Chen',
        role: 'admin' as const,
        membershipTier: 'admin' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'purple' as const,
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: 'Building the WiW3CH community in Switzerland and connecting women across different chapters. I want to organize more events and create opportunities for collaboration.',
          intentModes: ['organizing_events', 'volunteering', 'offering_mentorship', 'collaborating'],
          visibilityPreference: 'open' as const,
          domainFocus: ['Marketing / Growth', 'Operations', 'BD / Partnerships'],
          experienceLevel: 'senior' as const,
          skills: ['Community building', 'Marketing', 'Public speaking', 'DAO operations'],
          availability: 'open_to_conversations' as const,
          contributionAreas: ['Organizing events', 'Volunteering for WiW3CH', 'Mentoring'],
          currentStep: 8,
          completedAt: new Date('2024-01-10'),
        },
      },
      {
        email: 'elena.petrov@example.com',
        password: 'password123',
        firstName: 'Elena',
        lastName: 'Petrov',
        role: 'member' as const,
        membershipTier: 'vip' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'light' as const,
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: 'Leading engineering at Sygnum and looking to hire talented women engineers. Also interested in mentoring junior developers and contributing to open source projects.',
          intentModes: ['hiring', 'offering_mentorship', 'collaborating'],
          visibilityPreference: 'open' as const,
          domainFocus: ['CeFi', 'Web3 Infrastructure', 'Engineering'],
          experienceLevel: 'founder' as const,
          skills: ['Solidity', 'Python', 'Executive Leadership', 'Hiring'],
          availability: 'open_to_conversations' as const,
          contributionAreas: ['Mentoring', 'Job Opportunities (Hiring Recruiter)', 'Technical support'],
          currentStep: 8,
          completedAt: new Date('2024-02-01'),
        },
      },
      {
        email: 'sarah.kim@example.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Kim',
        role: 'member' as const,
        membershipTier: 'free' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'light' as const,
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: 'I\'m a product designer looking to transition into Web3. I want to learn from experienced designers and find freelance opportunities in the NFT and DeFi space.',
          intentModes: ['seeking_mentorship', 'learning', 'exploring_jobs', 'collaborating'],
          visibilityPreference: 'open' as const,
          domainFocus: ['NFTs', 'DeFi', 'Design', 'Product'],
          experienceLevel: 'mid_level' as const,
          skills: ['Vibe Coding', 'Public speaking'],
          availability: 'actively_looking' as const,
          contributionAreas: ['Volunteering for WiW3CH'],
          currentStep: 8,
          completedAt: new Date('2024-02-15'),
        },
      },
      {
        email: 'fatima.alsayed@example.com',
        password: 'password123',
        firstName: 'Fatima',
        lastName: 'Al-Sayed',
        role: 'member' as const,
        membershipTier: 'vip' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'dark' as const,
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: 'Advising Web3 projects on regulatory compliance in the MENA region. Looking to expand my network and explore partnership opportunities with European projects.',
          intentModes: ['collaborating', 'speaking', 'offering_mentorship'],
          visibilityPreference: 'review' as const,
          domainFocus: ['Legal / Compliance', 'DeFi', 'CeFi'],
          experienceLevel: 'senior' as const,
          skills: ['Executive Leadership', 'Public speaking'],
          availability: 'open_to_conversations' as const,
          contributionAreas: ['Advisory support', 'Speaking', 'Mentoring'],
          currentStep: 8,
          completedAt: new Date('2024-01-20'),
        },
      },
      // Continue with 45 more diverse users...
      {
        email: 'marie.dubois@example.com',
        password: 'password123',
        firstName: 'Marie',
        lastName: 'Dubois',
        role: 'member' as const,
        membershipTier: 'free' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'purple' as const,
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: 'Full stack developer passionate about Ethereum scalability. Looking for job opportunities and wanting to participate in hackathons with other women developers.',
          intentModes: ['exploring_jobs', 'learning', 'collaborating', 'seeking_mentorship'],
          visibilityPreference: 'open' as const,
          domainFocus: ['Web3 Infrastructure', 'Engineering', 'DeFi'],
          experienceLevel: 'mid_level' as const,
          skills: ['Solidity', 'Python', 'Vibe Coding'],
          availability: 'actively_looking' as const,
          contributionAreas: ['Technical support', 'Volunteering for WiW3CH'],
          currentStep: 8,
          completedAt: new Date('2024-02-20'),
        },
      },
      {
        email: 'jessica.smith@example.com',
        password: 'password123',
        firstName: 'Jessica',
        lastName: 'Smith',
        role: 'member' as const,
        membershipTier: 'vip' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'light' as const,
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: 'VC investor looking for deal flow in Web3 infrastructure and consumer apps. Want to connect with founders and offer mentorship to women building in the space.',
          intentModes: ['collaborating', 'offering_mentorship', 'hiring'],
          visibilityPreference: 'open' as const,
          domainFocus: ['Web3 Infrastructure', 'AI / ML', 'DeFi', 'NFTs'],
          experienceLevel: 'founder' as const,
          skills: ['Tokenomics', 'Executive Leadership', 'GTM Strategy'],
          availability: 'open_to_conversations' as const,
          contributionAreas: ['Mentoring', 'Advisory support', 'Job Opportunities (Hiring Recruiter)'],
          currentStep: 8,
          completedAt: new Date('2024-01-25'),
        },
      },
      {
        email: 'anastasia.volkov@example.com',
        password: 'password123',
        firstName: 'Anastasia',
        lastName: 'Volkov',
        role: 'member' as const,
        membershipTier: 'free' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'dark' as const,
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: 'DeFi analyst researching yield strategies. I\'m early in my career and looking for mentorship from experienced researchers and analysts in the space.',
          intentModes: ['seeking_mentorship', 'learning', 'exploring_jobs'],
          visibilityPreference: 'open' as const,
          domainFocus: ['DeFi', 'Research'],
          experienceLevel: 'exploring' as const,
          skills: ['Python', 'Tokenomics'],
          availability: 'actively_looking' as const,
          contributionAreas: ['Volunteering for WiW3CH'],
          currentStep: 8,
          completedAt: new Date('2024-02-25'),
        },
      },
      {
        email: 'leyla.mammadova@example.com',
        password: 'password123',
        firstName: 'Leyla',
        lastName: 'Mammadova',
        role: 'member' as const,
        membershipTier: 'vip' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'purple' as const,
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: 'Marketing Director at a top NFT marketplace. Looking to hire marketing talent and connect with other growth leaders in Web3.',
          intentModes: ['hiring', 'collaborating', 'offering_mentorship'],
          visibilityPreference: 'open' as const,
          domainFocus: ['NFTs', 'Marketing / Growth', 'Product'],
          experienceLevel: 'senior' as const,
          skills: ['GTM Strategy', 'Marketing', 'Community building', 'Hiring'],
          availability: 'open_to_conversations' as const,
          contributionAreas: ['Mentoring', 'Job Opportunities (Hiring Recruiter)', 'Speaking'],
          currentStep: 8,
          completedAt: new Date('2024-02-05'),
        },
      },
      {
        email: 'priya.sharma@example.com',
        password: 'password123',
        firstName: 'Priya',
        lastName: 'Sharma',
        role: 'member' as const,
        membershipTier: 'free' as const,
        authProviders: ['email' as const],
        uiThemePreference: 'light' as const,
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: 'Smart contract auditor ensuring security for DeFi protocols. Looking for freelance opportunities and wanting to network with other security professionals.',
          intentModes: ['exploring_jobs', 'collaborating', 'learning'],
          visibilityPreference: 'open' as const,
          domainFocus: ['DeFi', 'Engineering', 'Web3 Infrastructure'],
          experienceLevel: 'mid_level' as const,
          skills: ['Solidity', 'Python'],
          availability: 'actively_looking' as const,
          contributionAreas: ['Technical support', 'Mentoring'],
          currentStep: 8,
          completedAt: new Date('2024-02-28'),
        },
      },
    ];

    // Generate 40 more diverse users programmatically
    const firstNames = ['Aminata', 'Clara', 'Yuki', 'Isabella', 'Zara', 'Nadia', 'Olivia', 'Aisha', 'Luna', 'Sophia', 'Emma', 'Mia', 'Ava', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Camila', 'Ella', 'Avery', 'Sofia', 'Aria', 'Scarlett', 'Victoria', 'Madison', 'Grace', 'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoey', 'Nora', 'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Stella'];
    const lastNames = ['Diallo', 'Mueller', 'Tanaka', 'Garcia', 'Hassan', 'Ivanova', 'Johnson', 'Mohammed', 'Silva', 'Anderson', 'Martinez', 'Lee', 'Wilson', 'Taylor', 'Brown', 'Davis', 'Miller', 'Moore', 'Jackson', 'Martin', 'Thompson', 'White', 'Lopez', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams'];
    
    const domains = ['DeFi', 'CeFi', 'NFTs', 'Web3 Infrastructure', 'AI / ML', 'Engineering', 'Product', 'Marketing / Growth', 'Design', 'Legal / Compliance', 'Research', 'Operations'];
    const skills = ['Solidity', 'Python', 'Tokenomics', 'GTM Strategy', 'Hiring', 'Public speaking', 'DAO operations', 'Community building', 'Marketing', 'Executive Leadership', 'Vibe Coding', 'Blockchain Education'];

    for (let i = 0; i < 40; i++) {
      const firstName = firstNames[i];
      const lastName = lastNames[i];
      const domain1 = domains[i % domains.length];
      const domain2 = domains[(i + 1) % domains.length];
      
      users.push({
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        password: 'password123',
        firstName,
        lastName,
        role: 'member' as const,
        membershipTier: (i % 3 === 0 ? 'vip' : 'free') as 'free' | 'vip',
        authProviders: ['email' as const],
        uiThemePreference: (['light', 'dark', 'purple'][i % 3]) as 'light' | 'dark' | 'purple',
        onboardingCompleted: true,
        lastLoginAt: new Date(),
        onboarding: {
          coreIntent: `Passionate about ${domain1} and ${domain2}. Looking to connect with like-minded professionals and contribute to the Web3 ecosystem.`,
          intentModes: i % 2 === 0 ? ['collaborating', 'learning', 'seeking_mentorship'] : ['offering_mentorship', 'speaking', 'collaborating'],
          visibilityPreference: 'open' as const,
          domainFocus: [domain1, domain2],
          experienceLevel: (['exploring', 'mid_level', 'senior', 'founder'][i % 4]) as 'exploring' | 'mid_level' | 'senior' | 'founder',
          skills: [skills[i % skills.length], skills[(i + 1) % skills.length], skills[(i + 2) % skills.length]],
          availability: (i % 3 === 0 ? 'actively_looking' : 'open_to_conversations') as 'actively_looking' | 'open_to_conversations',
          contributionAreas: i % 2 === 0 ? ['Mentoring', 'Volunteering for WiW3CH'] : ['Speaking', 'Technical support'],
          currentStep: 8,
          completedAt: new Date(2024, 0, 15 + i),
        },
      });
    }

    // Insert users
    const createdUsers: any[] = [];
    for (const userData of users) {
      const user: any = await User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.email} (${user.membershipTier})`);
    }

    console.log(`\n🎉 Seed completed successfully! Created ${createdUsers.length} users.`);
    console.log('\n📋 Demo test accounts (matching auth page):');
    console.log('━'.repeat(80));
    console.log('1. aliya@example.com / hellothere (Free tier, test onboarding flow)');
    console.log('2. maya@example.com / password123 (VIP tier, skip onboarding)');
    console.log('3. sofia.chen@example.com / password123 (Admin, Community lead)');
    console.log('4. elena.petrov@example.com / password123 (VIP tier, Engineering leader)');
    console.log('5. sarah.kim@example.com / password123 (Free tier, Designer)');
    console.log('6. ... and 45 more users with complete profiles!');
    console.log('━'.repeat(80));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();