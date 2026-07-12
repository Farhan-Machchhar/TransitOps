import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalVehicles = await prisma.vehicle.count();

    const inUseVehicles = await prisma.vehicle.count({
      where: {
        status: "IN_USE",
      },
    });

    const availableVehicles = await prisma.vehicle.count({
      where: {
        status: "AVAILABLE",
      },
    });

    const inShopVehicles = await prisma.vehicle.count({
      where: {
        status: "IN_SHOP",
      },
    });

    const retiredVehicles = await prisma.vehicle.count({
      where: {
        status: "RETIRED",
      },
    });

    const utilization =
      totalVehicles === 0
        ? 0
        : Number(((inUseVehicles / totalVehicles) * 100).toFixed(2));

    return NextResponse.json({
      success: true,
      data: {
        totalVehicles,
        inUseVehicles,
        availableVehicles,
        inShopVehicles,
        retiredVehicles,
        utilization,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate utilization.",
      },
      { status: 500 }
    );
  }
}