import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getTenantPayments } from "@/app/actions/payment-actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function TenantBillsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const payments = await getTenantPayments(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Bills</h1>
          <p className="text-sm text-slate-500">Manage your monthly rent payments.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Billing Period</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No bills found for your current booking.
                  </td>
                </tr>
              ) : (
                (payments as any[]).map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {new Date(payment.year, payment.month - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-bold">
                      Rp {payment.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={payment.status === "PAID" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                        : payment.proofPhoto 
                          ? "bg-amber-50 text-amber-600 border-amber-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }>
                        {payment.status === "PAID" ? "PAID" : payment.proofPhoto ? "PENDING VERIFICATION" : "UNPAID"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      05 {new Date(payment.year, payment.month - 1).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.status === "PAID" ? (
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600 rounded-full h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                      ) : (
                        <PaymentModal payment={payment} />
                      )}
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
