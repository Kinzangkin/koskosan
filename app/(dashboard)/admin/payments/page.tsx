import { Button } from "@/components/ui/button";
import { Search, AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getPayments, getUnpaidTenants } from "@/app/actions/payment-actions";
import { RecordPaymentModal } from "@/components/payments/RecordPaymentModal";
import { ApprovePaymentButton } from "@/components/payments/ApprovePaymentButton";
import { ExternalLink } from "lucide-react";

export default async function AdminPaymentsPage() {
  const [payments, unpaidData] = await Promise.all([
    getPayments(),
    getUnpaidTenants(),
  ]);

  const { tenants: unpaidTenants, month: currentMonth, year: currentYear } = unpaidData;

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleDateString('id-ID', { month: 'long' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Payments</h1>
          <p className="text-sm text-slate-500">Record and track tenant rent payments.</p>
        </div>
      </div>

      {/* Unpaid Tenants Alert */}
      {unpaidTenants.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-[2rem] p-6">
          <h2 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5" />
            Unpaid for {monthName} {currentYear} ({unpaidTenants.length})
          </h2>
          <div className="space-y-3">
            {unpaidTenants.map((booking) => (
              <div key={booking.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl">
                <div>
                  <p className="font-medium text-slate-800">{booking.user.name}</p>
                  <p className="text-sm text-slate-500">{booking.room.name} — Rp {booking.room.price.toLocaleString("id-ID")}</p>
                </div>
                <RecordPaymentModal 
                  key={`${booking.id}-${currentMonth}-${currentYear}`}
                  booking={booking} 
                  defaultMonth={currentMonth}
                  defaultYear={currentYear}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search payments..." 
              className="pl-9 rounded-full bg-white border-slate-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Tenant</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Period</th>
                 <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Proof</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No payment records yet.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{payment.booking.user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{payment.booking.room.name}</td>
                    <td className="px-6 py-4 text-slate-600">{payment.month}/{payment.year}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">Rp {payment.amount.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4">
                      <Badge className={payment.status === "PAID" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                        : "bg-red-50 text-red-600 border-red-200"
                      }>
                        {payment.status}
                      </Badge>
                    </td>
                     <td className="px-6 py-4">
                      {payment.proofPhoto ? (
                        <a 
                          href={payment.proofPhoto} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-600 hover:underline"
                        >
                          View Proof <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === "UNPAID" && payment.proofPhoto ? (
                        <ApprovePaymentButton paymentId={payment.id} />
                      ) : payment.paidAt 
                        ? new Date(payment.paidAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                        : "-"
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
