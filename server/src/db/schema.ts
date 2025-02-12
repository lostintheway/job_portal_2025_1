import {
  mysqlTable,
  varchar,
  int,
  timestamp,
  datetime,
  mysqlEnum,
  boolean,
  text,
} from "drizzle-orm/mysql-core";

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
  fullName: varchar("full_name", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 20 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["jobseeker", "vendor", "admin"]).notNull(),
  profileImage: varchar("profile_image", { length: 255 }),
  ...commonFields,
});

// Profiles table
export const profiles = mysqlTable("profiles", {
  profileId: int("profile_id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.userId),
  headline: varchar("headline", { length: 255 }).notNull(),
  summary: text("summary"),
  experience: varchar("experience", { length: 2000 }).notNull(),
  education: varchar("education", { length: 2000 }).notNull(),
  skills: varchar("skills", { length: 2000 }).notNull(),
  languages: varchar("languages", { length: 2000 }).notNull(),
  isPublic: boolean("is_public").notNull().default(true),
  ...commonFields,
});

// Vendor Organizations table
export const vendorOrganizations = mysqlTable("vendor_organizations", {
  vendorOrgId: int("vendor_org_id").primaryKey().autoincrement(),
  vendorOrgName: varchar("vendor_org_name", { length: 255 }).notNull(),
  vendorOrgAddress: varchar("vendor_org_address", { length: 255 }).notNull(),
  vendorOrgContact: varchar("vendor_org_contact", { length: 20 }).notNull(),
  vendorOrgEmail: varchar("vendor_org_email", { length: 255 }).notNull(),
  vendorOrgImage: varchar("vendor_org_image", { length: 255 }),
  ...commonFields,
});

// Categories table
export const categories = mysqlTable("categories", {
  categoryId: int("category_id").primaryKey().autoincrement(),
  categoryName: varchar("category_name", { length: 255 }).notNull(),
  ...commonFields,
});

// Job Descriptions table
export const jobDescriptions = mysqlTable("job_descriptions", {
  jobDescriptionId: int("job_description_id").primaryKey().autoincrement(),
  vendorOrgId: int("vendor_org_id")
    .notNull()
    .references(() => vendorOrganizations.vendorOrgId),
  categoryId: int("category_id")
    .notNull()
    .references(() => categories.categoryId),
  jobType: varchar("job_type", { length: 50 }).notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  vacancyNo: int("vacancy_no").notNull(),
  employeeType: varchar("employee_type", { length: 50 }).notNull(),
  jobLocation: varchar("job_location", { length: 255 }).notNull(),
  offeredSalary: varchar("offered_salary", { length: 100 }).notNull(),
  deadLine: datetime("deadline").notNull(),
  educationLevel: varchar("education_level", { length: 100 }).notNull(),
  experienceRequired: varchar("experience_required", { length: 100 }).notNull(),
  otherSpecification: text("other_specification"),
  jobWorkDescription: text("job_work_description").notNull(),
  ...commonFields,
});

// Applications table
export const applications = mysqlTable("applications", {
  applicationId: int("application_id").primaryKey().autoincrement(),
  jobDescriptionId: int("job_description_id")
    .notNull()
    .references(() => jobDescriptions.jobDescriptionId),
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
  resumeUrl: varchar("resume_url", { length: 255 }).notNull(),
  coverLetter: text("cover_letter"),
  expectedSalary: varchar("expected_salary", { length: 100 }),
  ...commonFields,
});

// Bookmarks table
export const bookmarks = mysqlTable("bookmarks", {
  bookmarkId: int("bookmark_id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.userId),
  jobDescriptionId: int("job_description_id")
    .notNull()
    .references(() => jobDescriptions.jobDescriptionId),
  notes: text("notes"),
  reminderDate: datetime("reminder_date"),
  status: mysqlEnum("status", ["saved", "applied", "archived"])
    .notNull()
    .default("saved"),
  ...commonFields,
});

export type UserSelect = typeof users.$inferSelect;
export type ProfileSelect = typeof profiles.$inferSelect;
export type VendorOrganizationSelect = typeof vendorOrganizations.$inferSelect;
export type CategorySelect = typeof categories.$inferSelect;
export type JobDescriptionSelect = typeof jobDescriptions.$inferSelect;
export type ApplicationSelect = typeof applications.$inferSelect;
export type BookmarkSelect = typeof bookmarks.$inferSelect;

export type UserInsert = typeof users.$inferInsert;
export type ProfileInsert = typeof profiles.$inferInsert;
export type VendorOrganizationInsert = typeof vendorOrganizations.$inferInsert;
export type CategoryInsert = typeof categories.$inferInsert;
export type JobDescriptionInsert = typeof jobDescriptions.$inferInsert;
export type ApplicationInsert = typeof applications.$inferInsert;
export type BookmarkInsert = typeof bookmarks.$inferInsert;

// Indexes
// export const jobDescriptionsIndexes = {
//   vendorOrgIdIdx: sql`CREATE INDEX vendor_org_id_idx ON job_descriptions (vendor_org_id)`,
//   categoryIdIdx: sql`CREATE INDEX category_id_idx ON job_descriptions (category_id)`,
//   deadlineIdx: sql`CREATE INDEX deadline_idx ON job_descriptions (deadline)`,
// };

// export const applicationsIndexes = {
//   jobDescriptionIdIdx: sql`CREATE INDEX job_description_id_idx ON applications (job_description_id)`,
//   userIdIdx: sql`CREATE INDEX user_id_idx ON applications (user_id)`,
//   statusIdx: sql`CREATE INDEX status_idx ON applications (status)`,
// };

// export const bookmarksIndexes = {
//   userJobIdx: sql`CREATE INDEX user_job_idx ON bookmarks (user_id, job_description_id)`,
// };
