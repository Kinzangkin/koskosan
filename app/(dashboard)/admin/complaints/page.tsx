import { Button } from "@/components/ui/button";
import { Search, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getComplaints } from "@/app/actions/complaint-actions";
import { UpdateComplaintStatusSelect } from "@/components/complaints/UpdateComplaintStatusSelect";
import { ComplaintStatus } from "@prisma/client";

interface ComplaintWithDetails {
  id: string;
  title: string;
  status: ComplaintStatus;
  createdAt: Date;
  user: { name: string };
  room: { name: string };
}

export default async function AdminComplaintsPage() {
  const complaints: ComplaintWithDetails[] = await getComplaints() as any;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tenant Complaints</h1>
          <p className="text-sm text-slate-500">Track and resolve issues reported by tenants.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search complaints..." 
              className="pl-9 rounded-full bg-white border-slate-200"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full border-slate-200">Filter Status</Button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {complaints.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No complaints found. Great job!
            </div>
          ) : (
            complaints.map((complaint) => (
              <div key={complaint.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
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
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      {complaint.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Reported by <span className="font-medium text-slate-700">{complaint.user.name}</span> in {complaint.room.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(complaint.createdAt).toLocaleString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <UpdateComplaintStatusSelect id={complaint.id} currentStatus={complaint.status} />
                  <Button className="rounded-full bg-slate-800 hover:bg-slate-700 text-white whitespace-nowrap">View Details</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
