import { RegisterForm } from "@/components/auth/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex bg-[#F7F9FA]">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8 mt-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">Create an Account</h1>
            <p className="text-slate-500 mt-2">Join us to find and manage your perfect living space.</p>
          </div>
          
          <RegisterForm />
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-emerald-500">
        <Image
          src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200"
          alt="Register Background"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-lg text-emerald-50">Register now to book rooms effortlessly, track your tenancy, and experience seamless boarding house living.</p>
        </div>
      </div>
    </div>
  );
}
