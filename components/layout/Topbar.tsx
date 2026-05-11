import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <div className="h-20 w-full flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-slate-800">Welcome home!</h1>
        <p className="text-sm text-slate-500">Manage your property efficiently</p>
      </div>

      <div className="flex items-center gap-6">
        {/* <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search..." 
            className="w-64 pl-10 bg-slate-100 border-none rounded-full"
          />
        </div> */}

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-800">Admin User</span>
            <span className="text-xs text-slate-500">Administrator</span>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
