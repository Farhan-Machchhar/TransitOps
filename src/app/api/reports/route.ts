import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Counts
    const totalTrips = await prisma.trip.count();

    const completedTrips = await prisma.trip.count({
      where: {
        status: "COMPLETED",
      },
    });

    // Fuel
    const fuel = await prisma.fuelLog.aggregate({
      _sum: {
        cost: true,
      },
    });

    // Maintenance
    const maintenance = await prisma.maintenanceLog.aggregate({
      _sum: {
        cost: true,
      },
    });

    // Expenses
    const expenses = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
    });

    // Vehicles
    const totalVehicles = await prisma.vehicle.count();

    const activeVehicles = await prisma.vehicle.count({
      where: {
        status: "IN_USE",
      },
    });

    const utilization =
      totalVehicles === 0
        ? 0
        : Math.round((activeVehicles / totalVehicles) * 100);

    const operationalCost =
      (fuel._sum.cost ?? 0) +
      (maintenance._sum.cost ?? 0) +
      (expenses._sum.amount ?? 0);

    const recentTrips = await prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      data: {
        stats: {
          totalTrips,
          completedTrips,
          operationalCost,
          totalFuelCost: fuel._sum.cost ?? 0,
          totalMaintenanceCost: maintenance._sum.cost ?? 0,
          vehicleUtilization: utilization,
        },
        recentTrips,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load reports." },
      { status: 500 }
    );
  }
}