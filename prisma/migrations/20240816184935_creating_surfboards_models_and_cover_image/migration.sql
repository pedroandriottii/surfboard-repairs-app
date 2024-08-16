/*
  Warnings:

  - The `image` column on the `Surfboards` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `coverImage` to the `Surfboards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Surfboards" ADD COLUMN     "coverImage" TEXT NOT NULL,
DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];
