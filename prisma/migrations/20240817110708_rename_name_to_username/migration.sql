/*
  Warnings:

  - Made the column `files` on table `photo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `files` on table `school_photo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `class_meeting` ADD COLUMN `mainContent` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `columns` ADD COLUMN `mainContent` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `photo` MODIFY `files` JSON NOT NULL;

-- AlterTable
ALTER TABLE `school_photo` MODIFY `files` JSON NOT NULL;

-- AlterTable
ALTER TABLE `sermons` ADD COLUMN `mainContent` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `testimonies` ADD COLUMN `mainContent` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `weekly_bible_verses` ADD COLUMN `mainContent` BOOLEAN NOT NULL DEFAULT false;
