/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "isAdmin",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
