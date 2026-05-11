"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function getPayments() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          include: {
            user: { select: { name: true, email: true } },
            room: { select: { name: true } },
          },
        },
      },
    });
    return payments;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

export async function getUnpaidTenants() {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    console.log(`[DEBUG] getUnpaidTenants: Checking for Month ${currentMonth}, Year ${currentYear}`);

    const unpaidTenants = await prisma.roomBooking.findMany({
      where: {
        status: "ACTIVE",
        payments: {
          none: {
            month: currentMonth,
            year: currentYear,
            status: "PAID",
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        room: { select: { name: true, price: true } },
      },
    });

    return {
      tenants: unpaidTenants,
      month: currentMonth,
      year: currentYear
    };
  } catch (error) {
    console.error("Error fetching unpaid tenants:", error);
    return { tenants: [], month: new Date().getMonth() + 1, year: new Date().getFullYear() };
  }
}

export async function recordPayment(formData: FormData) {
  const bookingId = formData.get("bookingId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const month = parseInt(formData.get("month") as string);
  const year = parseInt(formData.get("year") as string);
  const note = formData.get("note") as string;

  console.log(`[DEBUG] recordPayment: Recording for Booking ${bookingId}, Period ${month}/${year}, Amount ${amount}`);

  try {
    await prisma.payment.create({
      data: {
        bookingId,
        amount,
        month,
        year,
        status: "PAID",
        paidAt: new Date(),
        note,
      },
    });

    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error) {
    console.error("Error recording payment:", error);
    return { success: false, error: "Failed to record payment" };
  }
}

export async function getTenantPayments(userId: string) {
  try {
    const booking = await prisma.roomBooking.findFirst({
      where: { userId, status: "ACTIVE" },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
        },
        room: { select: { price: true, name: true } },
      },
    });

    if (!booking) return [];

    // Return current month payment status even if not in DB yet
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const hasCurrentPayment = booking.payments.some(
      (p) => p.month === currentMonth && p.year === currentYear
    );

    let payments = [...booking.payments];

    if (!hasCurrentPayment) {
      // Add a virtual unpaid payment for current month
      payments.unshift({
        id: `virtual-${currentMonth}-${currentYear}`,
        bookingId: booking.id,
        amount: booking.room.price,
        month: currentMonth,
        year: currentYear,
        status: "UNPAID",
        paidAt: null,
        note: null,
        proofPhoto: null,
        paymentMethod: null,
        createdAt: new Date(),
      } as any);
    }

    return payments;
  } catch (error) {
    console.error("Error fetching tenant payments:", error);
    return [];
  }
}

export async function submitPaymentProof(formData: FormData) {
  const paymentId = formData.get("paymentId") as string;
  const bookingId = formData.get("bookingId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const month = parseInt(formData.get("month") as string);
  const year = parseInt(formData.get("year") as string);
  const paymentMethod = formData.get("paymentMethod") as string;
  const proofFile = formData.get("proof") as File;

  try {
    // Local File Upload Logic
    const bytes = await proofFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${proofFile.name.replace(/\s+/g, '-')}`;
    const relativePath = `/uploads/proofs/${fileName}`;
    const absolutePath = path.join(process.cwd(), "public", "uploads", "proofs", fileName);

    await fs.writeFile(absolutePath, buffer);

    if (paymentId && !paymentId.startsWith("virtual-")) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          proofPhoto: relativePath,
          paymentMethod,
          note: "Proof submitted, waiting for verification",
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          bookingId,
          amount,
          month,
          year,
          status: "UNPAID",
          proofPhoto: relativePath,
          paymentMethod,
          note: "Proof submitted, waiting for verification",
        },
      });
    }

    revalidatePath("/tenant/bills");
    revalidatePath("/tenant/dashboard");
    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error) {
    console.error("Error submitting payment proof:", error);
    return { success: false, error: "Failed to submit proof locally" };
  }
}

export async function approvePayment(paymentId: string) {
  try {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        note: "Verified by Admin",
      },
    });

    revalidatePath("/admin/payments");
    return { success: true };
  } catch (error) {
    console.error("Error approving payment:", error);
    return { success: false, error: "Failed to approve payment" };
  }
}
