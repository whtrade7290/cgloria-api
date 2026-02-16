-- AlterTable
ALTER TABLE `class_meeting` ADD COLUMN `mainContent` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `columns` ADD COLUMN `mainContent` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `sermons` ADD COLUMN `mainContent` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `testimonies` ADD COLUMN `mainContent` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `weekly_bible_verses` ADD COLUMN `mainContent` BOOLEAN NOT NULL DEFAULT false;
