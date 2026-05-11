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
import { updateAnnouncement } from "@/app/actions/announcement-actions";

interface EditAnnouncementDialogProps {
  announcement: {
    id: string;
    title: string;
    content: string;
  };
}

export function EditAnnouncementDialog({ announcement }: EditAnnouncementDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const result = await updateAnnouncement(announcement.id, formData);
    
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
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">Edit Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={announcement.title} required className="rounded-xl border-slate-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <textarea 
              id="content" 
              name="content" 
              defaultValue={announcement.content}
              required
              placeholder="Announcement details..." 
              className="w-full min-h-[150px] p-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-slate-900 hover:bg-slate-800 h-12 text-base font-bold">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
