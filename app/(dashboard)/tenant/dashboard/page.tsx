import { BedDouble, FileText, Megaphone, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTenantPayments } from "@/app/actions/payment-actions";
import { PaymentModal } from "@/components/payments/PaymentModal";

export default async function TenantDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const tenant = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      bookings: {
        where: { 
          status: { in: ["ACTIVE", "PENDING"] }
        },
        include: { room: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const announcements = await prisma.announcement.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { admin: { select: { name: true } } }
  });

  const activeBooking = tenant?.bookings?.find((b: any) => b.status === "ACTIVE");
  const pendingBooking = tenant?.bookings?.find((b: any) => b.status === "PENDING");
  const displayBooking = activeBooking || pendingBooking;

  // Fetch all payments using our unified logic
  const payments = activeBooking ? await getTenantPayments(session.user.id) : [];
  
  // Find the bill for the current month
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  const currentBill = (payments as any[]).find((p: any) => p.month === currentMonth && p.year === currentYear);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back, {tenant?.name || "Tenant"}!</h1>
          <p className="text-sm text-slate-500">Here is an overview of your room and bills.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Room & Bills) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active/Pending Room Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 ${
              activeBooking ? "bg-emerald-50" : "bg-amber-50"
            }`}></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-slate-800">My Room</h2>
                  {pendingBooking && !activeBooking && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Pending Review
                    </span>
                  )}
                  {activeBooking && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>
                
                {displayBooking ? (
                  <>
                    <p className={`text-3xl font-bold mb-1 ${activeBooking ? "text-emerald-600" : "text-amber-600"}`}>
                      {displayBooking.room.name}
                    </p>
                    <p className="text-slate-500 mb-4">{displayBooking.room.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <BedDouble className={`w-4 h-4 ${activeBooking ? "text-emerald-500" : "text-amber-500"}`} />
                        <span>Floor {displayBooking.room.floor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className={`w-4 h-4 ${activeBooking ? "text-emerald-500" : "text-amber-500"}`} />
                        <span>
                          {activeBooking 
                            ? `Active until ${new Date(displayBooking.endDate).toLocaleDateString()}`
                            : `Applied on ${new Date(displayBooking.createdAt).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                    </div>
                    {!activeBooking && (
                      <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                        <p className="text-sm text-amber-800 font-medium">
                          Your application is being reviewed. We will notify you once it's approved and you can proceed with payment.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-8">
                    <p className="text-slate-500 mb-4">You don't have any active or pending room applications.</p>
                    <Link href="/rooms">
                      <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 font-bold px-6">
                        Browse Rooms
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Bill Card - Only show if active */}
          {activeBooking && (
            <div className={`p-6 sm:p-8 rounded-[2rem] shadow-sm relative overflow-hidden ${
              currentBill?.status === "PAID" ? "bg-emerald-600 text-white" : "bg-slate-800 text-white"
            }`}>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-10 -mb-10"></div>
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h3 className="text-lg font-medium opacity-80 mb-1">
                    {currentBill ? `Bill for ${new Date(currentBill.year, currentBill.month - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}` : "No Active Bill"}
                  </h3>
                  <p className="text-4xl font-bold mb-2">
                    Rp {currentBill?.amount.toLocaleString("id-ID") || activeBooking?.room.price.toLocaleString("id-ID") || 0}
                  </p>
                  {currentBill?.status === "PAID" ? (
                    <p className="text-sm text-emerald-100 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Payment Completed on {new Date(currentBill.paidAt!).toLocaleDateString()}
                    </p>
                  ) : currentBill?.proofPhoto ? (
                    <p className="text-sm text-amber-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Proof Uploaded - Pending Verification
                    </p>
                  ) : (
                    <p className="text-sm text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Unpaid - Due Soon
                    </p>
                  )}
                </div>
                
                {currentBill?.status !== "PAID" && currentBill && (
                  <PaymentModal payment={currentBill} />
                )}
                
                {currentBill?.status === "PAID" && (
                  <Link href="/tenant/bills">
                    <Button variant="secondary" className="rounded-full bg-white text-emerald-700 hover:bg-slate-100 border-none font-bold px-8 h-12">
                      View History
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (Announcements) */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-emerald-500" />
              Announcements
            </h2>
          </div>
          
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <p className="text-slate-500 text-sm">No new announcements.</p>
            ) : (
              (announcements as any[]).map((ann: any) => (
                <div key={ann.id} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{ann.title}</h3>
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">{ann.content}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <Link href="/tenant/complaints">
            <Button variant="outline" className="w-full mt-6 rounded-full border-slate-200 hover:bg-slate-50 text-slate-600">
              Report an Issue
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
