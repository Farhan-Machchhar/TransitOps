import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTripSchema } from "@/lib/validations/trips";
import { TripStatus, VehicleStatus, DriverStatus } from "@prisma/client";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true },
    });
    if (!trip) {
      return NextResponse.json({ data: null, error: "Trip not found" }, { status: 404 });
    }
    return NextResponse.json({ data: trip, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateTripSchema.parse(body);

    const updatedTrip = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.update({
        where: { id },
        data: validatedData,
      });

      // Business Rule: Release vehicle and driver if trip is completed or cancelled
      if (trip.status === TripStatus.COMPLETED || trip.status === TripStatus.CANCELLED) {
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        });
        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: DriverStatus.AVAILABLE },
        });
      } else if (trip.status === TripStatus.DISPATCHED || trip.status === TripStatus.IN_PROGRESS) {
        // Just in case it transitions from DRAFT to DISPATCHED
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: VehicleStatus.IN_USE },
        });
        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: DriverStatus.ON_TRIP },
        });
      }

      return trip;
    });

    return NextResponse.json({ data: updatedTrip, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.trip.delete({
      where: { id },
    });
    return NextResponse.json({ data: { success: true }, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}
