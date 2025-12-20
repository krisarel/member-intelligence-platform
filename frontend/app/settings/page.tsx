"use client";

import React from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Shield, Bell, CreditCard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { currentUser, upgradeTier, logout } = useStore();
  const router = useRouter();

  if (!currentUser) return null;

  const handleUpgrade = () => {
    upgradeTier();
    toast.success("Welcome to VIP! You now have unlimited intros and access to exclusive jobs.");
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your account preferences and membership.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Membership Tier */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-violet-500" />
              <CardTitle>Membership Plan</CardTitle>
            </div>
            <CardDescription>You are currently on the <span className="font-bold text-violet-600">{currentUser.tier}</span> plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
              <div>
                <h3 className="font-bold">Free Member</h3>
                <p className="text-sm text-slate-500">Basic access to directory and jobs.</p>
              </div>
              {currentUser.tier === 'Free' && <span className="text-sm font-bold text-green-600">Current</span>}
            </div>
            <div className="flex justify-between items-center p-4 border rounded-lg border-violet-200 bg-violet-50 dark:bg-violet-900/20 dark:border-violet-800">
              <div>
                <h3 className="font-bold text-violet-700 dark:text-violet-300">VIP Member</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Unlimited intros, priority placement, exclusive jobs.</p>
              </div>
              {currentUser.tier === 'VIP' ? (
                <span className="text-sm font-bold text-violet-600">Current</span>
              ) : (
                <Button onClick={handleUpgrade} className="bg-violet-600 hover:bg-violet-700 text-white">Upgrade</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-500" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage how you receive updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-500">Receive emails about new intro requests.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Job Alerts</Label>
                <p className="text-sm text-slate-500">Get notified when relevant jobs are posted.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-500" />
              <CardTitle>Privacy & Visibility</CardTitle>
            </div>
            <CardDescription>Control who can see your profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Profile</Label>
                <p className="text-sm text-slate-500">Allow other members to find you in the directory.</p>
              </div>
              <Switch defaultChecked={currentUser.visibility === 'Public'} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
