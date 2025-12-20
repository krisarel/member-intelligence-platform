"use client";

import React from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, MessageSquare, Mail, Linkedin, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Introduction } from '@/types';

export default function IntroductionsPage() {
  const { introductions, currentUser, users, respondToIntro } = useStore();

  if (!currentUser) return null;

  const sentIntros = introductions.filter(i => i.fromUserId === currentUser.id);
  const receivedIntros = introductions.filter(i => i.toUserId === currentUser.id);

  const handleRespond = (id: string, status: 'Accepted' | 'Declined') => {
    respondToIntro(id, status);
    toast.success(`Introduction ${status.toLowerCase()}`);
  };

  const IntroCard = ({ intro, isReceived }: { intro: Introduction, isReceived: boolean }) => {
    const otherUserId = isReceived ? intro.fromUserId : intro.toUserId;
    const otherUser = users.find(u => u.id === otherUserId);

    if (!otherUser) return null;

    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
            <div className="flex gap-4 w-full">
              <Avatar className="w-12 h-12">
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback>{otherUser.fullName.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{otherUser.fullName}</h3>
                  <Badge variant={
                    intro.status === 'Accepted' ? 'default' : 
                    intro.status === 'Declined' ? 'destructive' : 'secondary'
                  }>
                    {intro.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">{otherUser.headline}</p>
                <div className="mt-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm">
                  <p className="text-slate-600 dark:text-slate-300 italic">&quot;{intro.message}&quot;</p>
                </div>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(intro.createdAt).toLocaleDateString()}
                </div>

                {/* Contact Details Reveal */}
                {intro.status === 'Accepted' && (
                  <div className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 rounded-lg">
                    <h4 className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-3 flex items-center gap-2">
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
              {isReceived && intro.status === 'Pending' && (
                <>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none"
                    onClick={() => handleRespond(intro.id, 'Accepted')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    className="flex-1 md:flex-none"
                    onClick={() => handleRespond(intro.id, 'Declined')}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Decline
                  </Button>
                </>
              )}
              
              {intro.status === 'Accepted' && (
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
          <TabsTrigger value="received">Received ({receivedIntros.filter(i => i.status === 'Pending').length} Pending)</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="mt-6">
          {receivedIntros.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No introduction requests received yet.
            </div>
          ) : (
            receivedIntros.map(intro => (
              <IntroCard key={intro.id} intro={intro} isReceived={true} />
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
              <IntroCard key={intro.id} intro={intro} isReceived={false} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
