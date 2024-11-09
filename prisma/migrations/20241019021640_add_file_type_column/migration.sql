/*
  Warnings:

  - You are about to drop the column `fileDate` on the `class_meeting` table. All the data in the column will be lost.
  - You are about to drop the column `fileDate` on the `columns` table. All the data in the column will be lost.
  - You are about to drop the column `fileDate` on the `general_forum` table. All the data in the column will be lost.
  - You are about to drop the column `fileDate` on the `notice` table. All the data in the column will be lost.
  - You are about to drop the column `fileDate` on the `sermons` table. All the data in the column will be lost.
  - You are about to drop the column `fileDate` on the `sunday_school_resources` table. All the data in the column will be lost.
  - You are about to drop the column `fileDate` on the `testimonies` table. All the data in the column will be lost.
  - You are about to drop the column `fileDate` on the `weekly_bible_verses` table. All the data in the column will be lost.
  - You are about to drop the column `fileDate` on the `withDiary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `class_meeting` DROP COLUMN `fileDate`,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `columns` DROP COLUMN `fileDate`,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `general_forum` DROP COLUMN `fileDate`,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `notice` DROP COLUMN `fileDate`,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sermons` DROP COLUMN `fileDate`,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sunday_school_resources` DROP COLUMN `fileDate`,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `testimonies` DROP COLUMN `fileDate`,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `weekly_bible_verses` DROP COLUMN `fileDate`,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    ADD COLUMN `uuid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `withDiary` DROP COLUMN `fileDate`,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    ADD COLUMN `uuid` VARCHAR(191) NULL;
