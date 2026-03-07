-- DropForeignKey
ALTER TABLE `weekly_bible_verse`
    DROP FOREIGN KEY `weekly_bible_verse_bible_id_fkey`;

-- DropIndex
ALTER TABLE `weekly_bible_verse`
    DROP INDEX `weekly_bible_verse_bible_id_fkey`;

-- AlterTable
ALTER TABLE `weekly_bible_verse`
    DROP COLUMN `bible_id`,
    ADD COLUMN `longLabel` VARCHAR(191) NULL,
    ADD COLUMN `chapter` INTEGER NULL,
    ADD COLUMN `paragraph` INTEGER NULL,
    ADD COLUMN `sentence` LONGTEXT NULL;
