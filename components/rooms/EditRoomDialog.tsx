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
import { Edit } from "lucide-react";
import { updateRoom } from "@/app/actions/room-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditRoomDialogProps {
  room: {
    id: string;
    name: string;
    price: number;
    description: string | null;
    size: string | null;
    floor: string | null;
    status: string;
  };
}

export function EditRoomDialog({ room }: EditRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(room.status);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    formData.append("status", status);
    
    const result = await updateRoom(room.id, formData);
    
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
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 h-8 w-8 rounded-full">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Edit Room: {room.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input id="name" name="name" defaultValue={room.name} required className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price per Month (Rp)</Label>
            <Input id="price" name="price" type="number" defaultValue={room.price} required className="rounded-xl border-slate-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input id="size" name="size" defaultValue={room.size || ""} className="rounded-xl border-slate-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input id="floor" name="floor" defaultValue={room.floor || ""} className="rounded-xl border-slate-200" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-xl border-slate-200">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                <SelectItem value="OCCUPIED">OCCUPIED</SelectItem>
                <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea 
              id="description" 
              name="description" 
              defaultValue={room.description || ""}
              placeholder="Room details..." 
              className="w-full min-h-[100px] p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-slate-900 hover:bg-slate-800 h-12 text-base font-bold">
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
