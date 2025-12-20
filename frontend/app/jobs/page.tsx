"use client";

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Building, Search, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function JobsPage() {
  const { jobs, currentUser, applyToJob, requestIntro } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [introMessage, setIntroMessage] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleApply = (jobId: string) => {
    applyToJob(jobId);
    toast.success("Application submitted successfully!");
  };

  const handleRequestIntro = (hiringLeaderId: string) => {
    if (!introMessage.trim()) return;
    requestIntro(hiringLeaderId, introMessage);
    toast.success("Introduction requested to hiring leader!");
    setIntroMessage('');
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curated Opportunities</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Exclusive roles from our partner network.
          </p>
        </div>
        {currentUser?.tier === 'Admin' && (
          <Button>Post a Job</Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Search jobs by title or company..." 
          className="pl-10 max-w-md bg-white dark:bg-slate-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.map((job, i) => {
          const hasApplied = job.applicants.includes(currentUser?.id || '');
          const isVipLocked = job.isVipOnly && currentUser?.tier === 'Free';

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`border-l-4 ${job.isVipOnly ? 'border-l-[#00d6b9]' : 'border-l-[#7507c5]'} hover:shadow-md transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        {job.isVipOnly && (
                          <Badge className="bg-[#00d6b9] hover:bg-[#00b89f] text-black">VIP Only</Badge>
                        )}
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Posted {new Date(job.postedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px] justify-center border-l border-slate-100 dark:border-slate-800 pl-0 md:pl-6">
                      {isVipLocked ? (
                        <div className="text-center space-y-2">
                          <Lock className="w-8 h-8 mx-auto text-slate-300" />
                          <p className="text-sm text-slate-500">Upgrade to VIP to view details</p>
                          <Button variant="outline" className="w-full">Upgrade Now</Button>
                        </div>
                      ) : (
                        <>
                          <Button 
                            className="w-full bg-[#7507c5] hover:bg-[#5e059e] text-white"
                            disabled={hasApplied}
                            onClick={() => handleApply(job.id)}
                          >
                            {hasApplied ? "Applied" : "Apply Now"}
                          </Button>
                          
                          {job.hiringLeaderId && currentUser?.tier !== 'Free' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="w-full">
                                  Request Intro to Hiring Leader
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Request Introduction</DialogTitle>
                                  <DialogDescription>
                                    Send a warm introduction request to the hiring leader at {job.company}.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea 
                                      placeholder="Hi, I'm interested in the Senior Engineer role and would love to connect..."
                                      value={introMessage}
                                      onChange={(e) => setIntroMessage(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={() => handleRequestIntro(job.hiringLeaderId!)}>Send Request</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          {job.hiringLeaderId && currentUser?.tier === 'Free' && (
                            <Button variant="ghost" disabled className="w-full text-xs">
                              VIPs can request intros
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

