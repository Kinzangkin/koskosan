import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="w-full bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-bold text-xl text-emerald-600 tracking-wide">Kost Anzelly</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="rounded-full text-slate-600 font-medium">Log in</Button>
          </Link>
          <Link href="/register">
            <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium">Sign Up</Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
