"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Users } from 'lucide-react';

export default function LandingHero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  
  // Generate particle positions once on mount to avoid hydration mismatch
  const [particles] = useState(() =>
    Array.from({ length: 20 }, () => ({
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      endX: Math.random() * 100,
      endY: Math.random() * 100,
      duration: Math.random() * 20 + 10,
    }))
  );

  // Only render particles after client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollY } = useScroll();
  
  // Parallax effects for background layers
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, 100]);
  const y3 = useTransform(scrollY, [0, 500], [0, 50]);
  
  // Smooth spring animations
  const springConfig = { stiffness: 150, damping: 15 };
  const y1Spring = useSpring(y1, springConfig);
  const y2Spring = useSpring(y2, springConfig);
  const y3Spring = useSpring(y3, springConfig);

  // Mouse parallax for floating card
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 50;
        const y = (e.clientY - rect.top - rect.height / 2) / 50;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    router.push(`/auth?mode=${mode}`);
  };

  return (
    <>
      <section
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Animated floating particles */}
        {isMounted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/20 rounded-full"
                style={{
                  left: `${particle.startX}%`,
                  top: `${particle.startY}%`,
                }}
                animate={{
                  x: [`0%`, `${particle.endX - particle.startX}%`],
                  y: [`0%`, `${particle.endY - particle.startY}%`],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        )}

        {/* Decorative corner accents */}
        <div className="absolute top-20 left-8 opacity-30">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-32 right-12 opacity-30">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-10 h-10 text-accent-foreground" />
          </motion.div>
        </div>

        <div className="absolute top-1/3 right-20 opacity-20">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Users className="w-12 h-12 text-primary" />
          </motion.div>
        </div>

        {/* Background Layers - Soft geometric shapes */}
        <motion.div
          style={{ y: y1Spring }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          <div className="absolute top-1/4 -left-1/4 w-[800px] h-[600px] rounded-[40%] bg-gradient-to-br from-hero-gradient-1 to-transparent opacity-40 blur-3xl" />
        </motion.div>

        <motion.div
          style={{ y: y2Spring }}
          className="absolute top-1/3 right-0 w-full h-full pointer-events-none"
        >
          <div className="absolute top-0 -right-1/4 w-[700px] h-[700px] rounded-[45%] bg-gradient-to-bl from-hero-gradient-2 to-transparent opacity-30 blur-3xl" />
        </motion.div>

        <motion.div
          style={{ y: y3Spring }}
          className="absolute bottom-0 left-1/4 w-full h-full pointer-events-none"
        >
          <div className="absolute bottom-0 left-0 w-[600px] h-[500px] rounded-[50%] bg-gradient-to-tr from-hero-gradient-3 to-transparent opacity-20 blur-2xl" />
        </motion.div>

        {/* Additional decorative gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl pointer-events-none"
        />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-accent-foreground/20 to-transparent blur-3xl pointer-events-none"
        />

        {/* Diagonal division overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="diagonalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--hero-gradient-1)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="var(--hero-gradient-2)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <polygon points="0,0 100,0 100,60 0,40" fill="url(#diagonalGradient)" />
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Headline + Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  Welcome to the{' '}
                  <span className="block mt-2">
                    WiW3CH Intelligence Platform
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  A trusted space for connection, opportunity, and community-led growth.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Button
                  size="lg"
                  onClick={() => handleAuthClick('signin')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 group"
                >
                  Log In
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleAuthClick('signup')}
                  className="border-2 text-lg px-8 py-6"
                >
                  Sign Up
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: Floating Hero Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="relative"
            >
              <motion.div
                animate={{
                  x: mousePosition.x,
                  y: mousePosition.y,
                  rotateY: mousePosition.x * 0.5,
                  rotateX: -mousePosition.y * 0.5,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Floating Card */}
                <div className="relative bg-card border-2 border-border rounded-3xl p-8 lg:p-12 shadow-2xl backdrop-blur-sm overflow-hidden">
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 pointer-events-none"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  
                  {/* Decorative corner elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-accent-foreground/10 to-transparent rounded-full blur-xl" />
                  
                  <div className="relative space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-green to-[#0f5a4d] flex items-center justify-center shadow-lg shadow-emerald-green/30">
                          <span className="text-white font-bold text-lg drop-shadow-md">700+</span>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Members</p>
                          <p className="font-semibold text-foreground">Global Community</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7507c5] to-[#5e059e] flex items-center justify-center shadow-lg shadow-purple/30">
                          <span className="text-white font-bold text-lg drop-shadow-md">AI</span>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Smart Matching</p>
                          <p className="font-semibold text-foreground">Connections</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00b89f] to-emerald-green flex items-center justify-center shadow-lg shadow-teal-mint/30">
                          <span className="text-white font-bold text-lg drop-shadow-md">50+</span>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Partner Companies</p>
                          <p className="font-semibold text-foreground">Opportunities</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating animation */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 -z-10"
                >
                  <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl transform translate-y-4" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}