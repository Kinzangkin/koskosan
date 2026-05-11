import { PrismaClient } from '../lib/generated/prisma/client.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.payment.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.roomBooking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating Admin...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@kos.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Creating Rooms...');
  const rooms = await Promise.all([
    prisma.room.create({ data: { name: 'Room 101', price: 1500000, size: '3x3m', floor: '1', description: 'Standard room', status: 'OCCUPIED' } }),
    prisma.room.create({ data: { name: 'Room 102', price: 1500000, size: '3x3m', floor: '1', description: 'Standard room', status: 'AVAILABLE' } }),
    prisma.room.create({ data: { name: 'Room 201', price: 2500000, size: '4x4m', floor: '2', description: 'Premium room with AC', status: 'OCCUPIED' } }),
    prisma.room.create({ data: { name: 'Room 202', price: 2500000, size: '4x4m', floor: '2', description: 'Premium room with AC', status: 'AVAILABLE' } }),
  ]);

  console.log('Creating Tenants...');
  const tenantPass = await bcrypt.hash('tenant123', 10);
  
  const tenant1 = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi@example.com',
      password: tenantPass,
      phone: '081234567890',
      role: 'TENANT',
      bookings: {
        create: {
          roomId: rooms[0].id, // Room 101
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          status: 'ACTIVE',
        }
      }
    }
  });

  const tenant2 = await prisma.user.create({
    data: {
      name: 'Siti Aminah',
      email: 'siti@example.com',
      password: tenantPass,
      phone: '081234567891',
      role: 'TENANT',
      bookings: {
        create: {
          roomId: rooms[2].id, // Room 201
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          status: 'ACTIVE',
        }
      }
    }
  });

  console.log('Creating Complaints...');
  await prisma.complaint.create({
    data: {
      title: 'AC Kurang Dingin',
      description: 'AC di kamar 201 terasa kurang dingin sejak kemarin malam.',
      userId: tenant2.id,
      roomId: rooms[2].id,
      status: 'NEW',
    }
  });

  console.log('Creating Announcements...');
  await prisma.announcement.create({
    data: {
      title: 'Jadwal Fogging Bulan Ini',
      content: 'Diberitahukan kepada seluruh penghuni, fogging nyamuk akan dilaksanakan pada hari Minggu jam 09:00 WIB. Mohon bersiap.',
      adminId: admin.id,
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
