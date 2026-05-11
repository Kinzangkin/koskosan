import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  href?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend = "neutral", href }: StatCardProps) {
  const CardContent = (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow cursor-pointer">
      <h3 className="text-slate-500 font-medium text-sm flex items-center justify-between">
        {title}
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      </h3>
      
      <div>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
        <div className={`text-xs mt-1 font-medium ${
          trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-slate-400'
        }`}>
          {trend === 'up' && '↑ '}
          {trend === 'down' && '↓ '}
          {subtitle}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
