import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function TenantComplaintsPage() {
  const tenant = await prisma.user.findFirst({ where: { role: "TENANT" } });
  
  const complaints = await prisma.complaint.findMany({
    where: { userId: tenant?.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Complaints</h1>
          <p className="text-sm text-slate-500">Report issues or track existing ones.</p>
        </div>
        <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Report Issue
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {complaints.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              You haven't reported any issues yet.
            </div>
          ) : (
            (complaints as any[]).map((complaint: any) => (
              <div key={complaint.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-start">
                  <div className={`p-3 rounded-2xl ${
                    complaint.status === "NEW" ? "bg-red-50 text-red-500" :
                    complaint.status === "IN_PROGRESS" ? "bg-orange-50 text-orange-500" :
                    "bg-emerald-50 text-emerald-500"
                  }`}>
                    {complaint.status === "NEW" ? <AlertTriangle className="w-6 h-6" /> :
                     complaint.status === "IN_PROGRESS" ? <Clock className="w-6 h-6" /> :
                     <CheckCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{complaint.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{complaint.description}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      Reported on {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 px-4 py-1.5 rounded-full text-xs font-bold border border-slate-200 text-slate-600 bg-white">
                  {complaint.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
