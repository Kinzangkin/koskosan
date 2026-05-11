import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-[#F7F9FA]">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Sign in to your account to continue</p>
          </div>
          
          <LoginForm />
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-emerald-500">
        <Image
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200"
          alt="Login Background"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Your Comfortable Living Space</h2>
          <p className="text-lg text-emerald-50">Manage your room, track your payments, and stay updated with our community announcements.</p>
        </div>
      </div>
    </div>
  );
}
