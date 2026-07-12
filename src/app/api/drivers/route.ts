import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { driverSchema } from "@/lib/validations/drivers";
import { DriverStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");

    let whereClause = {};
    if (status && Object.values(DriverStatus).includes(status as DriverStatus)) {
      whereClause = { status: status as DriverStatus };
    }

    const drivers = await prisma.driver.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: drivers, error: null });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = driverSchema.parse(body);

    const driver = await prisma.driver.create({
      data: validatedData,
    });

    return NextResponse.json({ data: driver, error: null }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 400 });
  }
}
