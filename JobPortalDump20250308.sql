CREATE DATABASE  IF NOT EXISTS `jobportal_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `jobportal_db`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: jobportal_db
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `__drizzle_migrations`
--

DROP TABLE IF EXISTS `__drizzle_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__drizzle_migrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hash` text NOT NULL,
  `created_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__drizzle_migrations`
--

LOCK TABLES `__drizzle_migrations` WRITE;
/*!40000 ALTER TABLE `__drizzle_migrations` DISABLE KEYS */;
INSERT INTO `__drizzle_migrations` VALUES (1,'2f509137ec87f0840721c8cb793d3444a55ba9ec5e1b8ce64cfe47df94d83457',1740646709111);
/*!40000 ALTER TABLE `__drizzle_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `job_id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('pending','shortlisted','interviewed','rejected','accepted') NOT NULL DEFAULT 'pending',
  `resume_url` varchar(255) DEFAULT '',
  `cover_letter` text DEFAULT (_utf8mb4''),
  `expected_salary` varchar(100) DEFAULT '',
  `application_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `interview_date` datetime DEFAULT NULL,
  `interview_notes` text,
  `rejection_reason` text,
  `created_by` int NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT (now()),
  `updated_by` int DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` int DEFAULT NULL,
  `deleted_date` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`application_id`),
  KEY `applications_job_id_job_listings_job_id_fk` (`job_id`),
  KEY `applications_user_id_users_user_id_fk` (`user_id`),
  CONSTRAINT `applications_job_id_job_listings_job_id_fk` FOREIGN KEY (`job_id`) REFERENCES `job_listings` (`job_id`),
  CONSTRAINT `applications_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (6,1,1,'pending','resume_url_1.pdf','Cover letter for Software Engineer role.','$130,000','2025-03-04 11:04:47',NULL,NULL,NULL,1,'2025-03-04 05:16:47',NULL,'2025-03-08 06:21:38',NULL,NULL,0),(7,2,4,'shortlisted','resume_url_2.pdf','Cover letter for Financial Analyst role.','$90,000','2025-03-04 11:04:47','2024-11-08 10:00:00','Candidate seems promising, good experience.',NULL,4,'2025-03-04 05:17:47',NULL,'2025-03-08 06:21:38',NULL,NULL,0),(8,3,1,'rejected','resume_url_3.pdf','Cover letter for Marketing role.','$50/hour','2025-03-04 11:04:47','2024-11-05 11:30:00','Interview went okay, but not the right fit.','Lack of specific experience in our industry.',1,'2025-03-04 05:18:47',NULL,'2025-03-08 06:21:38',NULL,NULL,0),(9,2,1,'interviewed','resume_url_4.pdf','Another application for Financial Analyst.','$95,000','2025-03-04 11:04:47','2024-11-12 14:00:00','Second interview scheduled, very strong candidate.',NULL,1,'2025-03-04 05:19:47',NULL,NULL,NULL,NULL,0),(10,1,4,'accepted','resume_url_5.pdf','Another application for Software Engineer.','$140,000','2025-03-04 11:04:47','2024-11-15 15:00:00','Offered the position, candidate accepted.',NULL,4,'2025-03-04 05:20:47',NULL,'2025-03-08 06:21:38',NULL,NULL,0),(11,2,1,'accepted','','Test','25000','2025-03-08 12:59:27',NULL,NULL,NULL,1,'2025-03-08 01:29:27',NULL,'2025-03-08 02:13:17',NULL,NULL,0);
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookmarks`
--

DROP TABLE IF EXISTS `bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookmarks` (
  `bookmark_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `job_id` int NOT NULL,
  `notes` text,
  `reminder_date` datetime DEFAULT NULL,
  `status` enum('saved','applied','archived') NOT NULL DEFAULT 'saved',
  `created_by` int NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT (now()),
  `updated_by` int DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` int DEFAULT NULL,
  `deleted_date` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`bookmark_id`),
  KEY `bookmarks_user_id_users_user_id_fk` (`user_id`),
  KEY `bookmarks_job_id_job_listings_job_id_fk` (`job_id`),
  CONSTRAINT `bookmarks_job_id_job_listings_job_id_fk` FOREIGN KEY (`job_id`) REFERENCES `job_listings` (`job_id`),
  CONSTRAINT `bookmarks_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookmarks`
--

LOCK TABLES `bookmarks` WRITE;
/*!40000 ALTER TABLE `bookmarks` DISABLE KEYS */;
INSERT INTO `bookmarks` VALUES (6,1,3,'Save this for future consideration, contract role.',NULL,'saved',1,'2025-03-04 05:19:45',NULL,NULL,NULL,NULL,0),(7,1,2,NULL,NULL,'saved',1,'2025-03-08 01:00:04',NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `created_by` int NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT (now()),
  `updated_by` int DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` int DEFAULT NULL,
  `deleted_date` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Technology',3,'2025-03-03 06:18:11',NULL,NULL,NULL,NULL,0),(2,'Finance',3,'2025-03-03 06:18:11',NULL,NULL,NULL,NULL,0),(3,'Healthcare',3,'2025-03-03 06:18:11',NULL,NULL,NULL,NULL,0),(4,'Education',3,'2025-03-03 06:18:11',NULL,NULL,NULL,NULL,0),(5,'Marketing',3,'2025-03-03 06:18:11',NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employer_profiles`
--

DROP TABLE IF EXISTS `employer_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employer_profiles` (
  `employer_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `company_address` varchar(255) NOT NULL,
  `company_contact` varchar(20) NOT NULL,
  `company_email` varchar(255) NOT NULL,
  `company_logo` varchar(255) DEFAULT NULL,
  `company_description` text,
  `industry_type` varchar(100) DEFAULT NULL,
  `established_date` varchar(10) DEFAULT NULL,
  `company_size` varchar(50) DEFAULT NULL,
  `company_website` varchar(255) DEFAULT NULL,
  `created_by` int NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT (now()),
  `updated_by` int DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` int DEFAULT NULL,
  `deleted_date` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`employer_id`),
  KEY `employer_profiles_user_id_users_user_id_fk` (`user_id`),
  CONSTRAINT `employer_profiles_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employer_profiles`
--

LOCK TABLES `employer_profiles` WRITE;
/*!40000 ALTER TABLE `employer_profiles` DISABLE KEYS */;
INSERT INTO `employer_profiles` VALUES (3,4,'TechCorp Inc.','789 Tech Street, Silicon Valley','555-TECH','hr@techcorp.com','techcorp_logo.png','Leading tech solutions provider.','Information Technology','2005-08-15','1000-5000','www.techcorp.com',2,'2025-03-08 08:46:52',4,'2025-03-08 03:06:51',NULL,NULL,0),(4,6,'Global Finance Ltd.','321 Finance Plaza, New York','555-FINANCE','info@globalfinance.com','globalfinance_logo.png','Global leaders in financial services.','Finance','1998-02-20','5000+','www.globalfinance.com',5,'2025-03-08 08:46:52',NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `employer_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_listings`
--

DROP TABLE IF EXISTS `job_listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_listings` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `employer_id` int NOT NULL,
  `category_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `job_type` enum('full-time','part-time','contract','internship','remote') NOT NULL,
  `level` varchar(50) NOT NULL,
  `vacancies` int NOT NULL,
  `employment_type` varchar(50) NOT NULL,
  `job_location` varchar(255) NOT NULL,
  `offered_salary` varchar(100) DEFAULT NULL,
  `deadline` timestamp NOT NULL,
  `education_level` varchar(100) DEFAULT NULL,
  `experience_required` varchar(100) DEFAULT NULL,
  `other_specification` text,
  `job_description` text NOT NULL,
  `responsibilities` text,
  `benefits` text,
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `view_count` int NOT NULL DEFAULT '0',
  `created_by` int NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT (now()),
  `updated_by` int DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` int DEFAULT NULL,
  `deleted_date` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`job_id`),
  KEY `job_listings_employer_id_employer_profiles_employer_id_fk` (`employer_id`),
  KEY `job_listings_category_id_categories_category_id_fk` (`category_id`),
  CONSTRAINT `job_listings_category_id_categories_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `job_listings_employer_id_employer_profiles_employer_id_fk` FOREIGN KEY (`employer_id`) REFERENCES `employer_profiles` (`employer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_listings`
--

LOCK TABLES `job_listings` WRITE;
/*!40000 ALTER TABLE `job_listings` DISABLE KEYS */;
INSERT INTO `job_listings` VALUES (4,3,1,'Senior Software Engineer','full-time','Mid-Senior Level',2,'Permanent','Remote','$120,000 - $150,000','2024-12-31 18:14:59','Bachelor\'s Degree in Computer Science','5+ years of relevant experience','Must be proficient in Agile methodologies.','We are looking for a Senior Software Engineer to join our dynamic team...','Develop high-quality software, participate in code reviews, mentor junior engineers...','Competitive salary, health benefits, paid time off, professional development opportunities.',1,1,150,2,'2025-03-08 09:29:16',NULL,NULL,NULL,NULL,0),(5,4,2,'Financial Analyst','full-time','Entry-Mid Level',3,'Permanent','New York, NY','$80,000 - $100,000','2024-11-15 18:14:59','Bachelor\'s Degree in Finance or Economics','2+ years of financial analysis experience','CFA certification is a plus.','We seek a detail-oriented Financial Analyst to support our investment strategies...','Analyze financial data, prepare reports, assist in budgeting and forecasting...','Comprehensive benefits package, bonus potential, relocation assistance.',0,1,80,5,'2025-03-08 09:29:16',NULL,NULL,NULL,NULL,0),(6,3,5,'Digital Marketing Specialist','contract','Mid Level',1,'Contract','Remote','$40 - $60 per hour','2024-12-20 18:14:59','Bachelor\'s Degree in Marketing or related field','3+ years of digital marketing experience','Experience with marketing automation tools preferred.','We are hiring a Digital Marketing Specialist to drive our online marketing campaigns...','Develop and execute digital marketing strategies, manage social media, analyze campaign performance...','Flexible hours, remote work, opportunity for contract extension.',1,1,200,2,'2025-03-08 09:29:16',NULL,NULL,NULL,NULL,0),(7,3,3,'Marketing Manager','full-time','Mid-Senior Level',1,'Permanent','San Francisco, CA','$90,000 - $110,000','2024-10-01 18:14:59','Bachelor\'s Degree in Marketing','5+ years in marketing and leadership roles','Experience with digital marketing strategies.','Lead our marketing team to create compelling campaigns...','Develop and execute marketing strategies, manage budgets, oversee campaigns...','Health insurance, retirement plans, flexible working hours.',0,1,120,3,'2025-03-08 09:29:34',NULL,NULL,NULL,NULL,0),(8,4,4,'Data Scientist','full-time','Senior Level',2,'Contract','Remote','$140,000 - $160,000','2024-09-14 18:15:00','Master\'s Degree in Data Science','7+ years of data analysis experience','Python and machine learning expertise required.','Seeking a Data Scientist to analyze complex datasets and provide insights...','Collect, analyze, and interpret large data sets, develop predictive models...','Flexible schedule, remote work, learning opportunities.',1,1,200,4,'2025-03-08 09:29:34',NULL,'2025-03-08 03:53:44',NULL,NULL,0),(9,3,1,'Frontend Developer','full-time','Mid Level',2,'Permanent','Remote','$100,000 - $120,000','2024-08-30 18:14:59','Bachelor\'s Degree in Computer Science','3+ years with React.js and JavaScript','Experience with Next.js is a plus.','Looking for a creative Frontend Developer to build dynamic UIs...','Design and implement user interfaces, collaborate with backend developers...','Health benefits, stock options, paid time off.',0,1,90,2,'2025-03-08 09:29:34',NULL,NULL,NULL,NULL,0),(10,4,2,'Accountant','full-time','Entry Level',1,'Permanent','Chicago, IL','$60,000 - $70,000','2024-11-01 18:14:59','Bachelor\'s Degree in Accounting','1-2 years of accounting experience','CPA certification preferred.','We need an Accountant to manage financial records and ensure compliance...','Prepare financial statements, manage budgets, conduct audits...','401(k) matching, health insurance, career development support.',0,1,75,5,'2025-03-08 09:29:34',NULL,NULL,NULL,NULL,0),(11,3,5,'Project Manager','contract','Mid Level',1,'Temporary','Austin, TX','$50/hour','2024-12-01 18:14:59','Bachelor\'s Degree in Management','4+ years of project management experience','PMP certification is a plus.','Project Manager needed for a 6-month contract to oversee software projects...','Coordinate teams, ensure deadlines are met, manage project scope...','Competitive hourly rate, project completion bonuses.',0,1,65,6,'2025-03-08 09:29:34',NULL,NULL,NULL,NULL,0),(12,4,3,'Content Writer','part-time','Entry Level',1,'Contract','Remote','$25/hour','2024-07-31 18:14:59','Bachelor\'s Degree in English or Journalism','Experience in copywriting or blogging','Strong grammar and research skills.','Looking for a Content Writer to create engaging blog posts and articles...','Write content for our website, optimize for SEO, collaborate with editors...','Work from home, flexible hours, creative freedom.',0,1,50,3,'2025-03-08 09:29:34',NULL,NULL,NULL,NULL,0),(13,3,4,'HR Specialist','full-time','Mid Level',1,'Permanent','Los Angeles, CA','$70,000 - $85,000','2024-10-15 18:14:59','Bachelor\'s Degree in Human Resources','3+ years in HR or recruitment','SHRM-CP certification is an advantage.','Seeking an HR Specialist to manage employee relations and recruitment...','Conduct interviews, onboard new employees, support HR initiatives...','Medical, dental, vision insurance, wellness programs.',0,1,100,4,'2025-03-08 09:29:34',NULL,NULL,NULL,NULL,0),(14,4,1,'Backend Developer','full-time','Senior Level',2,'Permanent','Remote','$130,000 - $150,000','2024-12-31 18:14:59','Bachelor\'s Degree in Computer Science','5+ years with Node.js and API development','Experience with Drizzle ORM and Fastify.','Backend Developer needed to build robust server-side applications...','Develop APIs, integrate with databases, ensure high performance...','Health benefits, professional growth opportunities, stock options.',1,1,85,2,'2025-03-08 09:29:34',NULL,NULL,NULL,NULL,0),(15,3,2,'Business Analyst','full-time','Mid Level',1,'Permanent','Boston, MA','$90,000 - $100,000','2024-09-01 18:14:59','Bachelor\'s Degree in Business Administration','3+ years of experience in business analysis','Strong analytical and problem-solving skills.','We are looking for a Business Analyst to drive strategic business decisions...','Analyze business processes, gather requirements, support project implementation...','Health and wellness programs, professional development.',0,1,70,5,'2025-03-08 09:29:34',NULL,NULL,NULL,NULL,0),(16,4,5,'UX Designer','part-time','Mid Level',1,'Contract','Remote','$50/hour','2024-08-15 18:14:59','Bachelor\'s Degree in Design or related field','3+ years of UX/UI design experience','Proficiency in Figma and Adobe XD.','Looking for a UX Designer to create user-friendly web and mobile interfaces...','Conduct user research, design wireframes, collaborate with developers...','Remote work, flexible schedule, creative projects.',0,1,60,6,'2025-03-08 09:29:34',NULL,NULL,NULL,NULL,0),(17,4,2,'Teste','part-time','2',2,'Permanent','Lalitpur','','2025-03-24 18:15:00','SLC','3','Test','Teste','Test','Test',0,1,0,4,'2025-03-08 03:48:31',4,'2025-03-08 03:48:31',NULL,NULL,0);
/*!40000 ALTER TABLE `job_listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobseeker_profiles`
--

DROP TABLE IF EXISTS `jobseeker_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobseeker_profiles` (
  `profile_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `headline` varchar(255) NOT NULL,
  `summary` text,
  `experience` varchar(2000) DEFAULT NULL,
  `education` varchar(2000) DEFAULT NULL,
  `skills` varchar(2000) DEFAULT NULL,
  `languages` varchar(500) DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` int NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT (now()),
  `updated_by` int DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` int DEFAULT NULL,
  `deleted_date` timestamp NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`profile_id`),
  KEY `jobseeker_profiles_user_id_users_user_id_fk` (`user_id`),
  CONSTRAINT `jobseeker_profiles_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobseeker_profiles`
--

LOCK TABLES `jobseeker_profiles` WRITE;
/*!40000 ALTER TABLE `jobseeker_profiles` DISABLE KEYS */;
INSERT INTO `jobseeker_profiles` VALUES (1,1,'Experienced Software Engineer','Highly motivated software engineer with 5+ years of experience in web development.','5+ years in web development, proficient in Java, Python, and JavaScript.','Master of Science in Computer Science','Java, Python, JavaScript, SQL, Git','English, Hindi',1,1,'2025-03-03 06:20:50',1,'2025-03-08 01:17:26',NULL,NULL,0),(2,4,'Marketing Professional','Results-driven marketing professional with a passion for digital marketing and brand strategy.','7+ years in marketing, expertise in SEO, SEM, and Social Media Marketing.','Bachelor of Business Administration in Marketing','SEO, SEM, Social Media Marketing, Content Strategy, Google Analytics','English, French',1,4,'2025-03-03 06:20:50',NULL,NULL,NULL,NULL,0);
/*!40000 ALTER TABLE `jobseeker_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `role` enum('jobseeker','employer','admin') NOT NULL,
  `salt` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'jobseeker1@gmail.com','61844e2312e1bfb28ecad0b53132df825de433cf90b54e5eb7985696104e9966d7b5445cfd709e7c41bcf75f2348beae5b8d3ab0141f576447dbec61857c7f0a','Job Seeker One','123-456-7890','123 Main St, Anytown','jobseeker','296290b136cdc595023a82bbded197a5411cd65ccb11afe27cdb2150c503e9cd'),(3,'jobseeker2@gmail.com','cc5b0af72286a8a448a8768b832d2c36b7bd254184ef78be390e36912595fd8bcc3a3cc1d9e97700724ddd913fff10193679878f14f41b35222ec12873d6d23e','Job Seeker One','123-456-7890','123 Main St, Anytown','jobseeker','0ffca20cb2c3a1c7b0eb9021b7da4a526cd773e1308c63c0a9dbfcac150b7a5e'),(4,'employer1@gmail.com','a0526bdda161783e893e1b60ebeceb3b5c2efbf2e9f0ea3fd334b1b86121595cc5a7b7b348e16cb31e18dd917af16a35ea74a8a47986969fc3ceeeba637e1938','Employer One','123-456-7890','123 Main St, Anytown','employer','75abbbb79093b9b3a9ab7743650e75f1674ce3c45c942806c9ce66683f16891d'),(6,'employer2@gmail.com','0f6379d21cc8a0908cc4346216dec5ecbdedfa1d8cb8cc60f95a17f64c58f7debb61440a7fe58bd5f60c6937e4e9ca05ff46950e2164e5de169730aea31bc494','EmployerTwo','123-456-7890','123 Main St, Anytown','employer','7ae753caa603fee44bcdc89d393ff79088fbd64c541b67f9e26a3aab611ba485'),(7,'admin1@gmail.com','6513c115bc909d87fe1919c7b5ee1fd1b1695b5a049d570a12593f611437d723e86e818fe9cd80f82c6b468551d0b4534f39456d3fdc6464ea91fb20db7d2fc3','Admin One','9800000000','123 Main St, Anytown','admin','de4931cc593ee0434741a57e7b1128c36c258e19fc3967686d9a058eedb70d93');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-08 23:28:38
