"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createTenant } from "@/app/actions/tenant-actions";

export function AddTenantDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const result = await createTenant(formData);
    
    setLoading(false);
    if (result.success) {
      setOpen(false);
    } else {
      alert(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Add New Tenant
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Add New Tenant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="e.g. Budi Santoso" required className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="e.g. budi@example.com" required className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" placeholder="e.g. 08123456789" className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Temporary Password</Label>
            <Input id="password" name="password" type="password" placeholder="Leave empty for 'password123'" className="rounded-xl border-slate-200" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-emerald-500 hover:bg-emerald-600 h-12 text-base font-bold">
            {loading ? "Adding..." : "Add Tenant"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
