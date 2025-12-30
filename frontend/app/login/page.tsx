"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy login page - redirects to unified auth page
 * Maintained for backward compatibility
 */
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified auth page with signin mode
    router.replace('/auth?mode=signin');
  }, [router]);

  return null;
}
