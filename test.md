CREATE TABLE `applications` (
	`application_id` int AUTO_INCREMENT NOT NULL,
	`job_id` int NOT NULL,
	`user_id` int NOT NULL,
	`status` enum('pending','shortlisted','interviewed','rejected','accepted') NOT NULL DEFAULT 'pending',
	`resume_url` varchar(255) NOT NULL,
	`cover_letter` text,
	`expected_salary` varchar(100),
	`application_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`interview_date` datetime,
	`interview_notes` text,
	`rejection_reason` text,
	`created_by` int NOT NULL,
	`created_date` timestamp NOT NULL DEFAULT (now()),
	`updated_by` int,
	`updated_date` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_by` int,
	`deleted_date` timestamp,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `applications_application_id` PRIMARY KEY(`application_id`)
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`bookmark_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`job_id` int NOT NULL,
	`notes` text,
	`reminder_date` datetime,
	`status` enum('saved','applied','archived') NOT NULL DEFAULT 'saved',
	`created_by` int NOT NULL,
	`created_date` timestamp NOT NULL DEFAULT (now()),
	`updated_by` int,
	`updated_date` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_by` int,
	`deleted_date` timestamp,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `bookmarks_bookmark_id` PRIMARY KEY(`bookmark_id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`category_id` int AUTO_INCREMENT NOT NULL,
	`category_name` varchar(255) NOT NULL,
	`created_by` int NOT NULL,
	`created_date` timestamp NOT NULL DEFAULT (now()),
	`updated_by` int,
	`updated_date` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_by` int,
	`deleted_date` timestamp,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `categories_category_id` PRIMARY KEY(`category_id`)
);
--> statement-breakpoint
CREATE TABLE `employer_profiles` (
	`employer_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`company_name` varchar(255) NOT NULL,
	`company_address` varchar(255) NOT NULL,
	`company_contact` varchar(20) NOT NULL,
	`company_email` varchar(255) NOT NULL,
	`company_logo` varchar(255),
	`company_description` text,
	`industry_type` varchar(100),
	`established_date` date,
	`company_size` varchar(50),
	`company_website` varchar(255),
	`created_by` int NOT NULL,
	`created_date` timestamp NOT NULL DEFAULT (now()),
	`updated_by` int,
	`updated_date` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_by` int,
	`deleted_date` timestamp,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `employer_profiles_employer_id` PRIMARY KEY(`employer_id`)
);
--> statement-breakpoint
CREATE TABLE `job_listings` (
	`job_id` int AUTO_INCREMENT NOT NULL,
	`employer_id` int NOT NULL,
	`category_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`job_type` enum('full-time','part-time','contract','internship','remote') NOT NULL,
	`level` varchar(50) NOT NULL,
	`vacancies` int NOT NULL,
	`employment_type` varchar(50) NOT NULL,
	`job_location` varchar(255) NOT NULL,
	`offered_salary` varchar(100),
	`deadline` datetime NOT NULL,
	`education_level` varchar(100),
	`experience_required` varchar(100),
	`other_specification` text,
	`job_description` text NOT NULL,
	`responsibilities` text,
	`benefits` text,
	`is_premium` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`view_count` int NOT NULL DEFAULT 0,
	`created_by` int NOT NULL,
	`created_date` timestamp NOT NULL DEFAULT (now()),
	`updated_by` int,
	`updated_date` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_by` int,
	`deleted_date` timestamp,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `job_listings_job_id` PRIMARY KEY(`job_id`)
);
--> statement-breakpoint
CREATE TABLE `jobseeker_profiles` (
	`profile_id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`headline` varchar(255) NOT NULL,
	`summary` text,
	`experience` varchar(2000),
	`education` varchar(2000),
	`skills` varchar(2000),
	`languages` varchar(500),
	`is_public` boolean NOT NULL DEFAULT true,
	`created_by` int NOT NULL,
	`created_date` timestamp NOT NULL DEFAULT (now()),
	`updated_by` int,
	`updated_date` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`deleted_by` int,
	`deleted_date` timestamp,
	`is_deleted` boolean NOT NULL DEFAULT false,
	CONSTRAINT `jobseeker_profiles_profile_id` PRIMARY KEY(`profile_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`contact_number` varchar(20) NOT NULL,
	`address` varchar(255) NOT NULL,
	`role` enum('jobseeker','employer','admin') NOT NULL,
	`profile_image` varchar(255),
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);