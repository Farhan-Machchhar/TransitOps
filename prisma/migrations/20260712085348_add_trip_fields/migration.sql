-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "licenseExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "requiredCargo" INTEGER;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "cargoCapacity" INTEGER NOT NULL DEFAULT 0;
