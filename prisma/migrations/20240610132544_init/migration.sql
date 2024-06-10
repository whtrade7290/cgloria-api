/*
  Warnings:

  - You are about to drop the column `role` on the `Sermon` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Sermon` DROP COLUMN `role`,
    ADD COLUMN `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `role` ENUM('ADMIN', 'DIARY', 'USER', 'GUEST') NOT NULL DEFAULT 'USER',
    MODIFY `deleted` BOOLEAN NOT NULL DEFAULT false;
