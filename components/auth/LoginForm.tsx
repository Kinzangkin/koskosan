"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin/dashboard"; // Fallback, will handle role based redirect
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      // If we had a specific redirect from a booking, go there
      if (searchParams.get("redirect")) {
        router.push(redirectUrl);
      } else {
        // Fetch session to determine role-based redirect
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        
        if (session?.user?.role === "ADMIN") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/tenant/dashboard";
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="admin@kos.com" 
          required 
          className="h-12 rounded-xl border-slate-200 bg-white"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Forgot password?</a>
        </div>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          placeholder="••••••••" 
          required 
          className="h-12 rounded-xl border-slate-200 bg-white"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full h-12 text-base font-bold rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20"
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-slate-500 text-sm">
        Don't have an account? <a href="/register" className="font-bold text-emerald-600 hover:text-emerald-700">Register here</a>
      </p>
    </form>
  );
}
