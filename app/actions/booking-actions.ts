// Updated booking logic
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createBooking(
  roomId: string, 
  startDate: Date, 
  duration: number, 
  paymentMethod: string
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return { success: false, error: "You must be logged in to book a room." };
    }
    const userId = session.user.id;

    // Calculate endDate based on duration
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);

    // Check for existing pending or active booking for this user
    const existingBooking = await prisma.roomBooking.findFirst({
      where: {
        userId,
        status: { in: ["PENDING", "ACTIVE"] }
      }
    });

    if (existingBooking) {
      return { success: false, error: "You already have a pending or active booking." };
    }

    // Verify room is available
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room || room.status !== "AVAILABLE") {
      return { success: false, error: "Room is not available for booking." };
    }

    // Create the booking (PENDING)
    await prisma.roomBooking.create({
      data: {
        roomId,
        userId,
        startDate,
        endDate,
        duration,
        paymentMethod,
        status: "PENDING",
      }
    });

    // We do NOT change the room to OCCUPIED yet. 
    // Admin will change it when they verify payment.

    revalidatePath("/tenant/dashboard");
    revalidatePath("/admin/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "Failed to submit booking request." };
  }
}

export async function approveBooking(bookingId: string) {
  try {
    console.log(`[DEBUG] approveBooking: Approving booking ${bookingId}`);
    const booking = await prisma.roomBooking.update({
      where: { id: bookingId },
      data: { status: "ACTIVE" },
      include: { room: true }
    });
    console.log(`[DEBUG] approveBooking: Updated booking ${bookingId} to ACTIVE`);

    // Update room status to OCCUPIED
    await prisma.room.update({
      where: { id: booking.roomId },
      data: { status: "OCCUPIED" }
    });
    console.log(`[DEBUG] approveBooking: Updated room ${booking.roomId} to OCCUPIED`);

    revalidatePath("/admin/dashboard");
    revalidatePath("/tenant/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error approving booking:", error);
    return { success: false, error: "Failed to approve booking." };
  }
}

export async function rejectBooking(bookingId: string) {
  try {
    await prisma.roomBooking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" }
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting booking:", error);
    return { success: false, error: "Failed to reject booking." };
  }
}

export async function completeBooking(bookingId: string) {
  try {
    const booking = await prisma.roomBooking.update({
      where: { id: bookingId },
      data: { status: "ENDED" },
    });

    // Update room status back to AVAILABLE
    await prisma.room.update({
      where: { id: booking.roomId },
      data: { status: "AVAILABLE" }
    });

    revalidatePath("/admin/tenants");
    revalidatePath("/admin/rooms");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error completing booking:", error);
    return { success: false, error: "Failed to end stay." };
  }
}
