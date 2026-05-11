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
import { QrCode, Upload, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { submitPaymentProof } from "@/app/actions/payment-actions";

interface PaymentModalProps {
  payment: {
    id: string;
    bookingId: string;
    amount: number;
    month: number;
    year: number;
  };
}

export function PaymentModal({ payment }: PaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("paymentId", payment.id);
    formData.append("bookingId", payment.bookingId);
    formData.append("amount", payment.amount.toString());
    formData.append("month", payment.month.toString());
    formData.append("year", payment.year.toString());
    formData.append("paymentMethod", "QRIS");
    formData.append("proof", file);

    const result = await submitPaymentProof(formData);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 3000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-xs h-8">
          Pay Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-500" />
            Payment for {payment.month}/{payment.year}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Proof Submitted!</h3>
            <p className="text-sm text-slate-500 text-center">
              We will verify your payment shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-sm font-medium text-slate-600">Scan QRIS to pay</p>
              <div className="relative w-48 h-48 bg-white p-2 rounded-xl shadow-inner overflow-hidden border border-slate-200">
                <Image 
                  src="/qris.png" 
                  alt="QRIS Code" 
                  fill 
                  className="object-contain"
                />
              </div>
              <p className="text-xl font-bold text-slate-800">
                Rp {payment.amount.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="space-y-4">
              <Label htmlFor="proof" className="text-slate-700 font-medium">
                Upload Proof of Payment
              </Label>
              <div 
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30 flex flex-col items-center cursor-pointer relative"
                onClick={() => document.getElementById("proof")?.click()}
              >
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs text-slate-500">
                  {file ? file.name : "Click to select or drag and drop image"}
                </p>
                <input 
                  id="proof" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-full bg-slate-900 hover:bg-slate-800 h-12 text-base"
              disabled={!file || loading}
            >
              {loading ? "Submitting..." : "Submit Proof"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
