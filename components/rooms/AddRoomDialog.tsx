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
import { createRoom } from "@/app/actions/room-actions";

export function AddRoomDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const result = await createRoom(formData);
    
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
          Add New Room
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Add New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input id="name" name="name" placeholder="e.g. Room 101" required className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price per Month (Rp)</Label>
            <Input id="price" name="price" type="number" placeholder="e.g. 1500000" required className="rounded-xl border-slate-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Size (e.g. 3x4m)</Label>
              <Input id="size" name="size" placeholder="3x4m" className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input id="floor" name="floor" placeholder="1" className="rounded-xl border-slate-200" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea 
              id="description" 
              name="description" 
              placeholder="Room details..." 
              className="w-full min-h-[100px] p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-emerald-500 hover:bg-emerald-600 h-12 text-base font-bold">
            {loading ? "Adding..." : "Add Room"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
