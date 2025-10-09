-- AlterTable
ALTER TABLE `class_meeting` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `columns` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `general_forum` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `notice` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `photo` MODIFY `content` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `school_photo` MODIFY `content` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `sermons` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `sunday_school_resources` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `testimonies` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `weekly_bible_verses` MODIFY `content` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `withDiary` MODIFY `content` LONGTEXT NOT NULL;
