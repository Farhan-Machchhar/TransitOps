import { prisma } from "@/lib/prisma";
import { Role, VehicleStatus, DriverStatus, TripStatus } from "@prisma/client";
import bcrypt from 'bcrypt';

async function main() {
  console.log('Starting seed...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const roles: Role[] = ['ADMIN', 'DISPATCHER', 'MAINTENANCE', 'FINANCE'];
  for (const role of roles) {
    await prisma.user.upsert({
      where: { email: `${role.toLowerCase()}@transitops.dev` },
      update: {},
      create: {
        email: `${role.toLowerCase()}@transitops.dev`,
        password: hashedPassword,
        role: role,
      },
    });
  }
  console.log('Created users');

  // 2. Create Vehicles
  const vehiclesData = [
    { make: 'Ford', model: 'Transit', year: 2021, licensePlate: 'ABC-123', status: VehicleStatus.AVAILABLE },
    { make: 'Mercedes', model: 'Sprinter', year: 2022, licensePlate: 'XYZ-987', status: VehicleStatus.AVAILABLE },
    { make: 'Ram', model: 'ProMaster', year: 2020, licensePlate: 'LMN-456', status: VehicleStatus.AVAILABLE },
    { make: 'Chevrolet', model: 'Express', year: 2019, licensePlate: 'DEF-456', status: VehicleStatus.IN_SHOP },
    { make: 'GMC', model: 'Savana', year: 2015, licensePlate: 'OLD-999', status: VehicleStatus.RETIRED },
  ];

  const vehicles = [];
  for (const v of vehiclesData) {
    const vehicle = await prisma.vehicle.upsert({
      where: { licensePlate: v.licensePlate },
      update: {},
      create: v,
    });
    vehicles.push(vehicle);
  }
  console.log('Created vehicles');

  // 3. Create Drivers
  const driversData = [
    { firstName: 'John', lastName: 'Doe', licenseNumber: 'DL-1001', status: DriverStatus.AVAILABLE },
    { firstName: 'Jane', lastName: 'Smith', licenseNumber: 'DL-1002', status: DriverStatus.AVAILABLE },
    { firstName: 'Mike', lastName: 'Johnson', licenseNumber: 'DL-1003', status: DriverStatus.AVAILABLE },
    { firstName: 'Sarah', lastName: 'Williams', licenseNumber: 'DL-1004', status: DriverStatus.SUSPENDED },
    { firstName: 'Tom', lastName: 'Brown', licenseNumber: 'DL-1005', status: DriverStatus.EXPIRED_LICENSE },
  ];

  const drivers = [];
  for (const d of driversData) {
    const driver = await prisma.driver.upsert({
      where: { licenseNumber: d.licenseNumber },
      update: {},
      create: d,
    });
    drivers.push(driver);
  }
  console.log('Created drivers');

  // 4. Create Trips
  await prisma.trip.create({
    data: {
      vehicleId: vehicles[0].id,
      driverId: drivers[0].id,
      status: TripStatus.DRAFT,
      origin: 'Warehouse A',
      destination: 'Store #104',
    }
  });

  await prisma.trip.create({
    data: {
      vehicleId: vehicles[1].id,
      driverId: drivers[1].id,
      status: TripStatus.DRAFT,
      origin: 'Warehouse B',
      destination: 'Client Site 7',
    }
  });
  console.log('Created trips');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
