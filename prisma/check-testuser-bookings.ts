import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'testuser@example.com' },
    include: { bookings: true }
  });
  
  if (!user) {
    console.log('User not found');
    return;
  }
  
  console.log(`User: ${user.name}`);
  console.log('Bookings:', user.bookings.length);
  user.bookings.forEach(b => {
    console.log(`- Booking ID: ${b.id}, Room ID: ${b.roomId}, Status: ${b.status}`);
  });
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
