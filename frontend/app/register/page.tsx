"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy register page - redirects to unified auth page
 * Maintained for backward compatibility
 */
export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified auth page with signup mode
    router.replace('/auth?mode=signup');
  }, [router]);

  return null;
}
