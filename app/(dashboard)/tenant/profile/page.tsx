import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, CreditCard, ShieldCheck } from "lucide-react";

export default async function TenantProfilePage() {
  const tenant = await prisma.user.findFirst({
    where: { role: "TENANT" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-500">View and update your personal information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold text-emerald-600">
              {tenant?.name?.charAt(0) || "?"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">{tenant?.name || "Tenant"}</h2>
          <p className="text-sm text-slate-500 mt-1">{tenant?.email}</p>
          <div className="mt-4 px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full inline-block">
            {tenant?.role || "TENANT"}
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Personal Information</h2>
          
          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Full Name
                </Label>
                <Input id="name" defaultValue={tenant?.name || ""} className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email
                </Label>
                <Input id="email" type="email" defaultValue={tenant?.email || ""} className="rounded-xl border-slate-200" disabled />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> Phone
                </Label>
                <Input id="phone" defaultValue={tenant?.phone || ""} className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency" className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400" /> Emergency Contact
                </Label>
                <Input id="emergency" defaultValue={tenant?.emergencyContact || ""} placeholder="Name & Phone" className="rounded-xl border-slate-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ktp" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" /> KTP Number
                </Label>
                <Input id="ktp" defaultValue={tenant?.ktpNumber || ""} placeholder="3271XXXXXXXXXXXX" className="rounded-xl border-slate-200" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button type="button" className="rounded-full bg-emerald-500 hover:bg-emerald-600 px-8">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
