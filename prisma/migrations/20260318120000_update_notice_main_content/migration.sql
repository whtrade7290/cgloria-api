-- Drop mainContent column from testimony
ALTER TABLE `testimony`
    DROP COLUMN `mainContent`;

-- Add mainContent column to notice
ALTER TABLE `notice`
    ADD COLUMN `mainContent` BOOLEAN NOT NULL DEFAULT false;
