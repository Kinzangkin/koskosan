import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Adding more available rooms...');
  
  const newRooms = [
    {
      name: 'Room 103',
      price: 1600000,
      size: '3x3.5m',
      floor: '1',
      description: 'Kamar nyaman dengan jendela besar, dekat pintu masuk.',
      status: 'AVAILABLE' as const,
      facilities: ['AC', 'WiFi', 'Lemari', 'Kasur']
    },
    {
      name: 'Room 104',
      price: 1550000,
      size: '3x3m',
      floor: '1',
      description: 'Kamar tenang di pojok lantai 1.',
      status: 'AVAILABLE' as const,
      facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam']
    },
    {
      name: 'Room 203',
      price: 2600000,
      size: '4x4.5m',
      floor: '2',
      description: 'Kamar premium dengan balkon pribadi dan AC.',
      status: 'AVAILABLE' as const,
      facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'TV', 'Balkon']
    },
    {
      name: 'Room 204',
      price: 2400000,
      size: '4x4m',
      floor: '2',
      description: 'Kamar premium di lantai 2, suasana adem.',
      status: 'AVAILABLE' as const,
      facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Meja Belajar']
    },
    {
      name: 'Penthouse 301',
      price: 4500000,
      size: '6x8m',
      floor: '3',
      description: 'Kamar termewah di lantai teratas dengan fasilitas lengkap dan dapur mini.',
      status: 'AVAILABLE' as const,
      facilities: ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Kitchenette', 'Smart TV', 'Water Heater']
    }
  ];

  for (const room of newRooms) {
    await prisma.room.create({
      data: room
    });
    console.log(`Added: ${room.name}`);
  }

  console.log('Finished adding rooms!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
