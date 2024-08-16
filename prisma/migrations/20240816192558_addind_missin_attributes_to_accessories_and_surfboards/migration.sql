/*
  Warnings:

  - Added the required column `registered` to the `Accessories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registered` to the `Surfboards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accessories" ADD COLUMN     "registered" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sold" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Surfboards" ADD COLUMN     "registered" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sold" TIMESTAMP(3);
