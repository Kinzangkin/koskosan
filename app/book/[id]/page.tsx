import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BookingForm from "@/components/booking/BookingForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function BookRoomPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect(`/login?redirect=/book/${params.id}`);
  }

  const { id } = await params;
  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room || room.status !== "AVAILABLE") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FA] p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Room Unavailable</h1>
          <p className="text-slate-500 mb-6">Sorry, this room is no longer available for booking.</p>
          <Link href="/rooms">
            <button className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600">
              Find Another Room
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA] py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <Link href={`/rooms/${room.id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to room details
        </Link>

        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Complete Your Booking</h1>
          <p className="text-slate-500 text-sm mb-6">You're one step away from securing your new space.</p>
          
          <BookingForm roomId={room.id} roomName={room.name} price={room.price} />
        </div>
      </div>
    </div>
  );
}
