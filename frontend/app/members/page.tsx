"use client";

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Briefcase, Star } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function MembersPage() {
  const { users, currentUser, requestIntro } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const filteredUsers = users.filter(user => {
    if (user.id === currentUser?.id) return false;
    
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = selectedIndustry ? user.industry === selectedIndustry : true;
    
    return matchesSearch && matchesIndustry;
  });

  const industries = Array.from(new Set(users.map(u => u.industry).filter(Boolean)));

  const handleRequestIntro = (userId: string, name: string) => {
    requestIntro(userId, `Hi ${name}, I'd love to connect!`);
    toast.success(`Introduction requested to ${name}`);
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Connect with {users.length - 1} other women in Web3.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by name, headline, or skills..." 
            className="pl-10 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Button 
            variant={selectedIndustry === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedIndustry(null)}
          >
            All
          </Button>
          {industries.map(ind => (
            <Button 
              key={ind}
              variant={selectedIndustry === ind ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedIndustry(ind as string)}
            >
              {ind}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 group">
              <CardContent className="p-6 flex-1 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 border-4 border-slate-50 dark:border-slate-900 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl">{user.fullName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  {user.tier === 'VIP' && (
                    <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-full shadow-sm" title="VIP Member">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-lg mb-1">{user.fullName}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 h-10">
                  {user.headline || user.bio}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {user.skills.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {skill}
                    </Badge>
                  ))}
                  {user.skills.length > 3 && (
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      +{user.skills.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="w-full mt-auto space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{user.industry}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                  onClick={() => handleRequestIntro(user.id, user.fullName)}
                >
                  Request Intro
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
