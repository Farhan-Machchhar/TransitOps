import { PrismaClient, VehicleStatus, DriverStatus, TripStatus } from '@prisma/client';
import { prisma } from './prisma';

export class TripService {
  // ---------- Creation ----------
  static async createTrip(data: {
    source: string;
    destination: string;
    cargoWeight: number;
    plannedDistance?: number;
    vehicleId: string;
    driverId: string;
  }) {
    const { source, destination, cargoWeight, vehicleId, driverId, plannedDistance } = data;
    const [vehicle, driver] = await Promise.all([
      prisma.vehicle.findUnique({ where: { id: vehicleId } }),
      prisma.driver.findUnique({ where: { id: driverId } }),
    ]);
    if (!vehicle) throw new Error('Vehicle not found');
    if (!driver) throw new Error('Driver not found');

    // status checks (available only)
    if (vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new Error('Vehicle must be AVAILABLE');
    }
    if (driver.status !== DriverStatus.AVAILABLE) {
      throw new Error('Driver must be AVAILABLE');
    }

    // cargo capacity validation
    if (vehicle.cargoCapacity < cargoWeight) {
      throw new Error('Vehicle cargo capacity insufficient for required cargo weight');
    }

    // create draft trip
    return prisma.trip.create({
      data: {
        origin: source,
        destination,
        requiredCargo: cargoWeight,
        vehicleId,
        driverId,
        status: TripStatus.DRAFT,
        // plannedDistance could be stored in a separate field later; ignored for now
      },
    });
  }

  // ---------- Dispatch ----------
  static async dispatchTrip(tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true, driver: true },
    });
    if (!trip) throw new Error('Trip not found');
    if (trip.status !== TripStatus.DRAFT) {
      throw new Error('Only DRAFT trips can be dispatched');
    }
    // license expiry validation (driver)
    const driver = trip.driver;
    if (driver.licenseExpiry && driver.licenseExpiry <= new Date()) {
      throw new Error('Driver license has expired');
    }
    // safety check: driver status must be AVAILABLE
    if (driver.status !== DriverStatus.AVAILABLE) {
      throw new Error('Driver is not available for dispatch');
    }
    // vehicle already validated on creation, but double‑check status
    const vehicle = trip.vehicle;
    if (vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new Error('Vehicle is not available for dispatch');
    }

    await prisma.$transaction([
      prisma.trip.update({
        where: { id: tripId },
        data: { status: TripStatus.DISPATCHED, startTime: new Date() },
      }),
      prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { status: VehicleStatus.ON_TRIP },
      }),
      prisma.driver.update({
        where: { id: driver.id },
        data: { status: DriverStatus.ON_TRIP },
      }),
    ]);
    return true;
  }

  // ---------- Complete ----------
  static async completeTrip(tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true, driver: true },
    });
    if (!trip) throw new Error('Trip not found');
    if (trip.status !== TripStatus.DISPATCHED) {
      throw new Error('Only DISPATCHED trips can be completed');
    }

    await prisma.$transaction([
      prisma.trip.update({
        where: { id: tripId },
        data: { status: TripStatus.COMPLETED, endTime: new Date() },
      }),
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.AVAILABLE },
      }),
      prisma.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.AVAILABLE },
      }),
    ]);
    return true;
  }

  // ---------- Cancel ----------
  static async cancelTrip(tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true, driver: true },
    });
    if (!trip) throw new Error('Trip not found');
    if (trip.status !== TripStatus.DISPATCHED) {
      throw new Error('Only DISPATCHED trips can be cancelled');
    }

    await prisma.$transaction([
      prisma.trip.update({
        where: { id: tripId },
        data: { status: TripStatus.CANCELLED, endTime: new Date() },
      }),
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.AVAILABLE },
      }),
      prisma.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.AVAILABLE },
      }),
    ]);
    return true;
  }

  // ---------- Helper: available resources ----------
  static async getAvailableResources() {
    const [vehicles, drivers] = await Promise.all([
      prisma.vehicle.findMany({ where: { status: VehicleStatus.AVAILABLE } }),
      prisma.driver.findMany({
        where: {
          status: DriverStatus.AVAILABLE,
          OR: [
            { licenseExpiry: null },
            { licenseExpiry: { gt: new Date() } },
          ],
        },
      }),
    ]);
    return { vehicles, drivers };
  }
}
