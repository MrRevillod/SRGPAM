/*
  Warnings:

  - You are about to alter the column `startsAt` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endsAt` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `startsAt` DATETIME NOT NULL,
    MODIFY `endsAt` DATETIME NOT NULL;
