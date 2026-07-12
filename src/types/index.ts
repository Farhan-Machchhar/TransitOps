import { Prisma } from "@prisma/client";

export type VehicleWithRelations = Prisma.VehicleGetPayload<{
  include: {
    trips: true;
    maintenanceLogs: true;
    fuelLogs: true;
    expenses: true;
  };
}>;

export type DriverWithRelations = Prisma.DriverGetPayload<{
  include: {
    trips: true;
  };
}>;

export type TripWithRelations = Prisma.TripGetPayload<{
  include: {
    vehicle: true;
    driver: true;
  };
}>;

export * from "@prisma/client";
