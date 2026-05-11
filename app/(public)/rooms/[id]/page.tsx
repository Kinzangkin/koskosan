import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BedDouble, Maximize, MapPin, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function RoomDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) {
    notFound();
  }

  const defaultImage = "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <Link href="/rooms" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to rooms
      </Link>

      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Image Gallery Area */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100">
              <Image 
                src={room.photos[0] || defaultImage} 
                alt={room.name} 
                fill 
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Thumbnails (just placeholders for now since we only use 1 image typically) */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 opacity-70 hover:opacity-100 cursor-pointer transition-opacity">
                  <Image 
                    src={defaultImage} 
                    alt={`Thumbnail ${i}`} 
                    fill 
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details Area */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-2 inline-flex">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                room.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
              }`}>
                {room.status === "AVAILABLE" ? "Available Now" : "Currently Occupied"}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">{room.name}</h1>
            
            <div className="flex items-center text-slate-500 mb-6 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{room.floor ? `Floor ${room.floor}` : "Ground Floor"}</span>
            </div>

            <div className="flex gap-6 mb-8 py-4 border-y border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600">
                  <Maximize className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Size</p>
                  <p className="font-bold text-slate-700">{room.size || "Standard"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Type</p>
                  <p className="font-bold text-slate-700">1 Bedroom</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-3">Description</h3>
            <p className="text-slate-600 leading-relaxed mb-8 text-sm sm:text-base">
              {room.description || "Welcome to your new comfortable living space. This room offers premium amenities designed for your convenience and peace of mind."}
            </p>

            <h3 className="text-lg font-bold text-slate-800 mb-4">Facilities</h3>
            <div className="grid grid-cols-2 gap-y-3 mb-8">
              {(room.facilities.length > 0 ? room.facilities : ["AC", "WiFi", "Kamar Mandi Dalam", "Lemari", "Meja Belajar"]).map((facility, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{facility}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Price per month</p>
                <p className="text-3xl font-bold text-slate-800">Rp {room.price.toLocaleString("id-ID")}</p>
              </div>
              <Link href={session ? `/book/${room.id}` : `/login?redirect=/book/${room.id}`} className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  disabled={room.status !== "AVAILABLE"}
                  className="w-full sm:w-auto rounded-full px-8 text-base font-bold bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20"
                >
                  {room.status === "AVAILABLE" ? "Ajukan Sewa" : "Kamar Penuh"}
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
