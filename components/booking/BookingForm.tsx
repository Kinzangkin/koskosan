"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBooking } from "@/app/actions/booking-actions";
import { Calendar, CheckCircle2, Clock, Wallet } from "lucide-react";

export default function BookingForm({ roomId, roomName, price }: { roomId: string, roomName: string, price: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const start = new Date(startDate);
    const result = await createBooking(roomId, start, duration, paymentMethod);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/tenant/dashboard");
      }, 2000);
    } else {
      setError(result.error || "Failed to book");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Submitted!</h2>
        <p className="text-slate-500 mb-6">Your request with {paymentMethod} for {duration} month(s) is being reviewed.</p>
        <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" /> Start Date
          </Label>
          <Input 
            id="startDate" 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
            className="h-12 rounded-xl border-slate-200 bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-slate-400" /> Duration
          </Label>
          <select 
            id="duration"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months (1 Year)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-slate-700 mb-2">
          <Wallet className="w-4 h-4 text-slate-400" /> Payment Method
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {["Transfer Bank", "Tunai (Cash)"].map((method) => (
            <div 
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center text-sm font-medium ${
                paymentMethod === method 
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                  : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
              }`}
            >
              {method}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Room:</span>
            <span className="font-semibold text-slate-800">{roomName}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Monthly Rent:</span>
            <span className="font-bold text-emerald-600">Rp {price.toLocaleString("id-ID")}</span>
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between text-sm">
            <span className="text-slate-500">Total Duration:</span>
            <span className="text-slate-700 font-bold">{duration} Month(s)</span>
          </div>
          <div className="flex justify-between text-base pt-2">
            <span className="text-slate-800 font-bold">Total Estimate:</span>
            <span className="text-emerald-700 font-black">Rp {(price * duration).toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center px-4">
        By clicking confirm, you agree to submit a booking request. You will be notified once the admin approves your application.
      </p>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full h-14 text-lg font-bold rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </Button>
    </form>
  );
}
