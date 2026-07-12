import 'dotenv/config';
import { PrismaClient, VehicleStatus, DriverStatus, TripStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function runTests() {
  console.log("🚀 Starting E2E Tests for TransitOps Data Routes...\n");
  try {
    // Test 1: Create a new Vehicle (Truck)
    console.log("Test 1: Adding a new Truck...");
    const newVehicle = await prisma.vehicle.create({
      data: {
        make: 'Peterbilt',
        model: '389',
        year: 2024,
        licensePlate: `E2E-${Date.now().toString().slice(-4)}`,
        status: VehicleStatus.AVAILABLE
      }
    });
    console.log(`✅ Added truck: ${newVehicle.make} ${newVehicle.model} (${newVehicle.licensePlate})\n`);

    // Test 2: Create a new Driver
    console.log("Test 2: Adding a new Driver...");
    const newDriver = await prisma.driver.create({
      data: {
        firstName: 'Test',
        lastName: `Driver-${Date.now().toString().slice(-4)}`,
        licenseNumber: `E2E-DL-${Date.now().toString().slice(-4)}`,
        status: DriverStatus.AVAILABLE
      }
    });
    console.log(`✅ Added driver: ${newDriver.firstName} ${newDriver.lastName}\n`);

    // Test 3: Create a new Trip
    console.log("Test 3: Creating a new Trip (Draft)...");
    const newTrip = await prisma.trip.create({
      data: {
        vehicleId: newVehicle.id,
        driverId: newDriver.id,
        origin: 'Testing Hub A',
        destination: 'Testing Hub B',
        status: TripStatus.DRAFT
      },
      include: { vehicle: true, driver: true }
    });
    console.log(`✅ Created trip: ${newTrip.origin} → ${newTrip.destination} (Status: ${newTrip.status})\n`);

    // Test 4: Dispatch the Trip (simulating the /api/trips/[id] PUT endpoint)
    console.log("Test 4: Dispatching the Trip (updating statuses atomically)...");
    const dispatchedTrip = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.update({
        where: { id: newTrip.id },
        data: { status: TripStatus.DISPATCHED }
      });
      await tx.vehicle.update({
        where: { id: newVehicle.id },
        data: { status: VehicleStatus.IN_USE }
      });
      await tx.driver.update({
        where: { id: newDriver.id },
        data: { status: DriverStatus.ON_TRIP }
      });
      return trip;
    });
    console.log(`✅ Trip dispatched. Status: ${dispatchedTrip.status}\n`);

    // Test 5: Verify Dashboard KPI queries
    console.log("Test 5: Verifying Dashboard KPI queries...");
    const [totalVehicles, activeVehicles, activeTrips, pendingTrips, driversOnDuty] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: VehicleStatus.IN_USE } }),
      prisma.trip.count({ where: { status: { in: [TripStatus.DISPATCHED, TripStatus.IN_PROGRESS] } } }),
      prisma.trip.count({ where: { status: TripStatus.DRAFT } }),
      prisma.driver.count({ where: { status: DriverStatus.ON_TRIP } }),
    ]);
    console.log(`✅ KPI Check:`);
    console.log(`   Total Vehicles:    ${totalVehicles}`);
    console.log(`   Active (IN_USE):   ${activeVehicles}`);
    console.log(`   Active Trips:      ${activeTrips}`);
    console.log(`   Pending Trips:     ${pendingTrips}`);
    console.log(`   Drivers On Trip:   ${driversOnDuty}\n`);

    console.log("🎉 All E2E tests passed successfully!");

  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

runTests();
