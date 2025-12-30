/**
 * Application configuration
 * Centralizes environment variables for easy access throughout the app
 */

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
} as const;