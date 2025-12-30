import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

let openai: OpenAI;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

export interface IntentAnalysisResult {
  intentType: 'receiving' | 'giving' | 'both';
  categories: Array<{
    category: string;
    subcategories: string[];
    confidence: number;
  }>;
  domains: string[];
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  availability?: 'immediate' | 'within_month' | 'flexible' | 'not_specified';
}

export class OpenAIService {
  private static instance: OpenAIService;

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async analyzeIntent(rawText: string): Promise<IntentAnalysisResult> {
    const systemPrompt = `You are an AI assistant specialized in analyzing user intent for a professional women's community platform (WiW3CH) focused on Web3, DeFi, CeFi, and related technologies.

Your task is to analyze natural language intent statements and extract structured information.

Intent Types:
- "receiving": User is seeking something (mentorship, job, speaking opportunity, etc.)
- "giving": User is offering something (mentoring, hiring, providing opportunities, etc.)
- "both": User has both receiving and giving intents

Categories (with subcategories):
- Mentorship: seeking_mentor, offering_mentorship, peer_mentorship
- Career: job_seeking, hiring, career_transition, networking
- Speaking: seeking_speaking_slots, offering_speaking_opportunities, panel_participation
- Learning: skill_development, knowledge_sharing, workshops, courses
- Collaboration: project_collaboration, partnership, co_founding
- Investment: seeking_funding, angel_investing, vc_connections
- Community: event_organizing, community_building, introductions

Domains:
- DeFi, CeFi, Web3, Blockchain, Smart Contracts, NFTs, DAOs, Tokenomics
- Engineering, Product, Marketing, Design, Operations, Legal, Compliance
- AI/ML, Data Science, Security, Infrastructure

Experience Levels:
- beginner: New to the field, learning basics
- intermediate: Some experience, building skills
- advanced: Experienced professional
- expert: Industry leader, extensive experience

Availability:
- immediate: Available now
- within_month: Available within 30 days
- flexible: No specific timeline
- not_specified: Not mentioned

Return a JSON object with the analysis.`;

    const userPrompt = `Analyze this intent statement and return structured data:

"${rawText}"

Return ONLY a valid JSON object with this exact structure:
{
  "intentType": "receiving" | "giving" | "both",
  "categories": [
    {
      "category": "category_name",
      "subcategories": ["subcategory1", "subcategory2"],
      "confidence": 0.0-1.0
    }
  ],
  "domains": ["domain1", "domain2"],
  "experienceLevel": "beginner" | "intermediate" | "advanced" | "expert" | null,
  "availability": "immediate" | "within_month" | "flexible" | "not_specified"
}`;

    try {
      const client = getOpenAIClient();
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      const result = JSON.parse(content) as IntentAnalysisResult;
      
      return result;
    } catch (error: any) {
      console.error('Error analyzing intent with OpenAI:', error.message);
      throw new Error(`Failed to analyze intent: ${error.message}`);
    }
  }

  async generateMatchExplanation(
    intent1: any,
    intent2: any,
    user1Name: string,
    user2Name: string
  ): Promise<string> {
    const systemPrompt = `You are an AI assistant that explains why two members of a professional community are a good match based on their intents. Be warm, professional, and specific. Focus on complementary goals and shared interests.`;

    const userPrompt = `Generate a brief, friendly explanation (2-3 sentences) for why these two members are a good match:

Member 1 (${user1Name}):
Intent Type: ${intent1.intentType}
Raw Intent: "${intent1.rawText}"
Domains: ${intent1.domains.join(', ')}

Member 2 (${user2Name}):
Intent Type: ${intent2.intentType}
Raw Intent: "${intent2.rawText}"
Domains: ${intent2.domains.join(', ')}

Focus on what they can offer each other and shared interests.`;

    try {
      const client = getOpenAIClient();
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      return completion.choices[0].message.content || 'You both have complementary goals in the community.';
    } catch (error: any) {
      console.error('Error generating match explanation:', error.message);
      return 'You both have complementary goals and shared interests in the community.';
    }
  }
}

export default OpenAIService.getInstance();