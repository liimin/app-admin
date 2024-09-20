/*
  Warnings:

  - A unique constraint covering the columns `[sn]` on the table `device` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `device_info` MODIFY `last_log_upload_time` TIMESTAMP(0) NULL,
    MODIFY `last_log_remove_time` TIMESTAMP(0) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `device_sn_key` ON `device`(`sn`);
