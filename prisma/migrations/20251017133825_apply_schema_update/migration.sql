/*
  Warnings:

  - You are about to drop the column `extension` on the `sunday_school_resources` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `sunday_school_resources` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `sunday_school_resources` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `sunday_school_resources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sunday_school_resources` DROP COLUMN `extension`,
    DROP COLUMN `fileType`,
    DROP COLUMN `filename`,
    DROP COLUMN `uuid`,
    ADD COLUMN `files` LONGTEXT NULL,
    MODIFY `content` LONGTEXT NULL;
