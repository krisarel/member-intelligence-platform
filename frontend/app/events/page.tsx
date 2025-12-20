"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, MapPin, Clock } from 'lucide-react';

export default function EventsPage() {
  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Connect with the community at our next gathering.
          </p>
        </div>
        <Button onClick={() => window.open('https://luma.com/wiw3ch?k=c', '_blank')}>
          View Full Calendar <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Featured Event Card */}
      <Card className="bg-gradient-to-br from-violet-900 to-fuchsia-900 border-none text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">
                <Calendar className="w-4 h-4 mr-2" /> Next Major Event
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Web3 Financial Innovation Summit</h2>
              <p className="text-violet-100 text-lg max-w-2xl">
                Join us for an evening of panel discussions and networking with leaders from Sygnum, UBS, and the Web3 Foundation.
              </p>
              <div className="flex flex-wrap gap-6 text-sm font-medium pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-fuchsia-300" />
                  <span>Oct 24, 18:00 - 21:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-fuchsia-300" />
                  <span>Trust Square, Zurich</span>
                </div>
              </div>
              <div className="pt-4">
                <Button size="lg" className="bg-white text-violet-900 hover:bg-violet-50 font-bold" onClick={() => window.open('https://luma.com/wiw3ch?k=c', '_blank')}>
                  Register Now
                </Button>
              </div>
            </div>
            
            {/* Luma Embed Placeholder / Visual */}
            <div className="w-full md:w-1/3 aspect-video bg-black/20 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center p-6 text-center">
              <div>
                <p className="text-sm text-violet-200 mb-2">Powered by Luma</p>
                <div className="text-2xl font-bold">WiW3CH Calendar</div>
                <p className="text-xs text-violet-300 mt-2">Official Community Events</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => window.open('https://luma.com/wiw3ch?k=c', '_blank')}>
            <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-lg">Monthly Community Meetup</span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Nov {10 + i}, 2024</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>Geneva, CH</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20">
                  Details
                </Button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                Casual networking drinks for members in the Geneva area. Come meet fellow builders and creators.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
