"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ComplaintStatus } from "@prisma/client";

export async function getComplaints() {
  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: { select: { name: true } },
        room: { select: { name: true } },
      }
    });
    return complaints;
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return [];
  }
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus) {
  try {
    await prisma.complaint.update({
      where: { id },
      data: { status },
    });
    
    revalidatePath("/admin/complaints");
    return { success: true };
  } catch (error) {
    console.error("Error updating complaint:", error);
    return { success: false, error: "Failed to update complaint status" };
  }
}
