"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, ArrowRight, Users, Briefcase, MessageSquare, Linkedin, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Dashboard() {
  const { currentUser, recommendations, refreshRecommendations, requestIntro, jobs, login } = useStore();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        // No auth data, redirect to login
        router.push('/login');
        return;
      }

      // If we have auth data but no currentUser in store, sync it
      if (!currentUser) {
        try {
          const userData = JSON.parse(storedUser);
          login(userData.email);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          router.push('/login');
          return;
        }
      }
      
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [currentUser, router, login]);

  useEffect(() => {
    if (currentUser && !isCheckingAuth) {
      refreshRecommendations();
    }
  }, [currentUser, isCheckingAuth, refreshRecommendations]);

  if (isCheckingAuth || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d6b9]"></div>
      </div>
    );
  }

  const handleRequestIntro = (userId: string, name: string) => {
    requestIntro(userId, `Hi ${name}, I'd love to connect!`);
    toast.success(`Introduction requested to ${name}`);
  };

  const recentJobs = jobs.slice(0, 3);

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#7507c5] to-[#00d6b9]">
            Welcome back, {currentUser.fullName.split(' ')[0]}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here&apos;s what&apos;s happening in your network today.
          </p>
        </div>
        <div className="flex gap-2">
          {currentUser.tier === 'Free' && (
            <Button onClick={() => router.push('/settings')} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
              Upgrade to VIP
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completion */}
      <Card className="bg-gradient-to-br from-[#1f7664] to-[#000000] border-slate-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d6b9]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="flex-1 w-full">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">Profile Completion</h3>
              <span className="text-violet-300">85%</span>
            </div>
            <Progress value={85} className="h-2 bg-slate-700" />
            <p className="text-sm text-slate-400 mt-2">
              Add your <span className="text-white font-medium">GitHub URL</span> to reach 100% and unlock more matches.
            </p>
          </div>
          <Button variant="outline" className="border-slate-600 hover:bg-slate-700 text-white whitespace-nowrap" onClick={() => router.push('/profile')}>
            Complete Profile
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recommendations */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#7507c5] dark:text-[#00d6b9]" />
              Recommended Connections
            </h2>
            <Button variant="ghost" size="sm" onClick={refreshRecommendations} className="text-slate-500 hover:text-[#7507c5] dark:hover:text-[#00d6b9]">
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recommendations.map((rec, i) => {
              const user = useStore.getState().users.find(u => u.id === rec.recommendedUserId);
              if (!user) return null;

              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <Avatar className="w-16 h-16 border-2 border-[#faf2ff] dark:border-[#1f7664]">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.fullName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{user.fullName}</h3>
                              <p className="text-slate-500 dark:text-slate-400 text-sm">{user.headline}</p>
                            </div>
                            <Badge variant="secondary" className="bg-[#faf2ff] text-[#7507c5] dark:bg-[#1f7664]/30 dark:text-[#00d6b9]">
                              {rec.score}% Match
                            </Badge>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            {rec.reasons.map((reason, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-slate-200 dark:border-slate-700">
                                {reason}
                              </Badge>
                            ))}
                          </div>

                          <div className="mt-4 flex gap-3">
                            <Button 
                              size="sm" 
                              className="bg-[#7507c5] hover:bg-[#5e059e] text-white dark:bg-[#00d6b9] dark:hover:bg-[#00b89f] dark:text-black"
                              onClick={() => handleRequestIntro(user.id, user.fullName)}
                            >
                              Request Intro
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => router.push(`/members/${user.id}`)}>
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Stats & Jobs */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md text-blue-600 dark:text-blue-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Intros Pending</span>
                </div>
                <span className="font-bold">2</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-md text-green-600 dark:text-green-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Connections</span>
                </div>
                <span className="font-bold">14</span>
              </div>
            </CardContent>
          </Card>

          {/* Featured Jobs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Featured Jobs</CardTitle>
              <Briefcase className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent className="space-y-4">
              {recentJobs.map(job => (
                <div key={job.id} className="group cursor-pointer" onClick={() => router.push(`/jobs/${job.id}`)}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm group-hover:text-[#7507c5] dark:group-hover:text-[#00d6b9] transition-colors">{job.title}</h4>
                    {job.isVipOnly && <Badge className="text-[10px] h-5 bg-[#00d6b9] text-black">VIP</Badge>}
                  </div>
                  <p className="text-xs text-slate-500">{job.company} • {job.location}</p>
                  <div className="h-[1px] w-full bg-slate-100 dark:bg-slate-800 my-3" />
                </div>
              ))}
              <Button variant="ghost" className="w-full text-sm text-[#7507c5] hover:text-[#5e059e] hover:bg-[#faf2ff] dark:text-[#00d6b9] dark:hover:text-[#00b89f] dark:hover:bg-[#1f7664]/20" onClick={() => router.push('/jobs')}>
                View All Jobs <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* LinkedIn Integration */}
          <Card className="overflow-hidden border-blue-200 dark:border-blue-900/50">
            <CardHeader className="bg-[#0077b5]/10 pb-3">
              <div className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-[#0077b5]" />
                <CardTitle className="text-sm font-bold text-[#0077b5]">Latest from WiW3CH</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-gradient-to-br from-[#7507c5] to-[#00d6b9] flex items-center justify-center text-white font-bold text-xs shrink-0">
                  W3
                </div>
                <div>
                  <p className="text-xs font-semibold">Women in Web3 Switzerland</p>
                  <p className="text-[10px] text-slate-500">2 days ago</p>
                </div>
              </div>
              
              <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-4">
                We&apos;re thrilled to announce our upcoming partnership with the Web3 Foundation! 🚀 Join us next week for an exclusive fireside chat about the future of decentralized governance. #WomenInWeb3 #Blockchain #Switzerland
              </p>
              
              {/* Mock Image/Media */}
              <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center text-slate-400 text-xs">
                [Event Photo Placeholder]
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0077b5]">
                    <ThumbsUp className="w-3 h-3" /> 42
                  </button>
                  <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0077b5]">
                    <MessageCircle className="w-3 h-3" /> 8
                  </button>
                </div>
                <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0077b5]">
                  <Share2 className="w-3 h-3" /> Share
                </button>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs mt-2"
                onClick={() => window.open('https://www.linkedin.com/company/wiw3ch', '_blank')}
              >
                View on LinkedIn
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}