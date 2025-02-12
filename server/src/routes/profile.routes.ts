import express from 'express';
import ProfileController from '../controllers/profile.controller';

const router = express.Router();

// GET /api/profiles - Get all profiles
router.get('/', ProfileController.getAllProfiles);

// GET /api/profiles/:profileId - Get profile by ID
router.get('/:profileId', ProfileController.getProfileById);

// POST /api/profiles - Create a new profile
router.post('/', ProfileController.createProfile);

// PUT /api/profiles/:profileId - Update a profile
router.put('/:profileId', ProfileController.updateProfile);

// DELETE /api/profiles/:profileId - Delete a profile
router.delete('/:profileId', ProfileController.deleteProfile);

export default router;
