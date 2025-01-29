import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const companies = mysqlTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }).notNull(),
  website: varchar("website", { length: 255 }),
  logoUrl: varchar("logo_url", { length: 255 }),
  userId: int("user_id").references(() => users.id),
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
  companyId: int("company_id").references(() => companies.id),
  jobType: varchar("job_type", { length: 50 }).notNull(),
  experienceLevel: varchar("experience_level", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const applications = mysqlTable("applications", {
  id: serial("id").primaryKey(),
  jobId: int("job_id").references(() => jobs.id),
  userId: int("user_id").references(() => users.id),
  status: varchar("status", { length: 50 }).default("pending"),
  resumeUrl: varchar("resume_url", { length: 255 }).notNull(),
  coverLetter: text("cover_letter"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
