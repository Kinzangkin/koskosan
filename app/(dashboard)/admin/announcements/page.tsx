import { Button } from "@/components/ui/button";
import { Megaphone, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAnnouncements } from "@/app/actions/announcement-actions";
import { AddAnnouncementDialog } from "@/components/announcements/AddAnnouncementDialog";
import { DeleteAnnouncementButton } from "@/components/announcements/DeleteAnnouncementButton";
import { EditAnnouncementDialog } from "@/components/announcements/EditAnnouncementDialog";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Announcements</h1>
          <p className="text-sm text-slate-500">Broadcast important messages to all tenants.</p>
        </div>
        <AddAnnouncementDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-white rounded-[2rem] border border-slate-100">
            No announcements found. Create one to notify your tenants.
          </div>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="rounded-[2rem] border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-2 w-full bg-emerald-400"></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1">
                    <EditAnnouncementDialog announcement={announcement} />
                    <DeleteAnnouncementButton id={announcement.id} />
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{announcement.title}</h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed whitespace-pre-line">
                  {announcement.content}
                </p>
                <div className="flex justify-between items-center text-xs text-slate-400 pt-4 border-t border-slate-100">
                  <span>{new Date(announcement.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}</span>
                  <span>By {announcement.admin.name}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
