import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getRooms } from "@/app/actions/room-actions";
import { AddRoomDialog } from "@/components/rooms/AddRoomDialog";
import { DeleteRoomButton } from "@/components/rooms/DeleteRoomButton";
import { EditRoomDialog } from "@/components/rooms/EditRoomDialog";

export default async function AdminRoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Rooms</h1>
          <p className="text-sm text-slate-500">View and manage all rooms in your property.</p>
        </div>
        <AddRoomDialog />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search rooms..." 
              className="pl-9 rounded-full bg-white border-slate-200"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full border-slate-200">Filter</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Room Name</th>
                <th className="px-6 py-4 font-medium">Price/Month</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Current Tenant</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No rooms found. Add your first room to get started.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{room.name}</td>
                    <td className="px-6 py-4 text-slate-600">Rp {room.price.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4">
                      <Badge variant={room.status === "AVAILABLE" ? "outline" : "default"} 
                        className={room.status === "AVAILABLE" 
                          ? "text-emerald-600 border-emerald-200 bg-emerald-50" 
                          : "bg-slate-800 text-white"}>
                        {room.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {room.bookings && room.bookings.length > 0 
                        ? room.bookings[0].user.name 
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <EditRoomDialog room={room} />
                        <DeleteRoomButton id={room.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
