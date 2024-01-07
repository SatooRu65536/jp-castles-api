CREATE TABLE `areas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`pref_id` integer,
	FOREIGN KEY (`pref_id`) REFERENCES `prefs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `castle_aliases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`alias` text NOT NULL,
	`castle_id` integer,
	FOREIGN KEY (`castle_id`) REFERENCES `castles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `castle_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_id` integer,
	`castle_id` integer,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`castle_id`) REFERENCES `castles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `castle_coordinates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`latitude` text,
	`longitude` text,
	`castle_id` integer,
	FOREIGN KEY (`castle_id`) REFERENCES `castles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `castle_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text,
	`castle_id` integer,
	FOREIGN KEY (`castle_id`) REFERENCES `castles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `castle_lords` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`from` text,
	`to` text,
	`castle_id` integer,
	FOREIGN KEY (`castle_id`) REFERENCES `castles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `castle_nearest_stations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`line` text,
	`distance` real,
	`castle_id` integer,
	FOREIGN KEY (`castle_id`) REFERENCES `castles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `castle_places` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pref_id` integer,
	`area_id` integer,
	`city_id` integer,
	`address` text,
	`castle_id` integer,
	FOREIGN KEY (`pref_id`) REFERENCES `prefs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`castle_id`) REFERENCES `castles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `castle_remains` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`structure_id` integer,
	`castle_id` integer,
	FOREIGN KEY (`structure_id`) REFERENCES `structures`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`castle_id`) REFERENCES `castles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `castle_restorations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`structure_id` integer,
	`castle_id` integer,
	FOREIGN KEY (`structure_id`) REFERENCES `structures`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`castle_id`) REFERENCES `castles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `castle_tower_conditions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `castle_towers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`layer` integer,
	`floor` integer,
	`condition_id` integer,
	`castle_id` integer,
	FOREIGN KEY (`condition_id`) REFERENCES `castle_tower_conditions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`castle_id`) REFERENCES `castles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `castles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`desc` text,
	`history` text,
	`build_year` integer,
	`type_id` integer,
	`site` text,
	FOREIGN KEY (`type_id`) REFERENCES `types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category` text
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`pref_id` integer,
	`area_id` integer,
	FOREIGN KEY (`pref_id`) REFERENCES `prefs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `prefs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `structures` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`structure` text
);
--> statement-breakpoint
CREATE TABLE `types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text
);
