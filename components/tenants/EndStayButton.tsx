"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { completeBooking } from "@/app/actions/booking-actions";
import { useState } from "react";

export function EndStayButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleEndStay() {
    if (!confirm("Are you sure you want to end this tenant's stay? The room will become available again.")) return;
    
    setLoading(true);
    const result = await completeBooking(bookingId);
    if (!result.success) {
      alert(result.error);
    }
    setLoading(false);
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleEndStay}
      disabled={loading}
      title="End Stay (Check Out)"
      className="text-slate-400 hover:text-red-600 h-8 w-8 rounded-full disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
    </Button>
  );
}
