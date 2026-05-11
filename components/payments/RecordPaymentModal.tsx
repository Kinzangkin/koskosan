"use client";

import { useState, useEffect } from "react";
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
import { Wallet, CheckCircle2 } from "lucide-react";
import { recordPayment } from "@/app/actions/payment-actions";

interface RecordPaymentModalProps {
  booking: {
    id: string;
    user: {
      name: string;
    };
    room: {
      name: string;
      price: number;
    };
  };
  defaultMonth: number;
  defaultYear: number;
}

export function RecordPaymentModal({ booking, defaultMonth, defaultYear }: RecordPaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [amount, setAmount] = useState(booking.room.price.toString());
  const [month, setMonth] = useState(defaultMonth.toString());
  const [year, setYear] = useState(defaultYear.toString());
  const [note, setNote] = useState("");

  // Sync state if props change (e.g. month rolls over while page is open)
  useEffect(() => {
    setMonth(defaultMonth.toString());
    setYear(defaultYear.toString());
  }, [defaultMonth, defaultYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("bookingId", booking.id);
    formData.append("amount", amount);
    formData.append("month", month);
    formData.append("year", year);
    formData.append("note", note || "Manual payment recorded by Admin");

    const result = await recordPayment(formData);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-xs h-8">
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" />
            Record Payment for {booking.user.name}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Payment Recorded!</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Rp)</Label>
              <Input 
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Input 
                  id="month"
                  type="number"
                  min="1"
                  max="12"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input 
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Input 
                id="note"
                placeholder="e.g. Paid in cash"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full rounded-full bg-slate-900 hover:bg-slate-800 h-12 text-base font-bold"
                disabled={loading}
              >
                {loading ? "Recording..." : "Confirm Payment"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
