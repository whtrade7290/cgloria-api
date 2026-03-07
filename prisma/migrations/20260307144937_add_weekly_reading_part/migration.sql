-- AlterTable
ALTER TABLE `weekly_bible_verse`
    ADD COLUMN `readingPart` ENUM('all', 'upper', 'lower') NOT NULL DEFAULT 'all';
