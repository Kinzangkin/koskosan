"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getTenants() {
  try {
    const tenants = await prisma.user.findMany({
      where: {
        role: "TENANT",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        bookings: {
          include: {
            room: true,
          },
        },
      },
    });
    return tenants;
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return [];
  }
}

export async function createTenant(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password || "password123", 10);

    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "TENANT",
      },
    });
    
    revalidatePath("/admin/tenants");
    return { success: true };
  } catch (error) {
    console.error("Error creating tenant:", error);
    return { success: false, error: "Failed to create tenant" };
  }
}

export async function deleteTenant(id: string) {
  try {
    // Delete bookings first due to foreign key constraints
    await prisma.roomBooking.deleteMany({
      where: { userId: id }
    });
    
    await prisma.user.delete({
      where: { id },
    });
    
    revalidatePath("/admin/tenants");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return { success: false, error: "Failed to delete tenant" };
  }
}
