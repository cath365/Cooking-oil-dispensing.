CREATE TABLE `voucher_codes` (
	`owner` text NOT NULL,
	`code` text NOT NULL,
	`voucher_id` text NOT NULL,
	PRIMARY KEY(`owner`, `code`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `voucher_codes_id` ON `voucher_codes` (`voucher_id`);