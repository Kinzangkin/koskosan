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
import { createAnnouncement } from "@/app/actions/announcement-actions";

export function AddAnnouncementDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const result = await createAnnouncement(formData);
    
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
          Create Announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">New Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="e.g. Perbaikan WiFi..." required className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <textarea 
              id="content" 
              name="content" 
              placeholder="Write your announcement here..." 
              required
              className="w-full min-h-[150px] p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-emerald-500 hover:bg-emerald-600 h-12 text-base font-bold">
            {loading ? "Publishing..." : "Publish Announcement"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
