/*
  Warnings:

  - You are about to drop the `class_meeting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `columns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `general_forum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `photo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `school_photo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sermons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sunday_school_resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testimonies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weekly_bible_verses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `withDiary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `withDiaryRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `withDiary` DROP FOREIGN KEY `withDiary_diaryRoomId_fkey`;

-- DropForeignKey
ALTER TABLE `withDiaryRoom` DROP FOREIGN KEY `withDiaryRoom_userId_fkey`;

-- DropTable
DROP TABLE `class_meeting`;

-- DropTable
DROP TABLE `columns`;

-- DropTable
DROP TABLE `comments`;

-- DropTable
DROP TABLE `general_forum`;

-- DropTable
DROP TABLE `notice`;

-- DropTable
DROP TABLE `photo`;

-- DropTable
DROP TABLE `school_photo`;

-- DropTable
DROP TABLE `sermons`;

-- DropTable
DROP TABLE `sunday_school_resources`;

-- DropTable
DROP TABLE `testimonies`;

-- DropTable
DROP TABLE `weekly_bible_verses`;

-- DropTable
DROP TABLE `withDiary`;

-- DropTable
DROP TABLE `withDiaryRoom`;

-- CreateTable
CREATE TABLE `Sermon` (
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
CREATE TABLE `Column` (
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
CREATE TABLE `WeeklyBibleVerse` (
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
CREATE TABLE `ClassMeeting` (
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
CREATE TABLE `SundaySchoolResource` (
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
CREATE TABLE `GeneralForum` (
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
CREATE TABLE `Testimony` (
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
CREATE TABLE `Notice` (
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
CREATE TABLE `Diary` (
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

    INDEX `Diary_diaryRoomId_fkey`(`diaryRoomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiaryRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cohort` VARCHAR(191) NOT NULL,
    `creator` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserDiaryRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `diaryRoomId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserDiaryRoom_userId_diaryRoomId_key`(`userId`, `diaryRoomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Photo` (
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
CREATE TABLE `SchoolPhoto` (
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
CREATE TABLE `Comment` (
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
ALTER TABLE `Diary` ADD CONSTRAINT `Diary_diaryRoomId_fkey` FOREIGN KEY (`diaryRoomId`) REFERENCES `DiaryRoom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserDiaryRoom` ADD CONSTRAINT `UserDiaryRoom_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserDiaryRoom` ADD CONSTRAINT `UserDiaryRoom_diaryRoomId_fkey` FOREIGN KEY (`diaryRoomId`) REFERENCES `DiaryRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
