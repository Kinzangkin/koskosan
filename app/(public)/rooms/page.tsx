import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomFilter } from "@/components/rooms/RoomFilter";
import { RoomMap } from "@/components/rooms/RoomMap";
import { prisma } from "@/lib/prisma";

export default async function RoomsPage() {
  const dbRooms = await prisma.room.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Map Prisma model to RoomCard props format
  const rooms = dbRooms.map((r: any) => ({
    id: r.id,
    name: r.name,
    address: r.floor ? `Floor ${r.floor}` : "Manado, Sulawesi Utara", // Fallback if no specific address field
    phone: "0853-4092-1018", // Global kos phone
    price: r.price,
    roomsAvailable: r.status === "AVAILABLE" ? 1 : 0,
    rating: 5.0, // Hardcoded for now as we don't have reviews yet
    image: r.photos[0] || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
    features: r.facilities.length > 0 ? r.facilities : [r.size ? `Size: ${r.size}` : "AC & WiFi", "Kamar Mandi Dalam"]
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      {/* Left List Section */}
      <div className="w-full lg:w-1/2 flex flex-col h-full bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 overflow-hidden">
        <RoomFilter />
        
        <div className="flex-1 overflow-y-auto mt-6 pr-2 space-y-4 no-scrollbar">
          {rooms.map((room: any) => (
            <RoomCard key={room.id} room={room} />
          ))}
          {rooms.length === 0 && (
            <div className="text-center p-12 text-slate-400">
              Belum ada kamar yang tersedia.
            </div>
          )}
        </div>
      </div>

      {/* Right Map Section */}
      <div className="hidden lg:block lg:w-1/2 h-full">
        <RoomMap />
      </div>
    </div>
  );
}
