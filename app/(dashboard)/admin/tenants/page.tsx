import { Button } from "@/components/ui/button";
import { Search, Edit, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getTenants } from "@/app/actions/tenant-actions";
import { AddTenantDialog } from "@/components/tenants/AddTenantDialog";
import { DeleteTenantButton } from "@/components/tenants/DeleteTenantButton";
import { EndStayButton } from "@/components/tenants/EndStayButton";

export default async function AdminTenantsPage() {
  const tenants = await getTenants();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Tenants</h1>
          <p className="text-sm text-slate-500">View and manage all your property tenants.</p>
        </div>
        <AddTenantDialog />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search tenants..." 
              className="pl-9 rounded-full bg-white border-slate-200"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full border-slate-200">Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Tenant</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Join Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No tenants found. Add your first tenant to get started.
                  </td>
                </tr>
              ) : (
              (tenants as any[]).map((tenant: any) => {
                  const activeBooking = tenant.bookings?.find((b: any) => b.status === "ACTIVE");
                  const hasBooking = !!activeBooking;
                  
                  return (
                    <tr key={tenant.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">
                              {tenant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-slate-800">{tenant.name}</div>
                            <div className="text-xs text-slate-500">{tenant.phone || tenant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {activeBooking ? activeBooking.room.name : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={hasBooking ? "default" : "secondary"} 
                          className={hasBooking ? "bg-emerald-500 text-white" : ""}>
                          {hasBooking ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(tenant.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600 h-8 w-8 rounded-full">
                            <Mail className="w-4 h-4" />
                          </Button>
                          {activeBooking && (
                            <EndStayButton bookingId={activeBooking.id} />
                          )}
                          <DeleteTenantButton id={tenant.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
