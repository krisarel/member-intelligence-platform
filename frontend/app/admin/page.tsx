"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, MessageSquare, Briefcase, CheckCircle2, RefreshCw, Link as LinkIcon, ShieldAlert, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserTier } from '@/types';
import { toast } from 'sonner';

// Mock Data for Charts
const growthData = [
  { name: 'Jan', members: 120 },
  { name: 'Feb', members: 150 },
  { name: 'Mar', members: 210 },
  { name: 'Apr', members: 280 },
  { name: 'May', members: 350 },
  { name: 'Jun', members: 480 },
];

const introData = [
  { name: 'Jan', requests: 40, accepted: 25 },
  { name: 'Feb', requests: 55, accepted: 38 },
  { name: 'Mar', requests: 80, accepted: 60 },
  { name: 'Apr', requests: 120, accepted: 95 },
  { name: 'May', requests: 150, accepted: 110 },
  { name: 'Jun', requests: 200, accepted: 160 },
];

export default function AdminPage() {
  const { users, jobs, introductions, currentUser, updateUserTier } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  if (!currentUser || (currentUser.tier !== 'Admin' && currentUser.tier !== 'SuperAdmin')) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-slate-500">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: "Total Members", value: users.length, icon: Users, change: "+12% this month" },
    { title: "Active Intros", value: introductions.length, icon: MessageSquare, change: "+24% this month" },
    { title: "Job Applications", value: jobs.reduce((acc, job) => acc + job.applicants.length, 0), icon: Briefcase, change: "+8% this month" },
    { title: "Success Rate", value: "78%", icon: CheckCircle2, change: "+2% this month" },
  ];

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTierChange = (userId: string, newTier: UserTier) => {
    updateUserTier(userId, newTier);
    toast.success("User tier updated successfully");
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {currentUser.tier === 'SuperAdmin' ? 'Super Admin Dashboard' : 'Admin Dashboard'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Platform analytics and integration status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-slate-500">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          {currentUser.tier === 'SuperAdmin' && (
            <TabsTrigger value="team">Team Management</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Member Growth</CardTitle>
                <CardDescription>Total registered members over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Line type="monotone" dataKey="members" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Introduction Activity</CardTitle>
                <CardDescription>Requests vs Accepted connections</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={introData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="requests" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Requests" />
                    <Bar dataKey="accepted" fill="#d946ef" radius={[4, 4, 0, 0]} name="Accepted" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wix Integration */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl">
                    Wix
                  </div>
                  <div>
                    <CardTitle>Wix Membership</CardTitle>
                    <CardDescription>Syncs membership tiers and payments</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Sync</span>
                  <span>Just now</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Active Members Synced</span>
                  <span>{users.length}</span>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" /> Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mailchimp Integration */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFE01B] text-black rounded-lg flex items-center justify-center font-bold text-xl">
                    MC
                  </div>
                  <div>
                    <CardTitle>Mailchimp</CardTitle>
                    <CardDescription>Newsletter and automated campaigns</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Sync</span>
                  <span>1 hour ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subscribers</span>
                  <span>{users.length - 1}</span>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" /> Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* LinkedIn Integration */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0077b5] text-white rounded-lg flex items-center justify-center font-bold text-xl">
                    in
                  </div>
                  <div>
                    <CardTitle>LinkedIn Company</CardTitle>
                    <CardDescription>Company page analytics and posts</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Page Followers</span>
                  <span>1,240</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Post Engagement</span>
                  <span>4.8%</span>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" /> Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Luma Integration */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-200 text-black rounded-lg flex items-center justify-center font-bold text-xl">
                    Lu
                  </div>
                  <div>
                    <CardTitle>Luma Events</CardTitle>
                    <CardDescription>Event calendar synchronization</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Calendar ID</span>
                  <span className="font-mono text-xs">wiw3ch-cal-882</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Upcoming Events</span>
                  <span>3</span>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <LinkIcon className="w-4 h-4 mr-2" /> Configure Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {currentUser.tier === 'SuperAdmin' && (
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Manage roles and permissions for platform administrators.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.fullName.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold">{user.fullName}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                          {user.location && (
                            <div className="text-xs text-slate-400 mt-1">{user.location}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Select 
                          defaultValue={user.tier} 
                          onValueChange={(val) => handleTierChange(user.id, val as UserTier)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Free">Free</SelectItem>
                            <SelectItem value="VIP">VIP</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

