"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, MessageSquare, Mail, Linkedin, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { config } from '@/lib/config';

interface IntroductionRequest {
  _id: string;
  fromUser: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    headline?: string;
    avatar?: string;
    linkedInUrl?: string;
    telegramHandle?: string;
  };
  toUser: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    headline?: string;
    avatar?: string;
    linkedInUrl?: string;
    telegramHandle?: string;
  };
  message: string;
  intentCategory: string;
  intentDescription?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export default function IntroductionsPage() {
  const { currentUser, users } = useStore();
  const [introductions, setIntroductions] = useState<IntroductionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIntroductions();
  }, []);

  const fetchIntroductions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${config.apiUrl}/introductions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIntroductions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching introductions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (id: string, status: 'accepted' | 'declined') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to respond to introductions');
        return;
      }

      const response = await fetch(`${config.apiUrl}/introductions/${id}/respond`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to respond to introduction');
      }

      toast.success(`Introduction ${status}`);
      fetchIntroductions(); // Refresh the list
    } catch (error) {
      console.error('Error responding to introduction:', error);
      toast.error('Failed to respond to introduction');
    }
  };

  if (!currentUser) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const storedUser = localStorage.getItem('user');
  const currentUserId = storedUser ? JSON.parse(storedUser)._id : currentUser.id;

  const sentIntros = introductions.filter(i => i.fromUser._id === currentUserId);
  const receivedIntros = introductions.filter(i => i.toUser._id === currentUserId);

  const IntroCard = ({ intro, isReceived }: { intro: IntroductionRequest, isReceived: boolean }) => {
    const otherUser = isReceived ? intro.fromUser : intro.toUser;
    const fullName = `${otherUser.firstName} ${otherUser.lastName}`;
    const avatar = otherUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${otherUser.email}`;

    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
            <div className="flex gap-4 w-full">
              <Avatar className="w-12 h-12">
                <AvatarImage src={avatar} />
                <AvatarFallback>{fullName.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{fullName}</h3>
                  <Badge variant={
                    intro.status === 'accepted' ? 'default' :
                    intro.status === 'declined' ? 'destructive' : 'secondary'
                  }>
                    {intro.status.charAt(0).toUpperCase() + intro.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">{otherUser.headline || 'Member'}</p>
                {intro.intentCategory && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {intro.intentCategory.replace('_', ' ')}
                  </Badge>
                )}
                <div className="mt-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm">
                  <p className="text-slate-600 dark:text-slate-300 italic">&quot;{intro.message}&quot;</p>
                </div>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(intro.createdAt).toLocaleDateString()}
                </div>

                {/* Contact Details Reveal */}
                {intro.status === 'accepted' && (
                  <div className="mt-4 p-4 bg-[#faf2ff] dark:bg-[#1f7664]/20 border border-[#7507c5]/20 dark:border-[#1f7664] rounded-lg">
                    <h4 className="text-sm font-semibold text-[#7507c5] dark:text-[#00d6b9] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Contact Details Unlocked
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <a href={`mailto:${otherUser.email}`} className="hover:underline">{otherUser.email}</a>
                      </div>
                      {otherUser.linkedInUrl && (
                        <div className="flex items-center gap-2 text-sm">
                          <Linkedin className="w-4 h-4 text-blue-600" />
                          <a href={otherUser.linkedInUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">LinkedIn Profile</a>
                        </div>
                      )}
                      {otherUser.telegramHandle && (
                        <div className="flex items-center gap-2 text-sm">
                          <Send className="w-4 h-4 text-sky-500" />
                          <span className="text-sky-600 dark:text-sky-400">{otherUser.telegramHandle}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto shrink-0">
              {isReceived && intro.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none"
                    onClick={() => handleRespond(intro._id, 'accepted')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1 md:flex-none"
                    onClick={() => handleRespond(intro._id, 'declined')}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Decline
                  </Button>
                </>
              )}
              
              {intro.status === 'accepted' && (
                <Button variant="outline" size="sm" className="w-full md:w-auto" onClick={() => window.location.href = `mailto:${otherUser.email}`}>
                  <MessageSquare className="w-4 h-4 mr-1" /> Send Email
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Introductions</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your connection requests and warm intros.
        </p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">Received ({receivedIntros.filter(i => i.status === 'pending').length} Pending)</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="mt-6">
          {receivedIntros.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No introduction requests received yet.
            </div>
          ) : (
            receivedIntros.map(intro => (
              <IntroCard key={intro._id} intro={intro} isReceived={true} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="sent" className="mt-6">
          {sentIntros.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              You haven&apos;t sent any introduction requests yet.
            </div>
          ) : (
            sentIntros.map(intro => (
              <IntroCard key={intro._id} intro={intro} isReceived={false} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

