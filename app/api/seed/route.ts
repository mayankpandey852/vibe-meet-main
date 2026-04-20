import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { MEETUPS, GROUPS, SPOTS } from "@/lib/data";

export async function GET() {
    try {
        // Clear existing data (optional, but good for clean seed)
        // Sequential to avoid foreign key issues
        await prisma.userMeetup.deleteMany();
        await prisma.userSavedMeetup.deleteMany();
        await prisma.userGroup.deleteMany();
        await prisma.notification.deleteMany();
        await prisma.user.deleteMany();
        await prisma.meetup.deleteMany();
        await prisma.group.deleteMany();
        await prisma.spot.deleteMany();
        await prisma.subscriber.deleteMany();

        // Seed Meetups
        for (const meetup of MEETUPS) {
            await prisma.meetup.create({ data: meetup });
        }

        // Seed Groups
        for (const group of GROUPS) {
            await prisma.group.create({ data: group });
        }

        // Seed Spots
        for (const spot of SPOTS) {
            await prisma.spot.create({ data: spot });
        }

        return NextResponse.json({ message: "Database seeded successfully with PostgreSQL!" });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({
            error: "Failed to seed database",
            details: error instanceof Error ? error.message : String(error),
        }, { status: 500 });
    }
}
