"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingNav() {
  const router = useRouter();

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    router.push(`/auth?mode=${mode}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-green to-teal-mint flex items-center justify-center text-white font-bold text-sm shadow-sm">
              W3
            </div>
            <span className="text-lg font-semibold text-foreground">
              WiW3CH
            </span>
          </div>

          {/* Theme Toggle & Auth - Right */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => handleAuthClick('signin')}
                className="text-foreground hover:bg-accent"
              >
                Log In
              </Button>
              <Button
                onClick={() => handleAuthClick('signup')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}