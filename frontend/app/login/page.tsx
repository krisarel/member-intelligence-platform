"use client";

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    login(email);
    // Check if login was successful (store updates synchronously but we might want to check if user exists)
    // For now, we assume the store handles it or we can check store state.
    // But since store.login doesn't return anything, we'll just redirect.
    // In a real app, we'd handle errors.
    
    router.push('/');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7507c5]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00d6b9]/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md z-10 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7507c5] to-[#00d6b9] flex items-center justify-center shadow-lg shadow-[#7507c5]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your email to access the member platform
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="maya@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#00d6b9] focus:ring-[#00d6b9]/20"
              />
            </div>
            <div className="text-xs text-slate-500 text-center">
              Try <span className="font-mono text-[#00d6b9]">maya@example.com</span> for VIP demo
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#7507c5] to-[#00d6b9] hover:from-[#5e059e] hover:to-[#00b89f] text-white border-0"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-sm text-slate-400 text-center">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#00d6b9] hover:text-[#00b89f] hover:underline">
                Join the community
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-950 px-2 text-slate-400">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-[#0077b5] hover:bg-[#006396] text-white border-0" type="button">
              <Linkedin className="mr-2 h-4 w-4" /> Sign in with LinkedIn
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}



