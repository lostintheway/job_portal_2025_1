import {
  mysqlTable,
  varchar,
  int,
  timestamp,
  datetime,
  mysqlEnum,
  boolean,
  text,
  date,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

// Common fields for most tables
const commonFields = {
  createdBy: int("created_by").notNull(),
  createdDate: timestamp("created_date").notNull().defaultNow(),
  updatedBy: int("updated_by"),
  updatedDate: timestamp("updated_date").onUpdateNow(),
  deletedBy: int("deleted_by"),
  deletedDate: timestamp("deleted_date"),
  isDeleted: boolean("is_deleted").notNull().default(false),
};

// Users table
export const users = mysqlTable("users", {
  userId: int("user_id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  salt: varchar("salt", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 20 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["jobseeker", "employer", "admin"]).notNull(),
});

// JobSeeker Profiles table
export const jobseekerProfiles = mysqlTable("jobseeker_profiles", {
  profileId: int("profile_id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.userId),
  headline: varchar("headline", { length: 255 }).notNull(),
  summary: text("summary"),
  experience: varchar("experience", { length: 2000 }),
  education: varchar("education", { length: 2000 }),
  skills: varchar("skills", { length: 2000 }),
  languages: varchar("languages", { length: 500 }),
  isPublic: boolean("is_public").notNull().default(true),
  ...commonFields,
});

// Employer Profiles table
export const employerProfiles = mysqlTable("employer_profiles", {
  employerId: int("employer_id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.userId),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  companyAddress: varchar("company_address", { length: 255 }).notNull(),
  companyContact: varchar("company_contact", { length: 20 }).notNull(),
  companyEmail: varchar("company_email", { length: 255 }).notNull(),
  companyLogo: varchar("company_logo", { length: 255 }),
  companyDescription: text("company_description"),
  industryType: varchar("industry_type", { length: 100 }),
  establishedDate: date("established_date"),
  companySize: varchar("company_size", { length: 50 }),
  companyWebsite: varchar("company_website", { length: 255 }),
  ...commonFields,
});

// Categories table
export const categories = mysqlTable("categories", {
  categoryId: int("category_id").primaryKey().autoincrement(),
  categoryName: varchar("category_name", { length: 255 }).notNull(),
  ...commonFields,
});

// Job Listings table
export const jobListings = mysqlTable("job_listings", {
  jobId: int("job_id").primaryKey().autoincrement(),
  employerId: int("employer_id")
    .notNull()
    .references(() => employerProfiles.employerId),
  categoryId: int("category_id")
    .notNull()
    .references(() => categories.categoryId),
  title: varchar("title", { length: 255 }).notNull(),
  jobType: mysqlEnum("job_type", [
    "full-time",
    "part-time",
    "contract",
    "internship",
    "remote",
  ]).notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  vacancies: int("vacancies").notNull(),
  employmentType: varchar("employment_type", { length: 50 }).notNull(),
  jobLocation: varchar("job_location", { length: 255 }).notNull(),
  offeredSalary: varchar("offered_salary", { length: 100 }),
  deadLine: datetime("deadline").notNull(),
  educationLevel: varchar("education_level", { length: 100 }),
  experienceRequired: varchar("experience_required", { length: 100 }),
  otherSpecification: text("other_specification"),
  jobDescription: text("job_description").notNull(),
  responsibilities: text("responsibilities"),
  benefits: text("benefits"),
  isPremium: boolean("is_premium").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  viewCount: int("view_count").notNull().default(0),
  ...commonFields,
});

// Applications table
export const applications = mysqlTable("applications", {
  applicationId: int("application_id").primaryKey().autoincrement(),
  jobId: int("job_id")
    .notNull()
    .references(() => jobListings.jobId),
  userId: int("user_id")
    .notNull()
    .references(() => users.userId),
  status: mysqlEnum("status", [
    "pending",
    "shortlisted",
    "interviewed",
    "rejected",
    "accepted",
  ])
    .notNull()
    .default("pending"),
  resumeUrl: varchar("resume_url", { length: 255 }).default(""),
  coverLetter: text("cover_letter").default(""),
  expectedSalary: varchar("expected_salary", { length: 100 }).default(""),
  applicationDate: datetime("application_date")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  interviewDate: datetime("interview_date"),
  interviewNotes: text("interview_notes"),
  rejectionReason: text("rejection_reason"),
  ...commonFields,
});

// Bookmarks table
export const bookmarks = mysqlTable("bookmarks", {
  bookmarkId: int("bookmark_id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.userId),
  jobId: int("job_id")
    .notNull()
    .references(() => jobListings.jobId),
  notes: text("notes"),
  reminderDate: datetime("reminder_date"),
  status: mysqlEnum("status", ["saved", "applied", "archived"])
    .notNull()
    .default("saved"),
  ...commonFields,
});

// Type definitions for TypeScript
export type UserSelect = typeof users.$inferSelect;
export type CategorySelect = typeof categories.$inferSelect;
export type ApplicationSelect = typeof applications.$inferSelect;
export type BookmarkSelect = typeof bookmarks.$inferSelect;
export type JobListingSelect = typeof jobListings.$inferSelect;
export type EmployerProfileSelect = typeof employerProfiles.$inferSelect;
export type JobSeekerProfileSelect = typeof jobseekerProfiles.$inferSelect;

export type UserInsert = typeof users.$inferInsert;
export type CategoryInsert = typeof categories.$inferInsert;
export type ApplicationInsert = typeof applications.$inferInsert;
export type BookmarkInsert = typeof bookmarks.$inferInsert;
export type JobListingInsert = typeof jobListings.$inferInsert;
export type EmployerProfileInsert = typeof employerProfiles.$inferInsert;
export type JobSeekerProfileInsert = typeof jobseekerProfiles.$inferInsert;
