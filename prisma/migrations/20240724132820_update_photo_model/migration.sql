-- AlterTable
ALTER TABLE `photo` ADD COLUMN `content` TEXT NULL,
    MODIFY `files` JSON NULL;

-- AlterTable
ALTER TABLE `school_photo` ADD COLUMN `content` TEXT NULL,
    MODIFY `files` JSON NULL;
