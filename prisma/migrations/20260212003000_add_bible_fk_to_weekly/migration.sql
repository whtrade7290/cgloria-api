-- AlterTable
ALTER TABLE `weekly_bible_verse`
    ADD COLUMN `bible_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `weekly_bible_verse`
    ADD CONSTRAINT `weekly_bible_verse_bible_id_fkey` FOREIGN KEY (`bible_id`) REFERENCES `bible`(`idx`) ON DELETE SET NULL ON UPDATE CASCADE;
