/*
  Warnings:

  - You are about to drop the column `withDiary` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `withDiary`;

-- AlterTable
ALTER TABLE `withDiary` ADD COLUMN `diaryRoomId` INTEGER NULL;

-- CreateTable
CREATE TABLE `withDiaryRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `creator` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `withDiary` ADD CONSTRAINT `withDiary_diaryRoomId_fkey` FOREIGN KEY (`diaryRoomId`) REFERENCES `withDiaryRoom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `withDiaryRoom` ADD CONSTRAINT `withDiaryRoom_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
