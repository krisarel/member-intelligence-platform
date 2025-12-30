"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface RequestIntroDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  recipientId: string;
  onSubmit: (data: IntroRequestData) => Promise<void>;
}

export interface IntroRequestData {
  toUserId: string;
  message: string;
  intentCategory: string;
  intentDescription?: string;
}

const intentCategories = [
  { value: 'mentorship', label: 'Seeking Mentorship' },
  { value: 'job_opportunity', label: 'Exploring Job Opportunities' },
  { value: 'collaboration', label: 'Collaboration on Projects' },
  { value: 'networking', label: 'General Networking' },
  { value: 'speaking_opportunity', label: 'Speaking Opportunities' },
  { value: 'learning', label: 'Learning & Knowledge Sharing' },
  { value: 'hiring', label: 'Hiring / Building a Team' },
  { value: 'volunteering', label: 'Volunteering or Contributing' },
  { value: 'other', label: 'Other' },
];

export default function RequestIntroDialog({
  open,
  onOpenChange,
  recipientName,
  recipientId,
  onSubmit,
}: RequestIntroDialogProps) {
  const [message, setMessage] = useState('');
  const [intentCategory, setIntentCategory] = useState('');
  const [intentDescription, setIntentDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ message?: string; intentCategory?: string }>({});

  const handleSubmit = async () => {
    // Validation
    const newErrors: { message?: string; intentCategory?: string } = {};
    
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (message.trim().length > 500) {
      newErrors.message = 'Message cannot exceed 500 characters';
    }

    if (!intentCategory) {
      newErrors.intentCategory = 'Please select an intent category';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit({
        toUserId: recipientId,
        message: message.trim(),
        intentCategory,
        intentDescription: intentDescription.trim() || undefined,
      });

      // Reset form
      setMessage('');
      setIntentCategory('');
      setIntentDescription('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting intro request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setMessage('');
    setIntentCategory('');
    setIntentDescription('');
    setErrors({});
    onOpenChange(false);
  };

  const messageLength = message.length;
  const descriptionLength = intentDescription.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Request Introduction to {recipientName}</DialogTitle>
          <DialogDescription>
            Let {recipientName} know why you'd like to connect. Be specific about your intent
            so they understand how this connection could be mutually beneficial.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Intent Category */}
          <div className="space-y-2">
            <Label htmlFor="intent-category">
              Connection Intent <span className="text-red-500">*</span>
            </Label>
            <Select value={intentCategory} onValueChange={setIntentCategory}>
              <SelectTrigger id="intent-category" className={errors.intentCategory ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select your primary intent..." />
              </SelectTrigger>
              <SelectContent>
                {intentCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.intentCategory && (
              <p className="text-sm text-red-500">{errors.intentCategory}</p>
            )}
          </div>

          {/* Optional Intent Description */}
          {intentCategory && (
            <div className="space-y-2">
              <Label htmlFor="intent-description">
                Additional Context <span className="text-slate-500 text-xs">(Optional)</span>
              </Label>
              <Input
                id="intent-description"
                placeholder="e.g., Interested in DeFi projects, Looking for frontend opportunities..."
                value={intentDescription}
                onChange={(e) => setIntentDescription(e.target.value.slice(0, 200))}
                maxLength={200}
              />
              <p className="text-xs text-slate-500 text-right">
                {descriptionLength}/200 characters
              </p>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Your Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder={`Hi ${recipientName},\n\nI'd love to connect because...`}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              className={`min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message}</p>
              )}
              <p className={`text-xs ${messageLength > 450 ? 'text-orange-500' : 'text-slate-500'} ml-auto`}>
                {messageLength}/500 characters
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              💡 <strong>Tip:</strong> Be authentic and specific. Mention shared interests, how you found them,
              or what you hope to learn or share. Quality connections start with thoughtful messages.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !message.trim() || !intentCategory}
            className="bg-[#7507c5] hover:bg-[#5e059e] text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}