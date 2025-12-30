"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import { config } from '@/lib/config';

// Intent mode options for Prompt 2
const INTENT_MODES = [
  { value: 'seeking_mentorship', label: 'Seeking mentorship' },
  { value: 'offering_mentorship', label: 'Offering mentorship' },
  { value: 'exploring_jobs', label: 'Exploring job opportunities' },
  { value: 'hiring', label: 'Hiring / building a team' },
  { value: 'speaking', label: 'Speaking at events' },
  { value: 'organizing_events', label: 'Organizing events or panels' },
  { value: 'volunteering', label: 'Volunteering or contributing' },
  { value: 'learning', label: 'Learning / exploring' },
  { value: 'collaborating', label: 'Collaborating on projects' },
  { value: 'recruitment_hiring', label: 'Recruitment (Hiring)' },
  { value: 'recruitment_seeking', label: 'Recruitment (Seeking Opportunities)' },
];

// Domain focus options for Prompt 4
const DOMAIN_OPTIONS = [
  'DeFi', 'CeFi', 'AI / ML', 'Web3 Infrastructure', 'Engineering',
  'Product', 'Marketing / Growth', 'BD / Partnerships', 'Legal / Compliance',
  'Research', 'Design', 'Operations', 'Other'
];

// Skills options for Prompt 6
const SKILL_OPTIONS = [
  'Solidity', 'Python', 'Tokenomics', 'GTM Strategy', 'Hiring',
  'Public speaking', 'DAO operations', 'Community building', 'Marketing',
  'Executive Leadership', 'Vibe Coding', 'Blockchain Education'
];

// Contribution options for Prompt 8
const CONTRIBUTION_OPTIONS = [
  'Mentoring', 'Speaking', 'Volunteering for WiW3CH', 'Organizing events',
  'Technical support', 'Advisory support', 'Job Opportunities (Hiring Recruiter)'
];

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Form state for all 8 prompts
  const [formData, setFormData] = useState({
    coreIntent: '',
    intentModes: [] as string[],
    visibilityPreference: '',
    domainFocus: [] as string[],
    experienceLevel: '',
    skills: [] as string[],
    availability: '',
    contributionAreas: [] as string[],
  });

  // Calculate progress
  const progress = (currentStep / 8) * 100;

  // Handle navigation
  const goToNextStep = async () => {
    // Validate required fields
    if (currentStep === 1 && !formData.coreIntent.trim()) {
      alert('Please share your intent before continuing');
      return;
    }
    if (currentStep === 2 && formData.intentModes.length === 0) {
      alert('Please select at least one intent mode');
      return;
    }
    if (currentStep === 3 && !formData.visibilityPreference) {
      alert('Please select a visibility preference');
      return;
    }

    // Save current step data to backend
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      let payload: any = {};

      switch (currentStep) {
        case 1:
          endpoint = '/api/onboarding/step/1';
          payload = { coreIntent: formData.coreIntent };
          break;
        case 2:
          endpoint = '/api/onboarding/step/2';
          payload = { intentModes: formData.intentModes };
          break;
        case 3:
          endpoint = '/api/onboarding/step/3';
          payload = { visibilityPreference: formData.visibilityPreference };
          break;
        case 4:
          endpoint = '/api/onboarding/step/4';
          payload = { domainFocus: formData.domainFocus };
          break;
        case 5:
          endpoint = '/api/onboarding/step/5';
          payload = { experienceLevel: formData.experienceLevel };
          break;
        case 6:
          endpoint = '/api/onboarding/step/6';
          payload = { skills: formData.skills };
          break;
        case 7:
          endpoint = '/api/onboarding/step/7';
          payload = { availability: formData.availability };
          break;
        case 8:
          endpoint = '/api/onboarding/step/8';
          payload = { contributionAreas: formData.contributionAreas };
          break;
      }

      const response = await fetch(`${config.apiUrl.replace('/api', '')}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save step');
      }

      if (currentStep < 8) {
        setCurrentStep(currentStep + 1);
      } else {
        // Complete onboarding
        await completeOnboarding();
      }
    } catch (error) {
      console.error('Error saving step:', error);
      alert('Failed to save progress. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      // Update localStorage to reflect onboarding completion
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.onboardingCompleted = true;
        localStorage.setItem('user', JSON.stringify(userData));
      }

      // Show completion screen
      setShowCompletion(true);

      // Redirect to dashboard after 4 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 4000);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Failed to complete onboarding. Please try again.');
    }
  };

  const skipOptionalStep = () => {
    if (currentStep >= 4 && currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 8) {
      completeOnboarding();
    }
  };

  // Toggle checkbox selection
  const toggleSelection = (field: 'intentModes' | 'domainFocus' | 'skills' | 'contributionAreas', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      } else {
        // Limit skills to 10
        if (field === 'skills' && current.length >= 10) {
          alert('Maximum 10 skills allowed');
          return prev;
        }
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  // Show completion screen
  if (showCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden p-4">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7507c5]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00d6b9]/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <Card className="w-full max-w-2xl z-10 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardContent className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7507c5] to-[#00d6b9] flex items-center justify-center shadow-lg shadow-[#7507c5]/20 animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white">
                Thank you for completing the prompts!
              </h1>
              
              <div className="space-y-3 text-slate-300 text-lg">
                <p>
                  We are identifying your intent and will prepare recommended connections with you shortly.
                </p>
                <p className="text-[#00d6b9] font-medium">
                  You will now be directed to the dashboard of the WiW3CH Intelligence Platform.
                </p>
                <p className="text-xl font-semibold text-white mt-6">
                  Enjoy! ✨
                </p>
              </div>
            </div>

            <div className="pt-6">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d6b9]"></div>
              </div>
              <p className="text-sm text-slate-500 mt-4">Redirecting to dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && !currentUser) {
      router.push('/auth?mode=signin');
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden p-4">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7507c5]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00d6b9]/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-2xl z-10 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7507c5] to-[#00d6b9] flex items-center justify-center shadow-lg shadow-[#7507c5]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-white text-center">
              Welcome to WiW3CH
            </CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Step {currentStep} of 8 • {currentStep <= 3 ? 'Required' : 'Optional'}
            </CardDescription>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Prompt 1: Core Intent */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coreIntent" className="text-slate-200 text-lg">
                  Why are you joining the WiW3CH community right now?
                </Label>
                <p className="text-sm text-slate-400">
                  In your own words — what are you hoping to receive or contribute?
                </p>
                <Textarea
                  id="coreIntent"
                  placeholder="I'm looking for mentorship as I transition into DeFi..."
                  value={formData.coreIntent}
                  onChange={(e) => setFormData({ ...formData, coreIntent: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 min-h-[150px]"
                  maxLength={2000}
                />
                <p className="text-xs text-slate-500 text-right">
                  {formData.coreIntent.length} / 2000 characters
                </p>
              </div>
              <p className="text-xs text-slate-500 italic">
                Examples: "I'm looking for mentorship as I transition into DeFi." • "I want to mentor women entering Web3 marketing." • "I'm hoping to speak at events and contribute to the community."
              </p>
            </div>
          )}

          {/* Prompt 2: Intent Modes */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200 text-lg">
                  Which best describes what you're open to right now?
                </Label>
                <p className="text-sm text-slate-400">Select all that apply</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {INTENT_MODES.map((mode) => (
                  <div key={mode.value} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Checkbox
                      id={mode.value}
                      checked={formData.intentModes.includes(mode.value)}
                      onCheckedChange={() => toggleSelection('intentModes', mode.value)}
                      className="border-white/20"
                    />
                    <Label htmlFor={mode.value} className="text-slate-200 cursor-pointer flex-1">
                      {mode.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt 3: Visibility */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200 text-lg">
                  How visible would you like to be to other members?
                </Label>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'open', label: 'Open to connections and opportunities', desc: 'Your profile is visible and you can be contacted by other members' },
                  { value: 'review', label: 'Open, but prefer to review requests', desc: 'You will receive connection requests that you can approve' },
                  { value: 'limited', label: 'Limited visibility for now', desc: 'Your profile is private and you control who can see it' },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setFormData({ ...formData, visibilityPreference: option.value })}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.visibilityPreference === option.value
                        ? 'border-[#00d6b9] bg-[#00d6b9]/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-slate-200">{option.label}</div>
                    <div className="text-sm text-slate-400 mt-1">{option.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt 4: Domain Focus */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200 text-lg">
                  What areas are you most active or interested in?
                </Label>
                <p className="text-sm text-slate-400">Optional • Select all that apply</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DOMAIN_OPTIONS.map((domain) => (
                  <div key={domain} className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Checkbox
                      id={`domain-${domain}`}
                      checked={formData.domainFocus.includes(domain)}
                      onCheckedChange={() => toggleSelection('domainFocus', domain)}
                      className="border-white/20"
                    />
                    <Label htmlFor={`domain-${domain}`} className="text-slate-200 cursor-pointer text-sm">
                      {domain}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt 5: Experience Level */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200 text-lg">
                  How would you describe your experience level?
                </Label>
                <p className="text-sm text-slate-400">Optional</p>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'exploring', label: 'Exploring / early career' },
                  { value: 'mid_level', label: 'Mid-level' },
                  { value: 'senior', label: 'Senior / leadership' },
                  { value: 'founder', label: 'Founder / executive' },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setFormData({ ...formData, experienceLevel: option.value })}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.experienceLevel === option.value
                        ? 'border-[#00d6b9] bg-[#00d6b9]/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-slate-200">{option.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt 6: Skills */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200 text-lg">
                  What skills or strengths best describe you?
                </Label>
                <p className="text-sm text-slate-400">Optional • Up to 10 skills</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SKILL_OPTIONS.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={formData.skills.includes(skill)}
                      onCheckedChange={() => toggleSelection('skills', skill)}
                      className="border-white/20"
                      disabled={formData.skills.length >= 10 && !formData.skills.includes(skill)}
                    />
                    <Label htmlFor={`skill-${skill}`} className="text-slate-200 cursor-pointer text-sm">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Selected: {formData.skills.length} / 10
              </p>
            </div>
          )}

          {/* Prompt 7: Availability */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200 text-lg">
                  What best describes your availability right now?
                </Label>
                <p className="text-sm text-slate-400">Optional</p>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'actively_looking', label: 'Actively looking for opportunities' },
                  { value: 'open_to_conversations', label: 'Open to conversations' },
                  { value: 'limited', label: 'Limited availability' },
                  { value: 'not_available', label: 'Not available right now' },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setFormData({ ...formData, availability: option.value })}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.availability === option.value
                        ? 'border-[#00d6b9] bg-[#00d6b9]/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-slate-200">{option.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt 8: Contribution */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-200 text-lg">
                  How would you like to contribute to WiW3CH?
                </Label>
                <p className="text-sm text-slate-400">Optional • Select all that apply</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {CONTRIBUTION_OPTIONS.map((contribution) => (
                  <div key={contribution} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Checkbox
                      id={`contribution-${contribution}`}
                      checked={formData.contributionAreas.includes(contribution)}
                      onCheckedChange={() => toggleSelection('contributionAreas', contribution)}
                      className="border-white/20"
                    />
                    <Label htmlFor={`contribution-${contribution}`} className="text-slate-200 cursor-pointer">
                      {contribution}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="ghost"
              onClick={goToPreviousStep}
              disabled={currentStep === 1 || isLoading}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex gap-2">
              {currentStep >= 4 && (
                <Button
                  variant="ghost"
                  onClick={skipOptionalStep}
                  disabled={isLoading}
                  className="text-slate-400 hover:text-white"
                >
                  Skip
                </Button>
              )}
              <Button
                onClick={goToNextStep}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#7507c5] to-[#00d6b9] hover:from-[#5e059e] hover:to-[#00b89f] text-white"
              >
                {isLoading ? 'Saving...' : currentStep === 8 ? 'Complete' : 'Continue'}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>

          {currentStep >= 4 && (
            <p className="text-xs text-slate-500 text-center italic">
              You can change this anytime in your settings
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}