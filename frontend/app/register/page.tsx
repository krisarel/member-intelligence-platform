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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    industry: '',
    goals: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useStore();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    register({
      email: formData.email,
      fullName: formData.fullName,
      industry: formData.industry,
      goals: ['Networking'], // Default goal
      skills: [],
      tier: 'Free',
      visibility: 'Public'
    });
    
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
          <CardTitle className="text-2xl font-bold text-white">Join the Community</CardTitle>
          <CardDescription className="text-slate-400">
            Create your profile to connect with women in Web3
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-200">Full Name</Label>
              <Input 
                id="fullName" 
                placeholder="Jane Doe" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#00d6b9] focus:ring-[#00d6b9]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="jane@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#00d6b9] focus:ring-[#00d6b9]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-slate-200">Primary Industry</Label>
              <Select onValueChange={(val) => setFormData({...formData, industry: val})}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DeFi">DeFi</SelectItem>
                  <SelectItem value="NFTs">NFTs</SelectItem>
                  <SelectItem value="DAO">DAO</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="CeFi">CeFi</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#7507c5] to-[#00d6b9] hover:from-[#5e059e] hover:to-[#00b89f] text-white border-0"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-sm text-slate-400 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-[#00d6b9] hover:text-[#00b89f] hover:underline">
                Sign in
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-950 px-2 text-slate-400">Or register with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-[#0077b5] hover:bg-[#006396] text-white border-0" type="button">
              <Linkedin className="mr-2 h-4 w-4" /> Sign up with LinkedIn
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}



