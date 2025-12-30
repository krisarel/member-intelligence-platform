"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Sparkles } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        <div className="w-8 h-8" />
        <div className="w-8 h-8" />
        <div className="w-8 h-8" />
      </div>
    );
  }

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'purple', icon: Sparkles, label: 'Purple' },
  ];

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant="ghost"
          size="icon"
          onClick={() => setTheme(value)}
          className={`h-8 w-8 transition-colors ${
            theme === value
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'hover:bg-accent'
          }`}
          aria-label={`Switch to ${label} mode`}
          title={`${label} mode`}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}