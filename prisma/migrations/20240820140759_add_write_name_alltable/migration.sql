-- AlterTable
ALTER TABLE `class_meeting` ADD COLUMN `writer_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `columns` ADD COLUMN `writer_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `general_forum` ADD COLUMN `writer_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `notice` ADD COLUMN `writer_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `photo` ADD COLUMN `writer_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `school_photo` ADD COLUMN `writer_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sunday_school_resources` ADD COLUMN `writer_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `testimonies` ADD COLUMN `writer_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `weekly_bible_verses` ADD COLUMN `writer_name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `withDiary` ADD COLUMN `writer_name` VARCHAR(191) NULL;
