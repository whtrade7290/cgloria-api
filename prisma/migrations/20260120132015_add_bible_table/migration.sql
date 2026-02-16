/*
  Warnings:

  - You are about to drop the column `content_jp` on the `class_meeting` table. All the data in the column will be lost.
  - You are about to drop the column `title_jp` on the `class_meeting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `class_meeting` DROP COLUMN `content_jp`,
    DROP COLUMN `title_jp`;

-- CreateTable
CREATE TABLE `bible` (
    `idx` INTEGER NOT NULL AUTO_INCREMENT,
    `cate` INTEGER NOT NULL,
    `book` INTEGER NOT NULL,
    `chapter` INTEGER NOT NULL,
    `paragraph` INTEGER NOT NULL,
    `sentence` TINYTEXT NOT NULL,
    `testament` VARCHAR(10) NOT NULL,
    `long_label` VARCHAR(30) NOT NULL,
    `short_label` VARCHAR(10) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 0,
    `countOfChapter` INTEGER NOT NULL DEFAULT 0,

    INDEX `bible_book_idx`(`book`),
    PRIMARY KEY (`idx`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
