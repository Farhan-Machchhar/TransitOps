import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const rows = [
      [
        "Trip ID",
        "Origin",
        "Destination",
        "Vehicle",
        "Driver",
        "Status",
        "Created At",
      ],
    ];

    trips.forEach((trip) => {
      rows.push([
        trip.id,
        trip.origin,
        trip.destination,
        trip.vehicle.licensePlate,
        `${trip.driver.firstName} ${trip.driver.lastName}`,
        trip.status,
        trip.createdAt.toLocaleString(),
      ]);
    });

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="TransitOps_Report.csv"',
      },
    });
  } catch (error) {
    console.error(error);

    return new Response("Failed to export CSV", {
      status: 500,
    });
  }
}