-- AlterTable
ALTER TABLE `User` ALTER COLUMN `update_at` DROP DEFAULT,
    MODIFY `email` VARCHAR(191) NULL;
