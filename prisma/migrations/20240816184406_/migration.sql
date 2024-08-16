-- CreateTable
CREATE TABLE "SurfboardBranding" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SurfboardBranding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Surfboards" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "size" TEXT NOT NULL,
    "surfboardBrandingId" TEXT NOT NULL,

    CONSTRAINT "Surfboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accessories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Accessories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Surfboards" ADD CONSTRAINT "Surfboards_surfboardBrandingId_fkey" FOREIGN KEY ("surfboardBrandingId") REFERENCES "SurfboardBranding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
