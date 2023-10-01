-- AlterTable
ALTER TABLE "Farms" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
