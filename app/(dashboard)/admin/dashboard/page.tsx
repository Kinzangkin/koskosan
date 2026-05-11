import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { BedDouble, Users, AlertCircle, Wallet, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ApproveBookingButton } from "@/components/booking/ApproveBookingButton";

export default async function AdminDashboard() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [totalRooms, occupiedRooms, pendingComplaints, recentRooms, pendingBookings, totalRevenue, monthlyRevenue] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: "OCCUPIED" } }),
    prisma.complaint.count({ where: { status: "NEW" } }),
    prisma.room.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    prisma.roomBooking.findMany({
      where: { status: "PENDING" },
      include: { user: true, room: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true }
    }),
    prisma.payment.groupBy({
      by: ['month'],
      where: { 
        status: "PAID",
        year: currentYear 
      },
      _sum: { amount: true },
      orderBy: { month: 'asc' }
    })
  ]);

  const revenueAmount = totalRevenue._sum.amount || 0;
  
  // Format chart data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = monthNames.map((name, index) => {
    const monthNum = index + 1;
    const monthlyData = (monthlyRevenue as any[]).find((m: any) => m.month === monthNum);
    return {
      name,
      total: monthlyData?._sum.amount || 0
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Rooms" 
          value={totalRooms.toString()} 
          subtitle="All active rooms" 
          icon={BedDouble} 
          href="/admin/rooms"
        />
        <StatCard 
          title="Occupied" 
          value={occupiedRooms.toString()} 
          subtitle={`${Math.round((occupiedRooms / totalRooms) * 100) || 0}% occupancy rate`} 
          icon={Users} 
          trend="up" 
          href="/admin/tenants"
        />
        <StatCard 
          title="Revenue" 
          value={`Rp ${(revenueAmount / 1000000).toFixed(1)}M`} 
          subtitle="Total collected" 
          icon={Wallet} 
          trend="up" 
          href="/admin/payments"
        />
        <StatCard 
          title="Pending Complaints" 
          value={pendingComplaints.toString()} 
          subtitle="Requires attention" 
          icon={AlertCircle} 
          trend={pendingComplaints > 0 ? "down" : "up"} 
          href="/admin/complaints"
        />
      </div>

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
         {/* Pending Bookings Alert */}
        {pendingBookings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 lg:col-span-3">
            <h2 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" />
              Pending Booking Requests ({pendingBookings.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-800">{booking.user.name}</p>
                    <p className="text-sm text-slate-500 mb-1">{booking.room.name}</p>
                    <p className="text-xs text-slate-400">Requested on {new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                  <ApproveBookingButton bookingId={booking.id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Revenue Overview</h2>
              <div className="flex bg-slate-100 rounded-full p-1">
                <button className="px-4 py-1 text-sm font-medium rounded-full bg-white shadow-sm">Week</button>
                <button className="px-4 py-1 text-sm font-medium rounded-full text-slate-500 hover:text-slate-800 transition-colors">Month</button>
                <button className="px-4 py-1 text-sm font-medium rounded-full text-slate-500 hover:text-slate-800 transition-colors">Year</button>
              </div>
            </div>
            <RevenueChart data={chartData} />
          </div>

          {/* Bottom small cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 text-white p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-700 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
              <h3 className="text-lg font-bold mb-1 relative z-10">Manage Payments</h3>
              <p className="text-sm text-slate-300 mb-4 relative z-10">Verification required</p>
              <Link href="/admin/payments">
                <Button variant="secondary" className="bg-white text-slate-800 hover:bg-slate-100 relative z-10 rounded-full">
                  Review Now
                </Button>
              </Link>
            </div>
            
            <div className="bg-emerald-500 text-white p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
              <h3 className="text-lg font-bold mb-1 relative z-10">Announcements</h3>
              <p className="text-sm text-emerald-100 mb-4 relative z-10">Broadcast message to tenants</p>
              <Link href="/admin/announcements">
                <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-slate-100 relative z-10 rounded-full border-none">
                  Create New
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Sidebar List */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Recent Rooms</h2>
            <Link href="/admin/rooms" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentRooms.map((room) => (
              <div key={room.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 group-hover:text-emerald-600 transition-colors">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{room.name}</p>
                    <p className="text-xs text-slate-500">{room.status === "OCCUPIED" ? "Occupied" : "Available"}</p>
                  </div>
                </div>
                {room.status === "OCCUPIED" ? (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </div>
            ))}
            {recentRooms.length === 0 && (
              <div className="text-center text-slate-400 py-4 text-sm">No rooms found</div>
            )}
          </div>

          <Link href="/admin/rooms">
            <Button className="w-full mt-6 rounded-full bg-slate-800 hover:bg-slate-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Room
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
