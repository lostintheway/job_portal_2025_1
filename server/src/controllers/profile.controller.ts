import { Request, Response } from 'express';
import ProfileService from '../services/profile.service';
import { Profile } from '../models/profile.model';

class ProfileController {
  static async getAllProfiles(req: Request, res: Response): Promise<void> {
    try {
      const profiles = await ProfileService.getAllProfiles();
      res.json({ success: true, data: profiles });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch profiles' });
    }
  }

  static async getProfileById(req: Request, res: Response): Promise<void> {
    try {
      const profileId = parseInt(req.params.profileId);
      const profile = await ProfileService.getProfileById(profileId);
      if (!profile) {
        res.status(404).json({ success: false, error: 'Profile not found' });
        return;
      }
      res.json({ success: true, data: profile });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
  }

  static async createProfile(req: Request, res: Response): Promise<void> {
    try {
      const profileData = req.body;
      const profileId = await ProfileService.createProfile(profileData);
      res.status(201).json({ success: true, data: { profileId } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create profile' });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const profileId = parseInt(req.params.profileId);
      const profileData = req.body;
      const success = await ProfileService.updateProfile(profileId, profileData);
      if (!success) {
        res.status(404).json({ success: false, error: 'Profile not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
  }

  static async deleteProfile(req: Request, res: Response): Promise<void> {
    try {
      const profileId = parseInt(req.params.profileId);
      const deletedBy = parseInt(req.body.deletedBy);
      const success = await ProfileService.deleteProfile(profileId, deletedBy);
      if (!success) {
        res.status(404).json({ success: false, error: 'Profile not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete profile' });
    }
  }
}

export default ProfileController;
