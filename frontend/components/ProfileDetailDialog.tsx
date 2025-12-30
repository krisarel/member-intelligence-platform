"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, MapPin, Star, Linkedin, Send } from 'lucide-react';

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

interface ProfileDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onRequestIntro: () => void;
}

export default function ProfileDetailDialog({
  open,
  onOpenChange,
  user,
  onRequestIntro,
}: ProfileDetailDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              {/* Gradient ring effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7507c5] via-[#00d6b9] to-[#1f7664] p-[3px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900" />
              </div>
              <Avatar className="w-20 h-20 relative z-10 shadow-lg">
                <AvatarImage src={user.avatar} className="object-cover" />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-[#faf2ff] to-[#eef6f5] text-[#7507c5]">
                  {user.fullName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              {(user.tier === 'VIP' || user.tier === 'vip') && (
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-[#00d6b9] to-[#1f7664] text-white p-1.5 rounded-full shadow-lg z-20" title="VIP Member">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-1">{user.fullName}</DialogTitle>
              <DialogDescription className="text-base">
                {user.headline}
              </DialogDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="bg-[#7507c5]/10 text-[#7507c5] dark:bg-[#7507c5]/20">
                  {user.tier}
                </Badge>
                {user.experienceLevel && (
                  <Badge variant="outline">
                    {user.experienceLevel}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Bio */}
          {user.bio && (
            <div>
              <h3 className="font-semibold mb-2 text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                About
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}

          {/* Industry & Functional Area */}
          <div className="grid grid-cols-2 gap-4">
            {user.industry && (
              <div>
                <h3 className="font-semibold mb-2 text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  Industry
                </h3>
                <p className="text-slate-700 dark:text-slate-300">{user.industry}</p>
              </div>
            )}
            {user.functionalArea && (
              <div>
                <h3 className="font-semibold mb-2 text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Functional Area
                </h3>
                <p className="text-slate-700 dark:text-slate-300">{user.functionalArea}</p>
              </div>
            )}
          </div>

          {/* Location */}
          {user.location && (
            <div>
              <h3 className="font-semibold mb-2 text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Location
              </h3>
              <p className="text-slate-700 dark:text-slate-300">{user.location}</p>
            </div>
          )}

          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(user.linkedInUrl || user.telegramHandle) && (
            <div>
              <h3 className="font-semibold mb-3 text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Connect
              </h3>
              <div className="flex flex-wrap gap-3">
                {user.linkedInUrl && (
                  <a
                    href={user.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn Profile
                  </a>
                )}
                {user.telegramHandle && (
                  <span className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400">
                    <Send className="w-4 h-4" />
                    {user.telegramHandle}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className="bg-[#7507c5] hover:bg-[#5e059e] text-white"
            onClick={() => {
              onOpenChange(false);
              onRequestIntro();
            }}
          >
            Request Introduction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}