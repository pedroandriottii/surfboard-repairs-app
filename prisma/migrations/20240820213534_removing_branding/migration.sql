/*
  Warnings:

  - You are about to drop the column `surfboardBrandingId` on the `Surfboards` table. All the data in the column will be lost.
  - You are about to drop the `Accessories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurfboardBranding` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Surfboards" DROP CONSTRAINT "Surfboards_surfboardBrandingId_fkey";

-- AlterTable
ALTER TABLE "Surfboards" DROP COLUMN "surfboardBrandingId",
ADD COLUMN     "model" TEXT,
ALTER COLUMN "volume" DROP NOT NULL,
ALTER COLUMN "size" DROP NOT NULL;

-- DropTable
DROP TABLE "Accessories";

-- DropTable
DROP TABLE "SurfboardBranding";
