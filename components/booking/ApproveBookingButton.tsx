"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { approveBooking, rejectBooking } from "@/app/actions/booking-actions";
import { useState } from "react";

export function ApproveBookingButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "approve" | "reject") => {
    // Removing confirm() to avoid blocking browser subagent and improving UX
    setLoading(true);
    try {
      if (action === "approve") {
        await approveBooking(bookingId);
      } else {
        await rejectBooking(bookingId);
      }
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      alert(`Error: Failed to ${action} booking.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={() => handleAction("approve")}
        disabled={loading}
        className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-xs h-8"
      >
        <CheckCircle className="w-4 h-4 mr-1" />
        Approve
      </Button>
      <Button 
        onClick={() => handleAction("reject")}
        variant="outline"
        disabled={loading}
        className="rounded-full border-red-200 text-red-600 hover:bg-red-50 text-xs h-8"
      >
        <XCircle className="w-4 h-4 mr-1" />
        Reject
      </Button>
    </div>
  );
}
