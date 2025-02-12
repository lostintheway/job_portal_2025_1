// models/user.model.ts
import db from '../config/db.config';
import { users } from '../../../../schema/schema'; // Assuming your schema file is in 'schema/schema.ts' at project root level
import { eq } from 'drizzle-orm';
import { Omit } from 'utility-types';

interface User {
  userId: number;
  email: string;
  password?: string; // Password typically not returned in SELECT queries
  fullName: string;
  contactNumber: string;
  address: string;
  role: 'jobseeker' | 'vendor' | 'admin';
  profileImage?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class UserModel {
  static async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  static async getUserById(userId: number): Promise<User | undefined> {
    return db.select().from(users).where(eq(users.userId, userId)).limit(1).then(rows => rows[0]);
  }

  static async createUser(userData: Omit<User, 'userId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    const [result] = await db.insert(users).values(userData);
    return result.insertId;
  }

  static async updateUser(userId: number, userData: Partial<Omit<User, 'userId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    await db.update(users).set(userData).where(eq(users.userId, userId));
    return true;
  }

  static async deleteUser(userId: number, deletedBy: number): Promise<boolean> {
    await db.update(users).set({ isDeleted: true, deletedBy, deletedDate: new Date() }).where(eq(users.userId, userId));
    return true;
  }
}

export default UserModel;

// models/profile.model.ts:
TypeScript

// models/profile.model.ts
import db from '../config/db.config';
import { profiles, users } from '../../../../schema/schema'; // Adjust path as needed
import { eq } from 'drizzle-orm';
import { Omit } from 'utility-types';

interface Profile {
  profileId: number;
  userId: number;
  headline: string;
  summary?: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  isPublic: boolean;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class ProfileModel {
  static async getAllProfiles(): Promise<Profile[]> {
    return db.select().from(profiles);
  }

  static async getProfileById(profileId: number): Promise<Profile | undefined> {
    return db.select().from(profiles).where(eq(profiles.profileId, profileId)).limit(1).then(rows => rows[0]);
  }

  static async createProfile(profileData: Omit<Profile, 'profileId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    const [result] = await db.insert(profiles).values(profileData);
    return result.insertId;
  }

  static async updateProfile(profileId: number, profileData: Partial<Omit<Profile, 'profileId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    await db.update(profiles).set(profileData).where(eq(profiles.profileId, profileId));
    return true;
  }

  static async deleteProfile(profileId: number, deletedBy: number): Promise<boolean> {
    await db.update(profiles).set({ isDeleted: true, deletedBy, deletedDate: new Date() }).where(eq(profiles.profileId, profileId));
    return true;
  }
}

export default ProfileModel;
// models/vendorOrganization.model.ts:
TypeScript

// models/vendorOrganization.model.ts
import db from '../config/db.config';
import { vendorOrganizations } from '../../../../schema/schema'; // Adjust path as needed
import { eq } from 'drizzle-orm';
import { Omit } from 'utility-types';

interface VendorOrganization {
  vendorOrgId: number;
  vendorOrgName: string;
  vendorOrgAddress: string;
  vendorOrgContact: string;
  vendorOrgEmail: string;
  vendorOrgImage?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class VendorOrganizationModel {
  static async getAllVendorOrganizations(): Promise<VendorOrganization[]> {
    return db.select().from(vendorOrganizations);
  }

  static async getVendorOrganizationById(vendorOrgId: number): Promise<VendorOrganization | undefined> {
    return db.select().from(vendorOrganizations).where(eq(vendorOrganizations.vendorOrgId, vendorOrgId)).limit(1).then(rows => rows[0]);
  }

  static async createVendorOrganization(vendorOrgData: Omit<VendorOrganization, 'vendorOrgId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    const [result] = await db.insert(vendorOrganizations).values(vendorOrgData);
    return result.insertId;
  }

  static async updateVendorOrganization(vendorOrgId: number, vendorOrgData: Partial<Omit<VendorOrganization, 'vendorOrgId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    await db.update(vendorOrganizations).set(vendorOrgData).where(eq(vendorOrganizations.vendorOrgId, vendorOrgId));
    return true;
  }

  static async deleteVendorOrganization(vendorOrgId: number, deletedBy: number): Promise<boolean> {
    await db.update(vendorOrganizations).set({ isDeleted: true, deletedBy, deletedDate: new Date() }).where(eq(vendorOrganizations.vendorOrgId, vendorOrgId));
    return true;
  }
}

export default VendorOrganizationModel;
// models/category.model.ts:
TypeScript

// models/category.model.ts
import db from '../config/db.config';
import { categories } from '../../../../schema/schema'; // Adjust path as needed
import { eq } from 'drizzle-orm';
import { Omit } from 'utility-types';

interface Category {
  categoryId: number;
  categoryName: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class CategoryModel {
  static async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  static async getCategoryById(categoryId: number): Promise<Category | undefined> {
    return db.select().from(categories).where(eq(categories.categoryId, categoryId)).limit(1).then(rows => rows[0]);
  }

  static async createCategory(categoryData: Omit<Category, 'categoryId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    const [result] = await db.insert(categories).values(categoryData);
    return result.insertId;
  }

  static async updateCategory(categoryId: number, categoryData: Partial<Omit<Category, 'categoryId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    await db.update(categories).set(categoryData).where(eq(categories.categoryId, categoryId));
    return true;
  }

  static async deleteCategory(categoryId: number, deletedBy: number): Promise<boolean> {
    await db.update(categories).set({ isDeleted: true, deletedBy, deletedDate: new Date() }).where(eq(categories.categoryId, categoryId));
    return true;
  }
}

export default CategoryModel;
// models/jobDescription.model.ts:
TypeScript

// models/jobDescription.model.ts
import db from '../config/db.config';
import { jobDescriptions } from '../../../../schema/schema'; // Adjust path as needed
import { eq } from 'drizzle-orm';
import { Omit } from 'utility-types';

interface JobDescription {
  jobDescriptionId: number;
  vendorOrgId: number;
  categoryId: number;
  jobType: string;
  level: string;
  vacancyNo: number;
  employeeType: string;
  jobLocation: string;
  offeredSalary: string;
  deadLine: Date;
  educationLevel: string;
  experienceRequired: string;
  otherSpecification?: string;
  jobWorkDescription: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class JobDescriptionModel {
  static async getAllJobDescriptions(): Promise<JobDescription[]> {
    return db.select().from(jobDescriptions);
  }

  static async getJobDescriptionById(jobDescriptionId: number): Promise<JobDescription | undefined> {
    return db.select().from(jobDescriptions).where(eq(jobDescriptions.jobDescriptionId, jobDescriptionId)).limit(1).then(rows => rows[0]);
  }

  static async createJobDescription(jobDescriptionData: Omit<JobDescription, 'jobDescriptionId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    const [result] = await db.insert(jobDescriptions).values(jobDescriptionData);
    return result.insertId;
  }

  static async updateJobDescription(jobDescriptionId: number, jobDescriptionData: Partial<Omit<JobDescription, 'jobDescriptionId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    await db.update(jobDescriptions).set(jobDescriptionData).where(eq(jobDescriptions.jobDescriptionId, jobDescriptionId));
    return true;
  }

  static async deleteJobDescription(jobDescriptionId: number, deletedBy: number): Promise<boolean> {
    await db.update(jobDescriptions).set({ isDeleted: true, deletedBy, deletedDate: new Date() }).where(eq(jobDescriptions.jobDescriptionId, jobDescriptionId));
    return true;
  }
}

export default JobDescriptionModel;
// models/application.model.ts:
TypeScript

// models/application.model.ts
import db from '../config/db.config';
import { applications } from '../../../../schema/schema'; // Adjust path as needed
import { eq } from 'drizzle-orm';
import { Omit } from 'utility-types';

interface Application {
  applicationId: number;
  jobDescriptionId: number;
  userId: number;
  status: 'pending' | 'shortlisted' | 'interviewed' | 'rejected' | 'accepted';
  resumeUrl: string;
  coverLetter?: string;
  expectedSalary?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class ApplicationModel {
  static async getAllApplications(): Promise<Application[]> {
    return db.select().from(applications);
  }

  static async getApplicationById(applicationId: number): Promise<Application | undefined> {
    return db.select().from(applications).where(eq(applications.applicationId, applicationId)).limit(1).then(rows => rows[0]);
  }

  static async createApplication(applicationData: Omit<Application, 'applicationId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    const [result] = await db.insert(applications).values(applicationData);
    return result.insertId;
  }

  static async updateApplication(applicationId: number, applicationData: Partial<Omit<Application, 'applicationId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    await db.update(applications).set(applicationData).where(eq(applications.applicationId, applicationId));
    return true;
  }

  static async deleteApplication(applicationId: number, deletedBy: number): Promise<boolean> {
    await db.update(applications).set({ isDeleted: true, deletedBy, deletedDate: new Date() }).where(eq(applications.applicationId, applicationId));
    return true;
  }
}

export default ApplicationModel;
// models/bookmark.model.ts:
TypeScript

// models/bookmark.model.ts
import db from '../config/db.config';
import { bookmarks } from '../../../../schema/schema'; // Adjust path as needed
import { eq } from 'drizzle-orm';
import { Omit } from 'utility-types';

interface Bookmark {
  bookmarkId: number;
  userId: number;
  jobDescriptionId: number;
  notes?: string;
  reminderDate?: Date;
  status: 'saved' | 'applied' | 'archived';
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class BookmarkModel {
  static async getAllBookmarks(): Promise<Bookmark[]> {
    return db.select().from(bookmarks);
  }

  static async getBookmarkById(bookmarkId: number): Promise<Bookmark | undefined> {
    return db.select().from(bookmarks).where(eq(bookmarks.bookmarkId, bookmarkId)).limit(1).then(rows => rows[0]);
  }

  static async createBookmark(bookmarkData: Omit<Bookmark, 'bookmarkId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    const [result] = await db.insert(bookmarks).values(bookmarkData);
    return result.insertId;
  }

  static async updateBookmark(bookmarkId: number, bookmarkData: Partial<Omit<Bookmark, 'bookmarkId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    await db.update(bookmarks).set(bookmarkData).where(eq(bookmarks.bookmarkId, bookmarkId));
    return true;
  }

  static async deleteBookmark(bookmarkId: number, deletedBy: number): Promise<boolean> {
    await db.update(bookmarks).set({ isDeleted: true, deletedBy, deletedDate: new Date() }).where(eq(bookmarks.bookmarkId, bookmarkId));
    return true;
  }
}

export default BookmarkModel;

Services (in services directory):

Add types to service methods.

// services/user.service.ts:
TypeScript

// services/user.service.ts
import UserModel from '../models/user.model';
import { Omit } from 'utility-types';

interface User {
  userId: number;
  email: string;
  password?: string; // Password typically not returned in SELECT queries
  fullName: string;
  contactNumber: string;
  address: string;
  role: 'jobseeker' | 'vendor' | 'admin';
  profileImage?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class UserService {
  static async getAllUsers(): Promise<User[]> {
    return await UserModel.getAllUsers();
  }

  static async getUserById(userId: number): Promise<User | undefined> {
    return await UserModel.getUserById(userId);
  }

  static async createUser(userData: Omit<User, 'userId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    return await UserModel.createUser(userData);
  }

  static async updateUser(userId: number, userData: Partial<Omit<User, 'userId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    return await UserModel.updateUser(userId, userData);
  }

  static async deleteUser(userId: number, deletedBy: number): Promise<boolean> {
    return await UserModel.deleteUser(userId, deletedBy);
  }
}

export default UserService;
// services/profile.service.ts:
TypeScript

// services/profile.service.ts
import ProfileModel from '../models/profile.model';
import { Omit } from 'utility-types';

interface Profile {
  profileId: number;
  userId: number;
  headline: string;
  summary?: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  isPublic: boolean;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}


class ProfileService {
  static async getAllProfiles(): Promise<Profile[]> {
    return await ProfileModel.getAllProfiles();
  }

  static async getProfileById(profileId: number): Promise<Profile | undefined> {
    return await ProfileModel.getProfileById(profileId);
  }

  static async createProfile(profileData: Omit<Profile, 'profileId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    return await ProfileModel.createProfile(profileData);
  }

  static async updateProfile(profileId: number, profileData: Partial<Omit<Profile, 'profileId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    return await ProfileModel.updateProfile(profileId, profileData);
  }

  static async deleteProfile(profileId: number, deletedBy: number): Promise<boolean> {
    return await ProfileModel.deleteProfile(profileId, deletedBy);
  }
}

export default ProfileService;
// services/vendorOrganization.service.ts:
TypeScript

// services/vendorOrganization.service.ts
import VendorOrganizationModel from '../models/vendorOrganization.model';
import { Omit } from 'utility-types';

interface VendorOrganization {
  vendorOrgId: number;
  vendorOrgName: string;
  vendorOrgAddress: string;
  vendorOrgContact: string;
  vendorOrgEmail: string;
  vendorOrgImage?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class VendorOrganizationService {
  static async getAllVendorOrganizations(): Promise<VendorOrganization[]> {
    return await VendorOrganizationModel.getAllVendorOrganizations();
  }

  static async getVendorOrganizationById(vendorOrgId: number): Promise<VendorOrganization | undefined> {
    return await VendorOrganizationModel.getVendorOrganizationById(vendorOrgId);
  }

  static async createVendorOrganization(vendorOrgData: Omit<VendorOrganization, 'vendorOrgId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    return await VendorOrganizationModel.createVendorOrganization(vendorOrgData);
  }

  static async updateVendorOrganization(vendorOrgId: number, vendorOrgData: Partial<Omit<VendorOrganization, 'vendorOrgId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    return await VendorOrganizationModel.updateVendorOrganization(vendorOrgId, vendorOrgData);
  }

  static async deleteVendorOrganization(vendorOrgId: number, deletedBy: number): Promise<boolean> {
    return await VendorOrganizationModel.deleteVendorOrganization(vendorOrgId, deletedBy);
  }
}

export default VendorOrganizationService;
// services/category.service.ts:
TypeScript

// services/category.service.ts
import CategoryModel from '../models/category.model';
import { Omit } from 'utility-types';

interface Category {
  categoryId: number;
  categoryName: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}


class CategoryService {
  static async getAllCategories(): Promise<Category[]> {
    return await CategoryModel.getAllCategories();
  }

  static async getCategoryById(categoryId: number): Promise<Category | undefined> {
    return await CategoryModel.getCategoryById(categoryId);
  }

  static async createCategory(categoryData: Omit<Category, 'categoryId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    return await CategoryModel.createCategory(categoryData);
  }

  static async updateCategory(categoryId: number, categoryData: Partial<Omit<Category, 'categoryId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    return await CategoryModel.updateCategory(categoryId, categoryData);
  }

  static async deleteCategory(categoryId: number, deletedBy: number): Promise<boolean> {
    return await CategoryModel.deleteCategory(categoryId, deletedBy);
  }
}

export default CategoryService;
// services/jobDescription.service.ts:
TypeScript

// services/jobDescription.service.ts
import JobDescriptionModel from '../models/jobDescription.model';
import { Omit } from 'utility-types';

interface JobDescription {
  jobDescriptionId: number;
  vendorOrgId: number;
  categoryId: number;
  jobType: string;
  level: string;
  vacancyNo: number;
  employeeType: string;
  jobLocation: string;
  offeredSalary: string;
  deadLine: Date;
  educationLevel: string;
  experienceRequired: string;
  otherSpecification?: string;
  jobWorkDescription: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}

class JobDescriptionService {
  static async getAllJobDescriptions(): Promise<JobDescription[]> {
    return await JobDescriptionModel.getAllJobDescriptions();
  }

  static async getJobDescriptionById(jobDescriptionId: number): Promise<JobDescription | undefined> {
    return await JobDescriptionModel.getJobDescriptionById(jobDescriptionId);
  }

  static async createJobDescription(jobDescriptionData: Omit<JobDescription, 'jobDescriptionId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    return await JobDescriptionModel.createJobDescription(jobDescriptionData);
  }

  static async updateJobDescription(jobDescriptionId: number, jobDescriptionData: Partial<Omit<JobDescription, 'jobDescriptionId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    return await JobDescriptionModel.updateJobDescription(jobDescriptionId, jobDescriptionData);
  }

  static async deleteJobDescription(jobDescriptionId: number, deletedBy: number): Promise<boolean> {
    return await JobDescriptionModel.deleteJobDescription(jobDescriptionId, deletedBy);
  }
}

export default JobDescriptionService;
// services/application.service.ts:
TypeScript

// services/application.service.ts
import ApplicationModel from '../models/application.model';
import { Omit } from 'utility-types';

interface Application {
  applicationId: number;
  jobDescriptionId: number;
  userId: number;
  status: 'pending' | 'shortlisted' | 'interviewed' | 'rejected' | 'accepted';
  resumeUrl: string;
  coverLetter?: string;
  expectedSalary?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}


class ApplicationService {
  static async getAllApplications(): Promise<Application[]> {
    return await ApplicationModel.getAllApplications();
  }

  static async getApplicationById(applicationId: number): Promise<Application | undefined> {
    return await ApplicationModel.getApplicationById(applicationId);
  }

  static async createApplication(applicationData: Omit<Application, 'applicationId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    return await ApplicationModel.createApplication(applicationData);
  }

  static async updateApplication(applicationId: number, applicationData: Partial<Omit<Application, 'applicationId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    return await ApplicationModel.updateApplication(applicationId, applicationData);
  }

  static async deleteApplication(applicationId: number, deletedBy: number): Promise<boolean> {
    return await ApplicationModel.deleteApplication(applicationId, deletedBy);
  }
}

export default ApplicationService;
// services/bookmark.service.ts:
TypeScript

// services/bookmark.service.ts
import BookmarkModel from '../models/bookmark.model';
import { Omit } from 'utility-types';

interface Bookmark {
  bookmarkId: number;
  userId: number;
  jobDescriptionId: number;
  notes?: string;
  reminderDate?: Date;
  status: 'saved' | 'applied' | 'archived';
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}


class BookmarkService {
  static async getAllBookmarks(): Promise<Bookmark[]> {
    return await BookmarkModel.getAllBookmarks();
  }

  static async getBookmarkById(bookmarkId: number): Promise<Bookmark | undefined> {
    return await BookmarkModel.getBookmarkById(bookmarkId);
  }

  static async createBookmark(bookmarkData: Omit<Bookmark, 'bookmarkId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>): Promise<number> {
    return await BookmarkModel.createBookmark(bookmarkData);
  }

  static async updateBookmark(bookmarkId: number, bookmarkData: Partial<Omit<Bookmark, 'bookmarkId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>>): Promise<boolean> {
    return await BookmarkModel.updateBookmark(bookmarkId, bookmarkData);
  }

  static async deleteBookmark(bookmarkId: number, deletedBy: number): Promise<boolean> {
    return await BookmarkModel.deleteBookmark(bookmarkId, deletedBy);
  }
}

export default BookmarkService;
5. Controllers (in controllers directory):

Add types for request, response, and controller methods.

// controllers/user.controller.ts:
TypeScript

// controllers/user.controller.ts
import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { Omit } from 'utility-types';

interface User {
  userId: number;
  email: string;
  password?: string; // Password typically not returned in SELECT queries
  fullName: string;
  contactNumber: string;
  address: string;
  role: 'jobseeker' | 'vendor' | 'admin';
  profileImage?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}


class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const user = await UserService.getUserById(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: Omit<User, 'userId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'> = req.body;
      const userId = await UserService.createUser(userData);
      res.status(201).json({ message: 'User created successfully', userId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const userData: Partial<Omit<User, 'userId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>> = req.body;
      await UserService.updateUser(userId, userData);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const deletedBy: number = req.body.deletedBy; // Assuming deletedBy is passed in the body
      await UserService.deleteUser(userId, deletedBy);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
// controllers/profile.controller.ts:1   
1.
github.com
github.com
TypeScript

// controllers/profile.controller.ts
import { Request, Response } from 'express';
import ProfileService from '../services/profile.service';
import { Omit } from 'utility-types';

interface Profile {
  profileId: number;
  userId: number;
  headline: string;
  summary?: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  isPublic: boolean;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}


class ProfileController {
  static async getAllProfiles(req: Request, res: Response): Promise<void> {
    try {
      const profiles = await ProfileService.getAllProfiles();
      res.status(200).json(profiles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfileById(req: Request, res: Response): Promise<void> {
    try {
      const profileId = parseInt(req.params.profileId);
      const profile = await ProfileService.getProfileById(profileId);
      if (profile) {
        res.status(200).json(profile);
      } else {
        res.status(404).json({ message: 'Profile not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProfile(req: Request, res: Response): Promise<void> {
    try {
      const profileData: Omit<Profile, 'profileId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'> = req.body;
      const profileId = await ProfileService.createProfile(profileData);
      res.status(201).json({ message: 'Profile created successfully', profileId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const profileId = parseInt(req.params.profileId);
      const profileData: Partial<Omit<Profile, 'profileId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>> = req.body;
      await ProfileService.updateProfile(profileId, profileData);
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteProfile(req: Request, res: Response): Promise<void> {
    try {
      const profileId = parseInt(req.params.profileId);
      const deletedBy: number = req.body.deletedBy; // Assuming deletedBy is passed in the body
      await ProfileService.deleteProfile(profileId, deletedBy);
      res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProfileController;
// controllers/vendorOrganization.controller.ts:
TypeScript

// controllers/vendorOrganization.controller.ts
import { Request, Response } from 'express';
import VendorOrganizationService from '../services/vendorOrganization.service';
import { Omit } from 'utility-types';

interface VendorOrganization {
  vendorOrgId: number;
  vendorOrgName: string;
  vendorOrgAddress: string;
  vendorOrgContact: string;
  vendorOrgEmail: string;
  vendorOrgImage?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}


class VendorOrganizationController {
  static async getAllVendorOrganizations(req: Request, res: Response): Promise<void> {
    try {
      const vendorOrganizations = await VendorOrganizationService.getAllVendorOrganizations();
      res.status(200).json(vendorOrganizations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVendorOrganizationById(req: Request, res: Response): Promise<void> {
    try {
      const vendorOrgId = parseInt(req.params.vendorOrgId);
      const vendorOrganization = await VendorOrganizationService.getVendorOrganizationById(vendorOrgId);
      if (vendorOrganization) {
        res.status(200).json(vendorOrganization);
      } else {
        res.status(404).json({ message: 'Vendor Organization not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createVendorOrganization(req: Request, res: Response): Promise<void> {
    try {
      const vendorOrgData: Omit<VendorOrganization, 'vendorOrgId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'> = req.body;
      const vendorOrgId = await VendorOrganizationService.createVendorOrganization(vendorOrgData);
      res.status(201).json({ message: 'Vendor Organization created successfully', vendorOrgId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateVendorOrganization(req: Request, res: Response): Promise<void> {
    try {
      const vendorOrgId = parseInt(req.params.vendorOrgId);
      const vendorOrgData: Partial<Omit<VendorOrganization, 'vendorOrgId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>> = req.body;
      await VendorOrganizationService.updateVendorOrganization(vendorOrgId, vendorOrgData);
      res.status(200).json({ message: 'Vendor Organization updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteVendorOrganization(req: Request, res: Response): Promise<void> {
    try {
      const vendorOrgId = parseInt(req.params.vendorOrgId);
      const deletedBy: number = req.body.deletedBy; // Assuming deletedBy is passed in the body
      await VendorOrganizationService.deleteVendorOrganization(vendorOrgId, deletedBy);
      res.status(200).json({ message: 'Vendor Organization deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default VendorOrganizationController;
// controllers/category.controller.ts:
TypeScript

// controllers/category.controller.ts
import { Request, Response } from 'express';
import CategoryService from '../services/category.service';
import { Omit } from 'utility-types';

interface Category {
  categoryId: number;
  categoryName: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}


class CategoryController {
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const category = await CategoryService.getCategoryById(categoryId);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData: Omit<Category, 'categoryId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'> = req.body;
      const categoryId = await CategoryService.createCategory(categoryData);
      res.status(201).json({ message: 'Category created successfully', categoryId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const categoryData: Partial<Omit<Category, 'categoryId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>> = req.body;
      await CategoryService.updateCategory(categoryId, categoryData);
      res.status(200).json({ message: 'Category updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const deletedBy: number = req.body.deletedBy; // Assuming deletedBy is passed in the body
      await CategoryService.deleteCategory(categoryId, deletedBy);
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default CategoryController;
// controllers/jobDescription.controller.ts:
TypeScript

// controllers/jobDescription.controller.ts
import { Request, Response } from 'express';
import JobDescriptionService from '../services/jobDescription.service';
import { Omit } from 'utility-types';

interface JobDescription {
  jobDescriptionId: number;
  vendorOrgId: number;
  categoryId: number;
  jobType: string;
  level: string;
  vacancyNo: number;
  employeeType: string;
  jobLocation: string;
  offeredSalary: string;
  deadLine: Date;
  educationLevel: string;
  experienceRequired: string;
  otherSpecification?: string;
  jobWorkDescription: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}


class JobDescriptionController {
  static async getAllJobDescriptions(req: Request, res: Response): Promise<void> {
    try {
      const jobDescriptions = await JobDescriptionService.getAllJobDescriptions();
      res.status(200).json(jobDescriptions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getJobDescriptionById(req: Request, res: Response): Promise<void> {
    try {
      const jobDescriptionId = parseInt(req.params.jobDescriptionId);
      const jobDescription = await JobDescriptionService.getJobDescriptionById(jobDescriptionId);
      if (jobDescription) {
        res.status(200).json(jobDescription);
      } else {
        res.status(404).json({ message: 'Job Description not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createJobDescription(req: Request, res: Response): Promise<void> {
    try {
      const jobDescriptionData: Omit<JobDescription, 'jobDescriptionId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'> = req.body;
      const jobDescriptionId = await JobDescriptionService.createJobDescription(jobDescriptionData);
      res.status(201).json({ message: 'Job Description created successfully', jobDescriptionId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateJobDescription(req: Request, res: Response): Promise<void> {
    try {
      const jobDescriptionId = parseInt(req.params.jobDescriptionId);
      const jobDescriptionData: Partial<Omit<JobDescription, 'jobDescriptionId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>> = req.body;
      await JobDescriptionService.updateJobDescription(jobDescriptionId, jobDescriptionData);
      res.status(200).json({ message: 'Job Description updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteJobDescription(req: Request, res: Response): Promise<void> {
    try {
      const jobDescriptionId = parseInt(req.params.jobDescriptionId);
      const deletedBy: number = req.body.deletedBy; // Assuming deletedBy is passed in the body
      await JobDescriptionService.deleteJobDescription(jobDescriptionId, deletedBy);
      res.status(200).json({ message: 'Job Description deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default JobDescriptionController;
// controllers/application.controller.ts:
TypeScript

// controllers/application.controller.ts
import { Request, Response } from 'express';
import ApplicationService from '../services/application.service';
import { Omit } from 'utility-types';

interface Application {
  applicationId: number;
  jobDescriptionId: number;
  userId: number;
  status: 'pending' | 'shortlisted' | 'interviewed' | 'rejected' | 'accepted';
  resumeUrl: string;
  coverLetter?: string;
  expectedSalary?: string;
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}


class ApplicationController {
  static async getAllApplications(req: Request, res: Response): Promise<void> {
    try {
      const applications = await ApplicationService.getAllApplications();
      res.status(200).json(applications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const application = await ApplicationService.getApplicationById(applicationId);
      if (application) {
        res.status(200).json(application);
      } else {
        res.status(404).json({ message: 'Application not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createApplication(req: Request, res: Response): Promise<void> {
    try {
      const applicationData: Omit<Application, 'applicationId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'> = req.body;
      const applicationId = await ApplicationService.createApplication(applicationData);
      res.status(201).json({ message: 'Application created successfully', applicationId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateApplication(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const applicationData: Partial<Omit<Application, 'applicationId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>> = req.body;
      await ApplicationService.updateApplication(applicationId, applicationData);
      res.status(200).json({ message: 'Application updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteApplication(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.applicationId);
      const deletedBy: number = req.body.deletedBy; // Assuming deletedBy is passed in the body
      await ApplicationService.deleteApplication(applicationId, deletedBy);
      res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ApplicationController;
// controllers/bookmark.controller.ts:
TypeScript

// controllers/bookmark.controller.ts
import { Request, Response } from 'express';
import BookmarkService from '../services/bookmark.service';
import { Omit } from 'utility-types';

interface Bookmark {
  bookmarkId: number;
  userId: number;
  jobDescriptionId: number;
  notes?: string;
  reminderDate?: Date;
  status: 'saved' | 'applied' | 'archived';
  createdBy: number;
  createdDate: Date;
  updatedBy?: number;
  updatedDate?: Date;
  deletedBy?: number;
  deletedDate?: Date;
  isDeleted: boolean;
}


class BookmarkController {
  static async getAllBookmarks(req: Request, res: Response): Promise<void> {
    try {
      const bookmarks = await BookmarkService.getAllBookmarks();
      res.status(200).json(bookmarks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getBookmarkById(req: Request, res: Response): Promise<void> {
    try {
      const bookmarkId = parseInt(req.params.bookmarkId);
      const bookmark = await BookmarkService.getBookmarkById(bookmarkId);
      if (bookmark) {
        res.status(200).json(bookmark);
      } else {
        res.status(404).json({ message: 'Bookmark not found' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createBookmark(req: Request, res: Response): Promise<void> {
    try {
      const bookmarkData: Omit<Bookmark, 'bookmarkId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'> = req.body;
      const bookmarkId = await BookmarkService.createBookmark(bookmarkData);
      res.status(201).json({ message: 'Bookmark created successfully', bookmarkId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateBookmark(req: Request, res: Response): Promise<void> {
    try {
      const bookmarkId = parseInt(req.params.bookmarkId);
      const bookmarkData: Partial<Omit<Bookmark, 'bookmarkId' | 'createdDate' | 'updatedDate' | 'deletedDate' | 'isDeleted'>> = req.body;
      await BookmarkService.updateBookmark(bookmarkId, bookmarkData);
      res.status(200).json({ message: 'Bookmark updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteBookmark(req: Request, res: Response): Promise<void> {
    try {
      const bookmarkId = parseInt(req.params.bookmarkId);
      const deletedBy: number = req.body.deletedBy; // Assuming deletedBy is passed in the body
      await BookmarkService.deleteBookmark(bookmarkId, deletedBy);
      res.status(200).json({ message: 'Bookmark deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default BookmarkController;
6. Routes (in routes directory):

Update imports in route files.

// routes/user.routes.ts:
TypeScript

// routes/user.routes.ts
import express from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();

router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);

export default router;
// routes/profile.routes.ts:
TypeScript

// routes/profile.routes.ts
import express from 'express';
import ProfileController from '../controllers/profile.controller';

const router = express.Router();

router.get('/', ProfileController.getAllProfiles);
router.get('/:profileId', ProfileController.getProfileById);
router.post('/', ProfileController.createProfile);
router.put('/:profileId', ProfileController.updateProfile);
router.delete('/:profileId', ProfileController.deleteProfile);

export default router;
// routes/vendorOrganization.routes.ts:
// Code snippet

// routes/vendorOrganization.routes.ts
import express from 'express';
import VendorOrganizationController from '../controllers/vendorOrganization.controller';

const router = express.Router();

router.get('/', VendorOrganizationController.getAllVendorOrganizations);
router.get('/:vendorOrgId', VendorOrganizationController.getVendorOrganizationById);
router.post('/', VendorOrganizationController.createVendorOrganization);
router.put('/:vendorOrgId', VendorOrganizationController.updateVendorOrganization);
router.delete('/:vendorOrgId', VendorOrganizationController.deleteVendorOrganization);

export default router;
// routes/category.routes.ts:
TypeScript

// routes/category.routes.ts
import express from 'express';
import CategoryController from '../controllers/category.controller';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:categoryId', CategoryController.getCategoryById);
router.post('/', CategoryController.createCategory);
router.put('/:categoryId', CategoryController.updateCategory);
router.delete('/:categoryId', CategoryController.deleteCategory);

export default router;
// routes/jobDescription.routes.ts:
// TypeScript

// routes/jobDescription.routes.ts
import express from 'express';
import JobDescriptionController from '../controllers/jobDescription.controller';

const router = express.Router();

router.get('/', JobDescriptionController.getAllJobDescriptions);
router.get('/:jobDescriptionId', JobDescriptionController.getJobDescriptionById);
router.post('/', JobDescriptionController.createJobDescription);
router.put('/:jobDescriptionId', JobDescriptionController.updateJobDescription);
router.delete('/:jobDescriptionId', JobDescriptionController.deleteJobDescription);

export default router;
// routes/application.routes.ts:
// TypeScript

// routes/application.routes.ts
import express from 'express';
import ApplicationController from '../controllers/application.controller';

const router = express.Router();

router.get('/', ApplicationController.getAllApplications);
router.get('/:applicationId', ApplicationController.getApplicationById);
router.post('/', ApplicationController.createApplication);
router.put('/:applicationId', ApplicationController.updateApplication);
router.delete('/:applicationId', ApplicationController.deleteApplication);

export default router;
// routes/bookmark.routes.ts:
// TypeScript

// routes/bookmark.routes.ts
import express from 'express';
import BookmarkController from '../controllers/bookmark.controller';

const router = express.Router();

router.get('/', BookmarkController.getAllBookmarks);
router.get('/:bookmarkId', BookmarkController.getBookmarkById);
router.post('/', BookmarkController.createBookmark);
router.put('/:bookmarkId', BookmarkController.updateBookmark);
router.delete('/:bookmarkId', BookmarkController.deleteBookmark);

export default router;
// 7. index.ts (App Entry Point):

// TypeScript

// index.ts
import express, { Application, Request, Response } from 'express';
import userRoutes from './routes/user.routes';
import profileRoutes from './routes/profile.routes';
import vendorOrganizationRoutes from './routes/vendorOrganization.routes';
import categoryRoutes from './routes/category.routes';
import jobDescriptionRoutes from './routes/jobDescription.routes';
import applicationRoutes from './routes/application.routes';
import bookmarkRoutes from './routes/bookmark.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // for parsing application/json

// Use routes
app.use('/users', userRoutes);
app.use('/profiles', profileRoutes);
app.use('/vendor-organizations', vendorOrganizationRoutes);
app.use('/categories', categoryRoutes);
app.use('/job-descriptions', jobDescriptionRoutes);
app.use('/applications', applicationRoutes);
app.use('/bookmarks', bookmarkRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Job Application System API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});