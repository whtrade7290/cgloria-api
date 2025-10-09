/*
  Warnings:

  - You are about to drop the column `deleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `deleted`,
    ADD COLUMN `isApproved` BOOLEAN NOT NULL DEFAULT false;
