"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getRooms() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        bookings: {
          where: {
            status: "ACTIVE",
          },
          include: {
            user: true,
          },
        },
      },
    });
    return rooms;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
}

export async function createRoom(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const size = formData.get("size") as string;
  const floor = formData.get("floor") as string;

  try {
    await prisma.room.create({
      data: {
        name,
        price,
        description,
        size,
        floor,
        status: "AVAILABLE",
      },
    });
    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error) {
    console.error("Error creating room:", error);
    return { success: false, error: "Failed to create room" };
  }
}

export async function deleteRoom(id: string) {
  try {
    await prisma.room.delete({
      where: { id },
    });
    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error) {
    console.error("Error deleting room:", error);
    return { success: false, error: "Failed to delete room" };
  }
}

export async function updateRoom(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const size = formData.get("size") as string;
  const floor = formData.get("floor") as string;
  const status = formData.get("status") as any;

  try {
    await prisma.room.update({
      where: { id },
      data: {
        name,
        price,
        description,
        size,
        floor,
        status,
      },
    });
    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error) {
    console.error("Error updating room:", error);
    return { success: false, error: "Failed to update room" };
  }
}
