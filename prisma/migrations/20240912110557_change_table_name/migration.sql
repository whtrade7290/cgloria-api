/*
  Warnings:

  - You are about to drop the `ClassMeeting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Column` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Diary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiaryRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeneralForum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SchoolPhoto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sermon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SundaySchoolResource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Testimony` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeeklyBibleVerse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Diary` DROP FOREIGN KEY `Diary_diaryRoomId_fkey`;

-- DropForeignKey
ALTER TABLE `UserDiaryRoom` DROP FOREIGN KEY `UserDiaryRoom_diaryRoomId_fkey`;

-- DropTable
DROP TABLE `ClassMeeting`;

-- DropTable
DROP TABLE `Column`;

-- DropTable
DROP TABLE `Comment`;

-- DropTable
DROP TABLE `Diary`;

-- DropTable
DROP TABLE `DiaryRoom`;

-- DropTable
DROP TABLE `GeneralForum`;

-- DropTable
DROP TABLE `Notice`;

-- DropTable
DROP TABLE `Photo`;

-- DropTable
DROP TABLE `SchoolPhoto`;

-- DropTable
DROP TABLE `Sermon`;

-- DropTable
DROP TABLE `SundaySchoolResource`;

-- DropTable
DROP TABLE `Testimony`;

-- DropTable
DROP TABLE `WeeklyBibleVerse`;

-- CreateTable
CREATE TABLE `sermons` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NOT NULL,
    `extension` VARCHAR(191) NULL,
    `fileDate` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NULL,
    `mainContent` BOOLEAN NOT NULL DEFAULT false,
    `writer_name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `columns` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `extension` VARCHAR(191) NULL,
    `fileDate` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NULL,
    `content` LONGTEXT NOT NULL,
    `mainContent` BOOLEAN NOT NULL DEFAULT false,
    `writer_name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weekly_bible_verses` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `extension` VARCHAR(191) NULL,
    `fileDate` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NULL,
    `content` LONGTEXT NOT NULL,
    `mainContent` BOOLEAN NOT NULL DEFAULT false,
    `writer_name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_meeting` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NOT NULL,
    `extension` VARCHAR(191) NULL,
    `fileDate` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NULL,
    `mainContent` BOOLEAN NOT NULL DEFAULT false,
    `writer_name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sunday_school_resources` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NOT NULL,
    `extension` VARCHAR(191) NULL,
    `fileDate` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NULL,
    `writer_name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `general_forum` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NOT NULL,
    `extension` VARCHAR(191) NULL,
    `fileDate` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NULL,
    `writer_name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonies` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NOT NULL,
    `extension` VARCHAR(191) NULL,
    `fileDate` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NULL,
    `mainContent` BOOLEAN NOT NULL DEFAULT false,
    `writer_name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notice` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NOT NULL,
    `extension` VARCHAR(191) NULL,
    `fileDate` VARCHAR(191) NULL,
    `filename` VARCHAR(191) NULL,
    `writer_name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `withDiary` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NULL,
    `extension` VARCHAR(191) NULL,
    `fileDate` VARCHAR(191) NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `writer_name` VARCHAR(191) NULL,
    `diaryRoomId` INTEGER NULL,

    INDEX `withDiary_diaryRoomId_fkey`(`diaryRoomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `withDiaryRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cohort` VARCHAR(191) NOT NULL,
    `creator` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photo` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `files` LONGTEXT NULL,
    `content` LONGTEXT NULL,
    `writer_name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_photo` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `files` LONGTEXT NULL,
    `content` LONGTEXT NULL,
    `writer_name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `board_id` INTEGER NOT NULL,
    `board_name` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `writer_name` VARCHAR(191) NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `withDiary` ADD CONSTRAINT `withDiary_diaryRoomId_fkey` FOREIGN KEY (`diaryRoomId`) REFERENCES `withDiaryRoom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserDiaryRoom` ADD CONSTRAINT `UserDiaryRoom_diaryRoomId_fkey` FOREIGN KEY (`diaryRoomId`) REFERENCES `withDiaryRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
