import { Star, Heart, MapPin, Phone, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    address: string;
    phone: string;
    price: number;
    roomsAvailable: number;
    rating: number;
    image: string;
    features: string[];
  };
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-white rounded-2xl hover:shadow-lg transition-shadow border border-slate-100">
      {/* Image Section */}
      <div className="relative w-full md:w-[280px] h-[200px] rounded-xl overflow-hidden shrink-0">
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md z-10 flex items-center gap-1">
          <span>1/5</span>
        </div>
        {room.image ? (
          <Image 
            src={room.image} 
            alt={room.name} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 280px"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-slate-400 font-medium">{room.name} Image</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-800">{room.name}</h3>
            <button className="text-slate-300 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center gap-1 mt-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(room.rating) ? "fill-orange-400 text-orange-400" : "fill-slate-200 text-slate-200"}`} 
              />
            ))}
            <span className="text-xs font-medium text-slate-500 ml-1">({room.rating.toFixed(1)})</span>
          </div>

          <div className="space-y-1.5 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Address:</span> {room.address}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Phone:</span> {room.phone}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="font-medium">{room.roomsAvailable} Rooms Available</span>
            </div>
            {room.features.map(feature => (
              <div key={feature} className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between mt-4 md:mt-0">
          <Link href={`/rooms/${room.id}`} className="text-emerald-600 hover:text-emerald-700 font-medium text-sm underline decoration-emerald-600/30 underline-offset-4">
            More details
          </Link>
          <div className="text-right">
            <span className="text-2xl font-bold text-slate-800">Rp {room.price.toLocaleString("id-ID")}</span>
            <span className="text-sm text-slate-500"> / bulan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
