-- AlterTable
ALTER TABLE `column`
    ADD COLUMN `language` ENUM('ko', 'ja') NOT NULL DEFAULT 'ko';

-- AlterTable
ALTER TABLE `class_meeting`
    ADD COLUMN `language` ENUM('ko', 'ja') NOT NULL DEFAULT 'ko';
