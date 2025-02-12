import express from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', UserController.getAllUsers);

// GET /api/users/:userId - Get user by ID
router.get('/:userId', UserController.getUserById);

// POST /api/users - Create a new user
router.post('/', UserController.createUser);

// PUT /api/users/:userId - Update a user
router.put('/:userId', UserController.updateUser);

// DELETE /api/users/:userId - Delete a user
router.delete('/:userId', UserController.deleteUser);

export default router;
