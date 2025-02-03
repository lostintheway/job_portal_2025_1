ALTER TABLE `applications` MODIFY COLUMN `job_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` MODIFY COLUMN `status` enum('pending','reviewed','shortlisted','rejected','accepted') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `applications` MODIFY COLUMN `cover_letter` text NOT NULL;--> statement-breakpoint
ALTER TABLE `companies` MODIFY COLUMN `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `companies` MODIFY COLUMN `website` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `companies` MODIFY COLUMN `logo_url` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `companies` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `company_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `job_type` enum('full-time','part-time','remote','internship','contract') NOT NULL DEFAULT 'full-time';--> statement-breakpoint
ALTER TABLE `jobs` MODIFY COLUMN `status` enum('active','closed') NOT NULL DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('jobseeker','company','admin') NOT NULL;