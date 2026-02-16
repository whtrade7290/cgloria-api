/*
  Warnings:

  - You are about to drop the column `extension` on the `class_meeting` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `class_meeting` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `class_meeting` table. All the data in the column will be lost.
  - You are about to drop the column `mainContent` on the `class_meeting` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `class_meeting` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `columns` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `columns` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `columns` table. All the data in the column will be lost.
  - You are about to drop the column `mainContent` on the `columns` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `columns` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `general_forum` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `general_forum` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `general_forum` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `general_forum` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `notice` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `notice` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `notice` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `notice` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `sermons` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `sermons` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `sermons` table. All the data in the column will be lost.
  - You are about to drop the column `mainContent` on the `sermons` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `sermons` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `testimonies` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `testimonies` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `testimonies` table. All the data in the column will be lost.
  - You are about to drop the column `mainContent` on the `testimonies` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `testimonies` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `weekly_bible_verses` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `weekly_bible_verses` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `weekly_bible_verses` table. All the data in the column will be lost.
  - You are about to drop the column `mainContent` on the `weekly_bible_verses` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `weekly_bible_verses` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `withDiary` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `withDiary` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `withDiary` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `withDiary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `class_meeting` DROP COLUMN `extension`,
    DROP COLUMN `fileType`,
    DROP COLUMN `filename`,
    DROP COLUMN `mainContent`,
    DROP COLUMN `uuid`,
    ADD COLUMN `files` LONGTEXT NULL,
    MODIFY `content` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `columns` DROP COLUMN `extension`,
    DROP COLUMN `fileType`,
    DROP COLUMN `filename`,
    DROP COLUMN `mainContent`,
    DROP COLUMN `uuid`,
    ADD COLUMN `files` LONGTEXT NULL,
    MODIFY `content` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `general_forum` DROP COLUMN `extension`,
    DROP COLUMN `fileType`,
    DROP COLUMN `filename`,
    DROP COLUMN `uuid`,
    ADD COLUMN `files` LONGTEXT NULL,
    MODIFY `content` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `notice` DROP COLUMN `extension`,
    DROP COLUMN `fileType`,
    DROP COLUMN `filename`,
    DROP COLUMN `uuid`,
    ADD COLUMN `files` LONGTEXT NULL,
    MODIFY `content` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `sermons` DROP COLUMN `extension`,
    DROP COLUMN `fileType`,
    DROP COLUMN `filename`,
    DROP COLUMN `mainContent`,
    DROP COLUMN `uuid`,
    ADD COLUMN `files` LONGTEXT NULL,
    MODIFY `content` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `testimonies` DROP COLUMN `extension`,
    DROP COLUMN `fileType`,
    DROP COLUMN `filename`,
    DROP COLUMN `mainContent`,
    DROP COLUMN `uuid`,
    ADD COLUMN `files` LONGTEXT NULL,
    MODIFY `content` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `weekly_bible_verses` DROP COLUMN `extension`,
    DROP COLUMN `fileType`,
    DROP COLUMN `filename`,
    DROP COLUMN `mainContent`,
    DROP COLUMN `uuid`,
    ADD COLUMN `files` LONGTEXT NULL,
    MODIFY `content` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `withDiary` DROP COLUMN `extension`,
    DROP COLUMN `fileType`,
    DROP COLUMN `filename`,
    DROP COLUMN `uuid`,
    ADD COLUMN `files` LONGTEXT NULL;
