import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tripSchema } from "@/lib/validations/trips";
import { TripStatus, VehicleStatus, DriverStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");

    let whereClause = {};
    if (status && Object.values(TripStatus).includes(status as TripStatus)) {
      whereClause = { status: status as TripStatus };
    }

    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: { vehicle: true, driver: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: trips, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = tripSchema.parse(body);

    const trip = await prisma.$transaction(async (tx) => {
      // Fetch vehicle and driver to validate constraints
      const vehicle = await tx.vehicle.findUnique({ where: { id: validatedData.vehicleId } });
      const driver = await tx.driver.findUnique({ where: { id: validatedData.driverId } });

      if (!vehicle) throw new Error("Vehicle not found");
      if (!driver) throw new Error("Driver not found");

      // Business Rule: Retired/In Shop/On Trip vehicles cannot be dispatched
      if (vehicle.status !== VehicleStatus.AVAILABLE) {
        throw new Error("Selected vehicle is not available");
      }

      // Business Rule: Expired/Suspended/On Trip drivers cannot be dispatched
      if (driver.status !== DriverStatus.AVAILABLE) {
        throw new Error("Selected driver is not available");
      }

      // Business Rule: Cargo Weight must not exceed max load capacity
      if (validatedData.cargoWeight > vehicle.maxLoadCapacity) {
        throw new Error(`Cargo weight (${validatedData.cargoWeight}kg) exceeds vehicle max capacity (${vehicle.maxLoadCapacity}kg)`);
      }

      const createdTrip = await tx.trip.create({
        data: validatedData,
      });

      // Business Rule: If dispatched immediately, update vehicle and driver statuses
      if (createdTrip.status === TripStatus.DISPATCHED || createdTrip.status === TripStatus.IN_PROGRESS) {
        await tx.vehicle.update({
          where: { id: createdTrip.vehicleId },
          data: { status: VehicleStatus.ON_TRIP },
        });
        await tx.driver.update({
          where: { id: createdTrip.driverId },
          data: { status: DriverStatus.ON_TRIP },
        });
      }

      return createdTrip;
    });

    return NextResponse.json({ data: trip, error: null }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 400 });
  }
}
