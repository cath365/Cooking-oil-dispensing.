CREATE TABLE `sms_dispatches` (
	`owner` text NOT NULL,
	`voucher_id` text NOT NULL,
	`attempt_id` text NOT NULL,
	`last_attempt` text NOT NULL,
	`status` text NOT NULL,
	`recipient` text NOT NULL,
	`reference` text NOT NULL,
	PRIMARY KEY(`owner`, `voucher_id`)
);
