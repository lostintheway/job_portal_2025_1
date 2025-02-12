import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  int,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["jobseeker", "organization", "admin"]).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const companies = mysqlTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  website: varchar("website", { length: 255 }).notNull(),
  logoUrl: varchar("logo_url", { length: 255 }).notNull(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  industry: varchar("industry", { length: 255 }).notNull(),
  size: varchar("size", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const jobs = mysqlTable("jobs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  salaryRange: varchar("salary_range", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  organizationId: int("organization_id")
    .references(() => companies.id)
    .notNull(),
  jobType: mysqlEnum("job_type", [
    "full-time",
    "part-time",
    "remote",
    "internship",
    "contract",
  ])
    .default("full-time")
    .notNull(),
  experienceLevel: varchar("experience_level", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["active", "closed"]).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const applications = mysqlTable("applications", {
  id: serial("id").primaryKey(),
  jobId: int("job_id")
    .references(() => jobs.id)
    .notNull(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  status: mysqlEnum("status", [
    "pending",
    "reviewed",
    "shortlisted",
    "rejected",
    "accepted",
  ])
    .default("pending")
    .notNull(),
  resumeUrl: varchar("resume_url", { length: 255 }).notNull(),
  coverLetter: text("cover_letter").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
