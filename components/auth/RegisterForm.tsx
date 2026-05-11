"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/app/actions/auth-actions";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await registerUser(formData);

    if (!result.success) {
      setError(result.error || "Registration failed");
      setLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="e.g. Budi Santoso" 
          required 
          className="h-12 rounded-xl border-slate-200 bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="budi@example.com" 
          required 
          className="h-12 rounded-xl border-slate-200 bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          name="phone" 
          placeholder="08123456789" 
          required 
          className="h-12 rounded-xl border-slate-200 bg-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          placeholder="••••••••" 
          required 
          minLength={6}
          className="h-12 rounded-xl border-slate-200 bg-white"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full h-12 mt-2 text-base font-bold rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <p className="text-center text-slate-500 text-sm mt-4">
        Already have an account? <a href="/login" className="font-bold text-emerald-600 hover:text-emerald-700">Sign in here</a>
      </p>
    </form>
  );
}
