"use client";

import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import LandingNav from '@/components/landing/LandingNav';
import LandingHero from '@/components/landing/LandingHero';
import LandingFooter from '@/components/landing/LandingFooter';

export default function LandingPage() {
  const { currentUser } = useStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  // Prevent flash of landing page for authenticated users
  if (currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <LandingHero />
      <LandingFooter />
    </div>
  );
}
