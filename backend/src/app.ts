import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import intentRoutes from './routes/intentRoutes';
import jobRoutes from './routes/jobRoutes';
import profileRoutes from './routes/profileRoutes';
import onboardingRoutes from './routes/onboardingRoutes';
import introductionRoutes from './routes/introductionRoutes';

dotenv.config();

const app: Application = express();

// Security middleware - relaxed for development
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API health check endpoint (for Render)
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Member Intelligence Platform API',
    version: '1.0.0',
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Onboarding routes
app.use('/api/onboarding', onboardingRoutes);

// Intent routes
app.use('/api/intents', intentRoutes);

// Job routes
app.use('/api/jobs', jobRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Introduction request routes
app.use('/api/introductions', introductionRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

export default app;