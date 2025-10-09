/*
  Warnings:

  - Added the required column `content` to the `class_meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `general_forum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `notice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `sunday_school_resources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `testimonies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `weekly_bible_verses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `class_meeting` ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `extension` VARCHAR(191) NULL,
    ADD COLUMN `fileDate` VARCHAR(191) NULL,
    ADD COLUMN `filename` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `columns` MODIFY `extension` VARCHAR(191) NULL,
    MODIFY `fileDate` VARCHAR(191) NULL,
    MODIFY `filename` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `general_forum` ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `extension` VARCHAR(191) NULL,
    ADD COLUMN `fileDate` VARCHAR(191) NULL,
    ADD COLUMN `filename` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `notice` ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `extension` VARCHAR(191) NULL,
    ADD COLUMN `fileDate` VARCHAR(191) NULL,
    ADD COLUMN `filename` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sunday_school_resources` ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `extension` VARCHAR(191) NULL,
    ADD COLUMN `fileDate` VARCHAR(191) NULL,
    ADD COLUMN `filename` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `testimonies` ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `extension` VARCHAR(191) NULL,
    ADD COLUMN `fileDate` VARCHAR(191) NULL,
    ADD COLUMN `filename` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `weekly_bible_verses` ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `extension` VARCHAR(191) NULL,
    ADD COLUMN `fileDate` VARCHAR(191) NULL,
    ADD COLUMN `filename` VARCHAR(191) NULL;
