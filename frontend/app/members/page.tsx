"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Briefcase, Star } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import RequestIntroDialog, { IntroRequestData } from '@/components/RequestIntroDialog';
import ProfileDetailDialog from '@/components/ProfileDetailDialog';
import { config } from '@/lib/config';

interface User {
  id: string;
  email: string;
  fullName: string;
  tier: string;
  headline: string;
  bio: string;
  industry: string;
  skills: string[];
  avatar: string;
  location?: string;
  linkedInUrl?: string;
  telegramHandle?: string;
  experienceLevel?: string;
  functionalArea?: string;
}

export default function MembersPage() {
  const { currentUser, users: storeUsers } = useStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [introDialogOpen, setIntroDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users from API, fallback to store if API fails
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, using store users');
          // Fallback to store users if not logged in
          const formattedStoreUsers = storeUsers.map(u => ({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            tier: u.tier,
            headline: u.headline || u.bio || 'Member',
            bio: u.bio || '',
            industry: u.industry || 'Web3',
            skills: u.skills || [],
            avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
          }));
          setUsers(formattedStoreUsers);
          setIsLoading(false);
          return;
        }

        console.log('Fetching users from API...');
        const response = await fetch(`${config.apiUrl}/profile/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.log('API returned status:', response.status, '- Using fallback data');
          // Fallback to store users on API error
          const formattedStoreUsers = storeUsers.map(u => ({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            tier: u.tier,
            headline: u.headline || u.bio || 'Member',
            bio: u.bio || '',
            industry: u.industry || 'Web3',
            skills: u.skills || [],
            avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
          }));
          setUsers(formattedStoreUsers);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        console.log('Fetched users from API:', data.data?.length || 0);
        setUsers(data.data || []);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        // Fallback to store users on error
        console.log('Error occurred, using store users as fallback');
        const formattedStoreUsers = storeUsers.map(u => ({
          id: u.id,
          email: u.email,
          fullName: u.fullName,
          tier: u.tier,
          headline: u.headline || u.bio || 'Member',
          bio: u.bio || '',
          industry: u.industry || 'Web3',
          skills: u.skills || [],
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
        }));
        setUsers(formattedStoreUsers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [storeUsers]);

  const filteredUsers = users.filter(user => {
    if (user.id === currentUser?.id) return false;
    
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = selectedIndustry ? user.industry === selectedIndustry : true;
    
    return matchesSearch && matchesIndustry;
  });

  const industries = Array.from(new Set(users.map(u => u.industry).filter(Boolean)));

  const handleProfileClick = (user: User) => {
    setSelectedUser(user);
    setProfileDialogOpen(true);
  };

  const handleRequestIntroClick = () => {
    setProfileDialogOpen(false);
    setIntroDialogOpen(true);
  };

  const handleSubmitIntroRequest = async (data: IntroRequestData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please log in to request introductions');
        return;
      }

      const response = await fetch(`${config.apiUrl}/introductions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send introduction request');
      }

      toast.success(`Introduction request sent to ${selectedUser?.fullName}!`);
      setIntroDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Error sending introduction request:', error);
      toast.error(error.message || 'Failed to send introduction request');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Connect with {users.length} women in Web3.
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
            <Card
              className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 group overflow-hidden relative cursor-pointer"
              onClick={() => handleProfileClick(user)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#7507c5]/5 via-transparent to-[#00d6b9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <CardContent className="p-6 flex-1 flex flex-col items-center text-center relative z-10">
                <div className="relative mb-4">
                  {/* Gradient ring effect matching the futuristic Web3 aesthetic */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7507c5] via-[#00d6b9] to-[#1f7664] p-[3px] group-hover:p-[4px] transition-all duration-300">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900" />
                  </div>
                  <Avatar className="w-24 h-24 relative z-10 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-[#faf2ff] to-[#eef6f5] text-[#7507c5]">
                      {user.fullName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {(user.tier === 'VIP' || user.tier === 'vip') && (
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-[#00d6b9] to-[#1f7664] text-white p-1.5 rounded-full shadow-lg z-20" title="VIP Member">
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
                  className="w-full bg-[#7507c5] hover:bg-[#5e059e] text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(user);
                    setIntroDialogOpen(true);
                  }}
                >
                  Request Intro
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Profile Detail Dialog */}
      <ProfileDetailDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        user={selectedUser}
        onRequestIntro={handleRequestIntroClick}
      />

      {/* Request Intro Dialog */}
      {selectedUser && (
        <RequestIntroDialog
          open={introDialogOpen}
          onOpenChange={setIntroDialogOpen}
          recipientName={selectedUser.fullName}
          recipientId={selectedUser.id}
          onSubmit={handleSubmitIntroRequest}
        />
      )}
    </div>
  );
}
