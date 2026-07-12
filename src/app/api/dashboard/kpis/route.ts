import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VehicleStatus, TripStatus, DriverStatus } from '@prisma/client';

export async function GET() {
  try {
    const totalVehicles = await prisma.vehicle.count();
    
    const [
      activeVehicles,
      availableVehicles,
      maintenanceVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      allTrips,
      allVehicles
    ] = await Promise.all([
      prisma.vehicle.count({ where: { status: VehicleStatus.IN_USE } }),
      prisma.vehicle.count({ where: { status: VehicleStatus.AVAILABLE } }),
      prisma.vehicle.count({ where: { status: VehicleStatus.IN_SHOP } }),
      prisma.trip.count({ where: { status: { in: [TripStatus.DISPATCHED, TripStatus.IN_PROGRESS] } } }),
      prisma.trip.count({ where: { status: TripStatus.DRAFT } }),
      prisma.driver.count({ where: { status: DriverStatus.ON_TRIP } }),
      prisma.trip.findMany({ select: { createdAt: true } }),
      prisma.vehicle.findMany({ select: { make: true } })
    ]);

    const fleetUtilization = totalVehicles > 0 
      ? Number(((activeVehicles / totalVehicles) * 100).toFixed(1))
      : 0;

    // Process line data (Trips per day for the last 7 days)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const tripsByDay = new Map<string, number>();
    days.forEach(d => tripsByDay.set(d, 0));
    
    allTrips.forEach(trip => {
      const dayName = days[trip.createdAt.getDay()];
      tripsByDay.set(dayName, (tripsByDay.get(dayName) || 0) + 1);
    });
    
    const lineData = Array.from(tripsByDay.entries()).map(([name, trips]) => ({ name, trips }));
    // Shift array to make today the last element if needed, but simple order is fine for now.

    // Process bar data (Fleet composition by Make)
    const vehiclesByMake = new Map<string, number>();
    allVehicles.forEach(v => {
      vehiclesByMake.set(v.make, (vehiclesByMake.get(v.make) || 0) + 1);
    });
    const barData = Array.from(vehiclesByMake.entries()).map(([name, value]) => ({ name, value }));

    const data = {
      kpis: {
        activeVehicles: { value: activeVehicles, delta: "0%", positive: true },
        availableVehicles: { value: availableVehicles, delta: "0%", positive: true },
        maintenanceVehicles: { value: maintenanceVehicles, delta: "0%", positive: true },
        activeTrips: { value: activeTrips, delta: "0%", positive: true },
        pendingTrips: { value: pendingTrips, delta: "0%", positive: true },
        driversOnDuty: { value: driversOnDuty, delta: "0%", positive: true },
        fleetUtilization: { value: fleetUtilization, delta: "0%", positive: true },
      },
      lineData: lineData.length > 0 ? lineData : [{ name: "No Data", trips: 0 }],
      barData: barData.length > 0 ? barData : [{ name: "No Data", value: 0 }]
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to fetch KPIs", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
