ALTER TABLE `sermons` ADD COLUMN `content` TEXT;
UPDATE `sermons` SET `content` = `contents`;
ALTER TABLE `sermons` DROP COLUMN `contents`;