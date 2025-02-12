import express from 'express';
import JobDescriptionController from '../controllers/jobDescription.controller';

const router = express.Router();

// GET /api/job-descriptions - Get all job descriptions
router.get('/', JobDescriptionController.getAllJobDescriptions);

// GET /api/job-descriptions/:jobDescriptionId - Get job description by ID
router.get('/:jobDescriptionId', JobDescriptionController.getJobDescriptionById);

// POST /api/job-descriptions - Create a new job description
router.post('/', JobDescriptionController.createJobDescription);

// PUT /api/job-descriptions/:jobDescriptionId - Update a job description
router.put('/:jobDescriptionId', JobDescriptionController.updateJobDescription);

// DELETE /api/job-descriptions/:jobDescriptionId - Delete a job description
router.delete('/:jobDescriptionId', JobDescriptionController.deleteJobDescription);

export default router;
