"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAnnouncements() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        admin: {
          select: { name: true }
        }
      }
    });
    return announcements;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

export async function createAnnouncement(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  try {
    // For testing without auth, get the first admin or create one
    let admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: "Super Admin",
          email: "admin@example.com",
          password: "password", // Dummy password
          role: "ADMIN"
        }
      });
    }

    await prisma.announcement.create({
      data: {
        title,
        content,
        adminId: admin.id,
      },
    });
    
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { success: false, error: "Failed to create announcement" };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await prisma.announcement.delete({
      where: { id },
    });
    
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return { success: false, error: "Failed to delete announcement" };
  }
}

export async function updateAnnouncement(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  try {
    await prisma.announcement.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
    
    revalidatePath("/admin/announcements");
    return { success: true };
  } catch (error) {
    console.error("Error updating announcement:", error);
    return { success: false, error: "Failed to update announcement" };
  }
}
