import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { maintenanceSchema } from "@/lib/validations/maintenance";
import { VehicleStatus } from "@prisma/client";

export async function GET(_req: NextRequest) {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: logs, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = maintenanceSchema.parse(body);

    const log = await prisma.$transaction(async (tx) => {
      const createdLog = await tx.maintenanceLog.create({
        data: validatedData,
      });

      // Business Rule: Vehicle goes to IN_SHOP when maintenance is logged
      await tx.vehicle.update({
        where: { id: createdLog.vehicleId },
        data: { status: VehicleStatus.IN_SHOP },
      });

      return createdLog;
    });

    return NextResponse.json({ data: log, error: null }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 400 });
  }
}
