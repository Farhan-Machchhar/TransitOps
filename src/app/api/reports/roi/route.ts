import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const completedTrips = await prisma.trip.count({
      where: {
        status: "COMPLETED",
      },
    });

    const fuel = await prisma.fuelLog.aggregate({
      _sum: {
        cost: true,
      },
    });

    const maintenance = await prisma.maintenanceLog.aggregate({
      _sum: {
        cost: true,
      },
    });

    const expenses = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
    });

    const operationalCost =
      (fuel._sum.cost ?? 0) +
      (maintenance._sum.cost ?? 0) +
      (expenses._sum.amount ?? 0);

    const roi =
      operationalCost === 0
        ? 0
        : Number(
            ((completedTrips / operationalCost) * 100).toFixed(2)
          );

    return NextResponse.json({
      success: true,
      data: {
        completedTrips,
        operationalCost,
        roi,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate ROI.",
      },
      { status: 500 }
    );
  }
}