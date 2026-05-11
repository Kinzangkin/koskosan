"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { approvePayment } from "@/app/actions/payment-actions";
import { useState } from "react";

export function ApprovePaymentButton({ paymentId }: { paymentId: string }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this payment?")) return;
    
    setLoading(true);
    await approvePayment(paymentId);
    setLoading(false);
  };

  return (
    <Button 
      onClick={handleApprove}
      disabled={loading}
      className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-xs h-8"
    >
      <CheckCircle className="w-4 h-4 mr-2" />
      {loading ? "Approving..." : "Approve"}
    </Button>
  );
}
