import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fuelSchema } from "@/lib/validations/fuel";

export async function GET(_req: NextRequest) {
  try {
    const logs = await prisma.fuelLog.findMany({
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
    const validatedData = fuelSchema.parse(body);

    const log = await prisma.fuelLog.create({
      data: validatedData,
    });

    return NextResponse.json({ data: log, error: null }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ data: null, error: error.message }, { status: 400 });
  }
}
