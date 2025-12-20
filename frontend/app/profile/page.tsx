"use client";

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from '@/types';
import { Linkedin, Send, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updateProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(currentUser || {});

  if (!currentUser) return null;

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal information and visibility.
          </p>
        </div>
        <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} variant={isEditing ? "default" : "outline"}>
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4 border-4 border-slate-100 dark:border-slate-800">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="text-3xl">{currentUser.fullName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            
            {isEditing ? (
              <div className="w-full space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="text-center"
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold">{currentUser.fullName}</h2>
                <Badge className="mt-2 mb-4" variant={currentUser.tier === 'VIP' ? 'default' : 'secondary'}>
                  {currentUser.tier} Member
                </Badge>
              </>
            )}

            <div className="w-full mt-6 space-y-4 text-left">
              <div>
                <Label className="text-xs text-slate-500 uppercase font-bold">Email</Label>
                <p className="text-sm">{currentUser.email}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500 uppercase font-bold">Member Since</Label>
                <p className="text-sm">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500 uppercase font-bold">Location</Label>
                {isEditing ? (
                  <Input 
                    value={formData.location || ''} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. Zurich"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {currentUser.location || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
            <CardDescription>This information helps us match you with the right opportunities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Headline</Label>
              {isEditing ? (
                <Input 
                  value={formData.headline || ''} 
                  onChange={(e) => setFormData({...formData, headline: e.target.value})}
                  placeholder="e.g. Product Designer at Web3 Co"
                />
              ) : (
                <p className="text-sm">{currentUser.headline || 'No headline set'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              {isEditing ? (
                <Textarea 
                  value={formData.bio || ''} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  className="h-24"
                />
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">{currentUser.bio || 'No bio set'}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry</Label>
                {isEditing ? (
                  <Select 
                    value={formData.industry} 
                    onValueChange={(val) => setFormData({...formData, industry: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DeFi">DeFi</SelectItem>
                      <SelectItem value="NFTs">NFTs</SelectItem>
                      <SelectItem value="DAO">DAO</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="CeFi">CeFi</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="VC">VC</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                      <SelectItem value="Metaverse">Metaverse</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium">{currentUser.industry}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Experience Level</Label>
                {isEditing ? (
                  <Select 
                    value={formData.experienceLevel} 
                    onValueChange={(val) => setFormData({...formData, experienceLevel: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium">{currentUser.experienceLevel || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Skills</Label>
              {isEditing ? (
                <Input 
                  value={formData.skills?.join(', ') || ''} 
                  onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map((s: string) => s.trim())})}
                  placeholder="Solidity, React, Marketing (comma separated)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills?.map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  LinkedIn URL
                </Label>
                {isEditing ? (
                  <Input 
                    value={formData.linkedInUrl || ''} 
                    onChange={(e) => setFormData({...formData, linkedInUrl: e.target.value})}
                    placeholder="https://linkedin.com/in/..."
                  />
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                    {currentUser.linkedInUrl ? (
                      <a href={currentUser.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {currentUser.linkedInUrl}
                      </a>
                    ) : 'Not set'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-sky-500" />
                  Telegram Handle
                </Label>
                {isEditing ? (
                  <Input 
                    value={formData.telegramHandle || ''} 
                    onChange={(e) => setFormData({...formData, telegramHandle: e.target.value})}
                    placeholder="@username"
                  />
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {currentUser.telegramHandle ? (
                      <span className="text-sky-500">{currentUser.telegramHandle}</span>
                    ) : 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
