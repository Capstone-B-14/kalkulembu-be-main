/*
  Warnings:

  - Added the required column `measured_at` to the `Stats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stats" ADD COLUMN     "measured_at" TIMESTAMP(3) NOT NULL;
