import 'dotenv/config';
import { PrismaClient, Role, VehicleStatus, DriverStatus, TripStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
  console.log('✅ Created users');

  // 2. Create Vehicles (Dynamic sample data)
  const vehiclesData = [
    { make: 'Ford', model: 'Transit', type: 'Van', maxLoadCapacity: 1500, odometer: 12500, acquisitionCost: 45000, year: 2021, licensePlate: 'ABC-123', status: VehicleStatus.ON_TRIP },
    { make: 'Mercedes', model: 'Sprinter', type: 'Van', maxLoadCapacity: 2000, odometer: 8000, acquisitionCost: 55000, year: 2022, licensePlate: 'XYZ-987', status: VehicleStatus.AVAILABLE },
    { make: 'Ram', model: 'ProMaster', type: 'Van', maxLoadCapacity: 1800, odometer: 32000, acquisitionCost: 40000, year: 2020, licensePlate: 'LMN-456', status: VehicleStatus.AVAILABLE },
    { make: 'Chevrolet', model: 'Express', type: 'Van', maxLoadCapacity: 1700, odometer: 45000, acquisitionCost: 38000, year: 2019, licensePlate: 'DEF-456', status: VehicleStatus.IN_SHOP },
    { make: 'GMC', model: 'Savana', type: 'Van', maxLoadCapacity: 1600, odometer: 120000, acquisitionCost: 25000, year: 2015, licensePlate: 'OLD-999', status: VehicleStatus.RETIRED },
    { make: 'Volvo', model: 'VNL', type: 'Truck', maxLoadCapacity: 18000, odometer: 5000, acquisitionCost: 150000, year: 2023, licensePlate: 'TRK-001', status: VehicleStatus.AVAILABLE },
    { make: 'Freightliner', model: 'Cascadia', type: 'Truck', maxLoadCapacity: 20000, odometer: 12000, acquisitionCost: 165000, year: 2023, licensePlate: 'TRK-002', status: VehicleStatus.ON_TRIP },
  ];

  const vehicles = [];
  for (const v of vehiclesData) {
    const vehicle = await prisma.vehicle.upsert({
      where: { licensePlate: v.licensePlate },
      update: { status: v.status },
      create: v,
    });
    vehicles.push(vehicle);
  }
  console.log('✅ Created vehicles');

  // 3. Create Drivers (Dynamic sample data)
  const today = new Date();
  const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
  const driversData = [
    { firstName: 'John', lastName: 'Doe', licenseNumber: 'DL-1001', licenseCategory: 'Standard', licenseExpiryDate: nextYear, contactNumber: '555-0101', safetyScore: 98, status: DriverStatus.ON_TRIP },
    { firstName: 'Jane', lastName: 'Smith', licenseNumber: 'DL-1002', licenseCategory: 'Commercial', licenseExpiryDate: nextYear, contactNumber: '555-0102', safetyScore: 100, status: DriverStatus.AVAILABLE },
    { firstName: 'Mike', lastName: 'Johnson', licenseNumber: 'DL-1003', licenseCategory: 'Commercial', licenseExpiryDate: nextYear, contactNumber: '555-0103', safetyScore: 92, status: DriverStatus.AVAILABLE },
    { firstName: 'Sarah', lastName: 'Williams', licenseNumber: 'DL-1004', licenseCategory: 'Standard', licenseExpiryDate: nextYear, contactNumber: '555-0104', safetyScore: 45, status: DriverStatus.SUSPENDED },
    { firstName: 'Tom', lastName: 'Brown', licenseNumber: 'DL-1005', licenseCategory: 'Standard', licenseExpiryDate: new Date('2020-01-01'), contactNumber: '555-0105', safetyScore: 88, status: DriverStatus.OFF_DUTY },
    { firstName: 'Alice', lastName: 'Cooper', licenseNumber: 'DL-1006', licenseCategory: 'Commercial', licenseExpiryDate: nextYear, contactNumber: '555-0106', safetyScore: 95, status: DriverStatus.AVAILABLE },
    { firstName: 'Bob', lastName: 'Marley', licenseNumber: 'DL-1007', licenseCategory: 'Commercial', licenseExpiryDate: nextYear, contactNumber: '555-0107', safetyScore: 99, status: DriverStatus.ON_TRIP },
  ];

  const drivers = [];
  for (const d of driversData) {
    const driver = await prisma.driver.upsert({
      where: { licenseNumber: d.licenseNumber },
      update: { status: d.status },
      create: d,
    });
    drivers.push(driver);
  }
  console.log('✅ Created drivers');

  // 4. Create Trips (Dynamic sample data)
  const tripsData = [
    {
      vehicleId: vehicles.find(v => v.licensePlate === 'ABC-123')!.id,
      driverId: drivers.find(d => d.licenseNumber === 'DL-1001')!.id,
      status: TripStatus.IN_PROGRESS,
      origin: 'Warehouse A',
      destination: 'Store #104',
      cargoWeight: 1200,
      plannedDistance: 45.5,
    },
    {
      vehicleId: vehicles.find(v => v.licensePlate === 'XYZ-987')!.id,
      driverId: drivers.find(d => d.licenseNumber === 'DL-1002')!.id,
      status: TripStatus.DRAFT,
      origin: 'Warehouse B',
      destination: 'Client Site 7',
      cargoWeight: 500,
      plannedDistance: 12.0,
    },
    {
      vehicleId: vehicles.find(v => v.licensePlate === 'TRK-002')!.id,
      driverId: drivers.find(d => d.licenseNumber === 'DL-1007')!.id,
      status: TripStatus.DISPATCHED,
      origin: 'Port Terminal',
      destination: 'Distribution Center',
      cargoWeight: 15000,
      plannedDistance: 120.5,
    }
  ];

  for (const t of tripsData) {
    const existing = await prisma.trip.findFirst({
      where: { driverId: t.driverId, origin: t.origin, destination: t.destination }
    });
    if (!existing) {
      await prisma.trip.create({ data: t });
    }
  }

  console.log('✅ Created trips');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
