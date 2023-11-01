/*
  Warnings:

  - You are about to drop the column `cow_id` on the `Images` table. All the data in the column will be lost.
  - You are about to drop the column `cow_id` on the `Stats` table. All the data in the column will be lost.
  - You are about to drop the `Cows` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cattle_id` to the `Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cattle_id` to the `Stats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cows" DROP CONSTRAINT "Cows_farm_id_fkey";

-- DropForeignKey
ALTER TABLE "Images" DROP CONSTRAINT "Images_cow_id_fkey";

-- DropForeignKey
ALTER TABLE "Stats" DROP CONSTRAINT "Stats_cow_id_fkey";

-- AlterTable
ALTER TABLE "Images" DROP COLUMN "cow_id",
ADD COLUMN     "cattle_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Stats" DROP COLUMN "cow_id",
ADD COLUMN     "cattle_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Cows";

-- CreateTable
CREATE TABLE "Cattle" (
    "id" SERIAL NOT NULL,
    "farm_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sex" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cattle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cattle" ADD CONSTRAINT "Cattle_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_cattle_id_fkey" FOREIGN KEY ("cattle_id") REFERENCES "Cattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_cattle_id_fkey" FOREIGN KEY ("cattle_id") REFERENCES "Cattle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
