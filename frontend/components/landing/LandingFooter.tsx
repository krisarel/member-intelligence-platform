"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Linkedin, Twitter, Github } from 'lucide-react';

export default function LandingFooter() {
  const router = useRouter();

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-[#7507c5] to-[#00d6b9] flex items-center justify-center text-white font-bold text-sm">
                W3
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7507c5] to-[#00d6b9]">
                WiW3CH Connect
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md mb-4">
              Empowering women in Web3 and AI through intelligent connections, 
              exclusive opportunities, and a trusted global community.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-slate-400 hover:text-[#00d6b9] hover:bg-slate-800"
                onClick={() => window.open('https://www.linkedin.com/company/wiw3ch', '_blank')}
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-slate-400 hover:text-[#00d6b9] hover:bg-slate-800"
                onClick={() => window.open('https://twitter.com/wiw3ch', '_blank')}
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-slate-400 hover:text-[#00d6b9] hover:bg-slate-800"
                onClick={() => window.open('https://github.com/wiw3ch', '_blank')}
              >
                <Github className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => router.push('/register')}
                  className="text-slate-400 hover:text-[#00d6b9] text-sm transition-colors"
                >
                  Join Now
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/login')}
                  className="text-slate-400 hover:text-[#00d6b9] text-sm transition-colors"
                >
                  Sign In
                </button>
              </li>
              <li>
                <a 
                  href="#features"
                  className="text-slate-400 hover:text-[#00d6b9] text-sm transition-colors"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#privacy"
                  className="text-slate-400 hover:text-[#00d6b9] text-sm transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#terms"
                  className="text-slate-400 hover:text-[#00d6b9] text-sm transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#gdpr"
                  className="text-slate-400 hover:text-[#00d6b9] text-sm transition-colors"
                >
                  GDPR Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Women in Web3 Switzerland. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Built with ❤️ for the Web3 community
          </p>
        </div>
      </div>
    </footer>
  );
}