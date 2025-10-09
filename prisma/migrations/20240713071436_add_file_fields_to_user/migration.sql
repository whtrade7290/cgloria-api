/*
  Warnings:

  - Added the required column `content` to the `columns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `columns` ADD COLUMN `content` TEXT NOT NULL;
