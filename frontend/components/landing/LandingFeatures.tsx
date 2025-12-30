"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, Briefcase, Shield, Zap, Globe } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Matching',
    description: 'Get personalized connection recommendations based on your goals, skills, and industry focus. Our intelligent algorithm finds the right people at the right time.',
    gradient: 'from-[#7507c5] to-[#5e059e]'
  },
  {
    icon: Users,
    title: 'Warm Introductions',
    description: 'Connect through double opt-in introductions that respect privacy and build trust. No cold outreach, just meaningful connections facilitated by the community.',
    gradient: 'from-[#00d6b9] to-[#00b89f]'
  },
  {
    icon: Briefcase,
    title: 'Exclusive Opportunities',
    description: 'Access curated job listings from top Web3 and AI companies. VIP members get early access to roles and direct introductions to hiring leaders.',
    gradient: 'from-[#7507c5] to-[#00d6b9]'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your contact details stay private until you choose to share them. We prioritize psychological safety and consent in every interaction.',
    gradient: 'from-[#00b89f] to-[#1f7664]'
  },
  {
    icon: Zap,
    title: 'Career Growth',
    description: 'Whether you\'re seeking mentorship, partnerships, or your next role, our platform accelerates your professional journey in Web3 and AI.',
    gradient: 'from-[#7507c5] to-[#00d6b9]'
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Join women from Switzerland, MENA, Asia, and beyond. Our diverse community spans continents, industries, and experience levels.',
    gradient: 'from-[#00d6b9] to-[#7507c5]'
  }
];

export default function LandingFeatures() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7507c5] to-[#00d6b9]">
              Why Join WiW3CH Connect?
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            A member intelligence platform designed to strengthen talent mobility, 
            visibility, and opportunity for women in Web3 and AI.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-[#7507c5]/10 group"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}