import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-screen w-full bg-[#F7F9FA] flex overflow-hidden">
      <Sidebar role={session?.user?.role || "ADMIN"} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {/* Background decorative elements for premium feel */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>
          
          {children}
        </main>
      </div>
    </div>
  );
}
