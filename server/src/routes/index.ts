import express from 'express';
import userRoutes from './user.routes';
import profileRoutes from './profile.routes';
import vendorOrganizationRoutes from './vendorOrganization.routes';
import categoryRoutes from './category.routes';
import jobDescriptionRoutes from './jobDescription.routes';
import applicationRoutes from './application.routes';
import bookmarkRoutes from './bookmark.routes';

const router = express.Router();

// Mount routes
router.use('/api/users', userRoutes);
router.use('/api/profiles', profileRoutes);
router.use('/api/vendor-organizations', vendorOrganizationRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/job-descriptions', jobDescriptionRoutes);
router.use('/api/applications', applicationRoutes);
router.use('/api/bookmarks', bookmarkRoutes);

export default router;
