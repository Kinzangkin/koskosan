import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Reports</h1>
          <p className="text-sm text-slate-500">Analyze your property's revenue and performance.</p>
        </div>
        <Button variant="outline" className="rounded-full border-slate-200">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Revenue Trend (2024)</h2>
          </div>
          <RevenueChart data={[]} />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500">Total Revenue YTD</span>
                <span className="font-bold text-slate-800">Rp 128.500.000</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500">Average/Month</span>
                <span className="font-bold text-slate-800">Rp 25.700.000</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500">Best Month</span>
                <span className="font-bold text-emerald-600">March (Rp 32M)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Unpaid Bills</span>
                <span className="font-bold text-red-500">3 Tenants</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
