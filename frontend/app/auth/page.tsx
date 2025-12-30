"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Linkedin } from 'lucide-react';
import { useStore } from '@/lib/store';
import { config } from '@/lib/config';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login: storeLogin, register: storeRegister } = useStore();
  
  // Get mode from URL query parameter, default to 'signin'
  const mode = searchParams.get('mode') || 'signin';
  const [activeTab, setActiveTab] = useState(mode);
  
  // Sign in state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState('');
  
  // Sign up state
  const [signUpData, setSignUpData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  });
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  // Update active tab when URL changes
  useEffect(() => {
    const urlMode = searchParams.get('mode') || 'signin';
    setActiveTab(urlMode);
  }, [searchParams]);

  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/auth?mode=${value}`);
    // Clear errors when switching tabs
    setSignInError('');
    setSignUpError('');
  };

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignInLoading(true);
    setSignInError('');
    
    try {
      const response = await fetch(`${config.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

      // Store token
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Update Zustand store with user data
      storeLogin(data.data.user.email);

      // Route based on onboarding status
      if (data.data.requiresOnboarding) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setSignInError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsSignInLoading(false);
    }
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignUpLoading(true);
    setSignUpError('');
    
    // Validate fields
    if (!signUpData.firstName || !signUpData.lastName || !signUpData.email || !signUpData.password) {
      setSignUpError('Please fill in all fields');
      setIsSignUpLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setSignUpError('Password must be at least 6 characters');
      setIsSignUpLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signUpData.email,
          firstName: signUpData.firstName,
          lastName: signUpData.lastName,
          password: signUpData.password,
          authProvider: 'email',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      // Store token
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Update Zustand store with user data
      storeLogin(data.data.user.email);

      // New users always go to onboarding
      router.push('/onboarding');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setSignUpError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSignUpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-foreground/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md z-10 bg-card/80 backdrop-blur-xl border-border shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {activeTab === 'signin' ? 'Welcome back' : 'Join the WiW3CH Community today!'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {activeTab === 'signin'
              ? 'Enter your credentials to access the member platform'
              : 'Create your profile to connect with women in Web3 and AI'}
          </CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full px-6">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted">
            <TabsTrigger
              value="signin"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin" className="mt-0">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                {signInError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {signInError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-foreground">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="aliya@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-foreground">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Demo accounts:</div>
                  <div>• <span className="font-mono text-primary">aliya@example.com</span> / <span className="font-mono">hellothere</span> (test onboarding)</div>
                  <div>• <span className="font-mono text-primary">maya@example.com</span> / <span className="font-mono">password123</span> (VIP, skip onboarding)</div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 px-6">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                  disabled={isSignInLoading}
                >
                  {isSignInLoading ? "Signing in..." : "Sign In"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-[#0077b5] hover:bg-[#006396] text-white border-0"
                  type="button"
                >
                  <Linkedin className="mr-2 h-4 w-4" /> Sign in with LinkedIn
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="mt-0">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-3">
                {signUpError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {signUpError}
                  </div>
                )}
                <div className="space-y-1">
                  <Label htmlFor="signup-firstname" className="text-foreground">First Name</Label>
                  <Input
                    id="signup-firstname"
                    placeholder="Jane"
                    value={signUpData.firstName}
                    onChange={(e) => setSignUpData({...signUpData, firstName: e.target.value})}
                    required
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-lastname" className="text-foreground">Last Name</Label>
                  <Input
                    id="signup-lastname"
                    placeholder="Doe"
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData({...signUpData, lastName: e.target.value})}
                    required
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="jane@example.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                    required
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1 pb-2">
                  <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                    required
                    minLength={6}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3 px-6">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                  disabled={isSignUpLoading}
                >
                  {isSignUpLoading ? "Creating Account..." : "Create Account"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or register with</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-[#0077b5] hover:bg-[#006396] text-white border-0"
                  type="button"
                >
                  <Linkedin className="mr-2 h-4 w-4" /> Sign up with LinkedIn
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}