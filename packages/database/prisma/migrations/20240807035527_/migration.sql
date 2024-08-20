/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `validated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `TokenBlackList` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `role`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `validated`;

-- DropTable
DROP TABLE `TokenBlackList`;
