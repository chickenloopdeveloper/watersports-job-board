CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`jobSeekerId` int NOT NULL,
	`resumeId` int NOT NULL,
	`coverLetter` text,
	`status` enum('submitted','reviewed','shortlisted','rejected','accepted') NOT NULL DEFAULT 'submitted',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recruiterId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`website` varchar(500),
	`logoUrl` varchar(1000),
	`bannerUrl` varchar(1000),
	`location` varchar(255),
	`industry` varchar(100),
	`companySize` varchar(50),
	`isPremium` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`recruiterId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`location` varchar(255),
	`jobType` enum('full_time','part_time','contract','seasonal','internship') NOT NULL,
	`experienceLevel` enum('entry','intermediate','senior','expert'),
	`salaryMin` int,
	`salaryMax` int,
	`salaryCurrency` varchar(10) DEFAULT 'USD',
	`skills` text,
	`status` enum('draft','pending_approval','active','inactive','rejected') NOT NULL DEFAULT 'pending_approval',
	`isFeatured` boolean NOT NULL DEFAULT false,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`headline` varchar(255),
	`summary` text,
	`experience` text,
	`education` text,
	`skills` text,
	`certifications` text,
	`location` varchar(255),
	`phoneNumber` varchar(50),
	`linkedinUrl` varchar(500),
	`portfolioUrl` varchar(500),
	`photoUrl` varchar(1000),
	`visibility` enum('public','private','recruiters_only') NOT NULL DEFAULT 'public',
	`status` enum('draft','pending_approval','active','rejected') NOT NULL DEFAULT 'pending_approval',
	`isPremium` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resumes_id` PRIMARY KEY(`id`),
	CONSTRAINT `resumes_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `savedCandidates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recruiterId` int NOT NULL,
	`candidateId` int NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savedCandidates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savedJobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`jobId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savedJobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savedSearches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`searchParams` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savedSearches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('job_seeker','recruiter','admin') NOT NULL DEFAULT 'job_seeker';