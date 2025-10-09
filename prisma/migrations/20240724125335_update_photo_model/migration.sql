/*
  Warnings:

  - You are about to drop the column `extension` on the `photo` table. All the data in the column will be lost.
  - You are about to drop the column `fileDate` on the `photo` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `photo` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `school_photo` table. All the data in the column will be lost.
  - You are about to drop the column `fileDate` on the `school_photo` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `school_photo` table. All the data in the column will be lost.
  - Added the required column `files` to the `photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `files` to the `school_photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `photo` DROP COLUMN `extension`,
    DROP COLUMN `fileDate`,
    DROP COLUMN `filename`,
    ADD COLUMN `files` JSON NOT NULL;

-- AlterTable
ALTER TABLE `school_photo` DROP COLUMN `extension`,
    DROP COLUMN `fileDate`,
    DROP COLUMN `filename`,
    ADD COLUMN `files` JSON NOT NULL;
