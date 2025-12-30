import { Request, Response } from 'express';
import Job from '../models/Job';
import { AuthRequest } from '../middleware/auth';

// Create a new job listing
export const createJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, company, description, requirements, type, location, salary, status } = req.body;

    // Validate required fields
    if (!title || !company || !description || !type) {
      res.status(400).json({ 
        message: 'Missing required fields: title, company, description, and type are required' 
      });
      return;
    }

    const job = new Job({
      title,
      company,
      description,
      requirements: requirements || [],
      type,
      location,
      salary,
      status: status || 'active',
      postedBy: req.user!._id,
    });

    await job.save();

    res.status(201).json({
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all job listings with filters
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, status, company, page = 1, limit = 10 } = req.query;

    const filter: any = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    else filter.status = 'active'; // Default to active jobs
    if (company) filter.company = new RegExp(company as string, 'i');

    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(filter)
      .populate('postedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single job by ID
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate('postedBy', 'firstName lastName email')
      .populate('applicants', 'firstName lastName email');

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a job listing
export const updateJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await Job.findById(id);

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user!._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this job' });
      return;
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'company', 'description', 'requirements', 'type', 'location', 'salary', 'status'];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (job as any)[key] = updates[key];
      }
    });

    await job.save();

    res.json({
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a job listing
export const deleteJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user!._id.toString()) {
      res.status(403).json({ message: 'Not authorized to delete this job' });
      return;
    }

    await Job.findByIdAndDelete(id);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply to a job
export const applyToJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    if (job.status !== 'active') {
      res.status(400).json({ message: 'This job is no longer accepting applications' });
      return;
    }

    // Check if already applied
    if (job.applicants?.includes(req.user!._id as any)) {
      res.status(400).json({ message: 'You have already applied to this job' });
      return;
    }

    job.applicants = job.applicants || [];
    job.applicants.push(req.user!._id as any);
    await job.save();

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get jobs posted by the authenticated user
export const getMyJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ postedBy: req.user!._id })
      .populate('applicants', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};