"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteRoom } from "@/app/actions/room-actions";
import { useState } from "react";

export function DeleteRoomButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this room?")) return;
    
    setLoading(true);
    const result = await deleteRoom(id);
    if (!result.success) {
      alert(result.error);
    }
    setLoading(false);
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete}
      disabled={loading}
      className="text-slate-400 hover:text-red-600 h-8 w-8 rounded-full disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
