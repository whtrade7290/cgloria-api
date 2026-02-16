/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDiaryRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `columns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `photoBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `schoolPhotoBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sermons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sunday_school_resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `testimonies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `weekly_bible_verses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `withDiary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `withDiaryRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserDiaryRoom` DROP FOREIGN KEY `UserDiaryRoom_diaryRoomId_fkey`;

-- DropForeignKey
ALTER TABLE `UserDiaryRoom` DROP FOREIGN KEY `UserDiaryRoom_userId_fkey`;

-- DropForeignKey
ALTER TABLE `withDiary` DROP FOREIGN KEY `withDiary_diaryRoomId_fkey`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `UserDiaryRoom`;

-- DropTable
DROP TABLE `columns`;

-- DropTable
DROP TABLE `photoBoard`;

-- DropTable
DROP TABLE `schoolPhotoBoard`;

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
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` ENUM('ADMIN', 'DIARY', 'USER', 'GUEST') NOT NULL DEFAULT 'USER',
    `name` VARCHAR(191) NULL,
    `isApproved` BOOLEAN NOT NULL DEFAULT false,
    `isChanged` BOOLEAN NOT NULL DEFAULT false,
    `email` VARCHAR(191) NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sermon` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NULL,
    `writer_name` VARCHAR(191) NULL,
    `files` LONGTEXT NULL,
    `mainContent` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `column` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NULL,
    `writer_name` VARCHAR(191) NULL,
    `files` LONGTEXT NULL,
    `mainContent` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weekly_bible_verse` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NULL,
    `writer_name` VARCHAR(191) NULL,
    `files` LONGTEXT NULL,
    `mainContent` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sunday_school_resource` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NULL,
    `writer_name` VARCHAR(191) NULL,
    `files` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimony` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `content` LONGTEXT NULL,
    `writer_name` VARCHAR(191) NULL,
    `files` LONGTEXT NULL,
    `mainContent` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `with_diary` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `writer` VARCHAR(191) NOT NULL,
    `files` LONGTEXT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `writer_name` VARCHAR(191) NULL,
    `diaryRoomId` INTEGER NULL,

    INDEX `withDiary_diaryRoomId_fkey`(`diaryRoomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `with_diary_room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creator` INTEGER NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `roomName` VARCHAR(191) NOT NULL DEFAULT '',
    `creator_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_diary_room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `diaryRoomId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserDiaryRoom_diaryRoomId_fkey`(`diaryRoomId`),
    UNIQUE INDEX `user_diary_room_userId_diaryRoomId_key`(`userId`, `diaryRoomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photo_board` (
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
CREATE TABLE `school_photo_board` (
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

-- AddForeignKey
ALTER TABLE `with_diary` ADD CONSTRAINT `with_diary_diaryRoomId_fkey` FOREIGN KEY (`diaryRoomId`) REFERENCES `with_diary_room`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_diary_room` ADD CONSTRAINT `user_diary_room_diaryRoomId_fkey` FOREIGN KEY (`diaryRoomId`) REFERENCES `with_diary_room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_diary_room` ADD CONSTRAINT `user_diary_room_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
