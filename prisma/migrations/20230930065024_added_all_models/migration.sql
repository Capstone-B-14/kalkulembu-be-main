-- CreateTable
CREATE TABLE "Cows" (
    "id" SERIAL NOT NULL,
    "farm_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" SERIAL NOT NULL,
    "cow_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stats" (
    "id" SERIAL NOT NULL,
    "cow_id" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "healthy" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cows" ADD CONSTRAINT "Cows_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "Farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_cow_id_fkey" FOREIGN KEY ("cow_id") REFERENCES "Cows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_cow_id_fkey" FOREIGN KEY ("cow_id") REFERENCES "Cows"("id") ON DELETE CASCADE ON UPDATE CASCADE;
