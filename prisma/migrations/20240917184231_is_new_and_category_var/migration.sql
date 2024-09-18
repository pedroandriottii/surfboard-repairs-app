-- CreateEnum
CREATE TYPE "SurfboardsCategory" AS ENUM ('BANDIDA', 'CORINGA', 'MR', 'FISH_70', 'GOO_FISH', 'FISH_SUPER', 'MINI_FUN', 'MINI_LONG', 'LONG', 'KITE_SURF', 'KITE_FOIL');

-- AlterTable
ALTER TABLE "Surfboards" ADD COLUMN     "category" "SurfboardsCategory",
ADD COLUMN     "is_new" BOOLEAN NOT NULL DEFAULT false;
