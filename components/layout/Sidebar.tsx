import { Home, LayoutDashboard, Settings, User, LogOut, CheckSquare, Megaphone, FileText, Wallet } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Rooms", href: "/admin/rooms", icon: Home },
    { name: "Tenants", href: "/admin/tenants", icon: User },
    { name: "Payments", href: "/admin/payments", icon: Wallet },
    { name: "Complaints", href: "/admin/complaints", icon: CheckSquare },
    // { name: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { name: "Reports", href: "/admin/reports", icon: FileText },
  ];

  const tenantLinks = [
    { name: "Dashboard", href: "/tenant/dashboard", icon: LayoutDashboard },
    { name: "Bills", href: "/tenant/bills", icon: FileText },
    { name: "Complaints", href: "/tenant/complaints", icon: CheckSquare },
    { name: "Profile", href: "/tenant/profile", icon: User },
  ];

  const links = role === "ADMIN" ? adminLinks : tenantLinks;

  return (
    <div className="w-20 md:w-64 border-r bg-white h-full flex flex-col items-center md:items-start py-8 px-4 transition-all duration-300">
      <div className="flex items-center gap-2 mb-10 w-full justify-center md:justify-start px-2">
        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
          A
        </div>
        <span className="font-bold text-xl hidden md:block tracking-wide uppercase">Anzelly</span>
      </div>

      <nav className="flex-1 w-full space-y-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-emerald-600 transition-colors group w-full justify-center md:justify-start"
            >
              <Icon className="w-6 h-6" />
              <span className="hidden md:block font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="w-full mt-auto">
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors w-full justify-center md:justify-start"
        >
          <LogOut className="w-6 h-6" />
          <span className="hidden md:block font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
}
