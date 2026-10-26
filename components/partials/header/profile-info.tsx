import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { signOut, auth } from "@/lib/auth";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  email: string;

}

const ProfileInfo = async () => {
  const session = await auth();
  let role = "";
  let email = "";

  if (session?.user && 'token' in session.user) {
    const decoded = jwtDecode<DecodedToken>((session.user as { token: string }).token);
    email = decoded.email;
    role = decoded.role;
  }

  const getInitials = (str: string) => {
    if (!str) return "AS";
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(role);

  return (
    <div className="md:block hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <button
            type="button"
            className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1 rounded-sm border border-slate-200/90 bg-white hover:bg-slate-50/90 hover:border-orange-300 shadow-sm hover:shadow-md hover:shadow-orange-500/10 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-orange-500/20 data-[state=open]:border-orange-400 data-[state=open]:shadow-md data-[state=open]:shadow-orange-500/15"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-sm bg-gradient-to-tr from-[#FF6B4A] to-[#F48220] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-orange-500/25 ring-1 ring-white transition-transform duration-200 group-hover:scale-105">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="flex flex-col text-left lg:block hidden">
              <span className="text-xs font-bold text-slate-800 capitalize block tracking-tight group-hover:text-[#FF6B4A] transition-colors">
                {role || "Super Admin"}
              </span>
            </div>
            <span className="text-slate-400 group-hover:text-[#FF6B4A] transition-transform duration-300 lg:inline-block hidden group-data-[state=open]:rotate-180">
              <Icon icon="heroicons-outline:chevron-down" className="w-3.5 h-3.5" />
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 p-2 rounded-sm bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/10 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200" align="end" sideOffset={8}>
          {/* Light-themed Hero Card */}
          <div className="relative overflow-hidden p-3.5 rounded-sm bg-gradient-to-br from-slate-50 via-orange-50/40 to-amber-50/30 border border-orange-100/80 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-gradient-to-tr from-[#FF6B4A] to-[#F48220] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-orange-500/25 ring-1 ring-white shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900 capitalize truncate tracking-tight">
                  {role || "Super Admin"}
                </div>
                <div className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                  <Icon icon="heroicons:envelope" className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0" />
                  <span className="truncate font-medium">{email || "admin@creditcircle.com"}</span>
                </div>
              </div>
            </div>
          </div>


          <DropdownMenuSeparator className="my-2 bg-slate-100" />

          {/* Sign Out Button */}
          <DropdownMenuItem asChild className="rounded-sm px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 cursor-pointer transition-all duration-150 focus:bg-rose-50 focus:text-rose-700 group">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
              className="w-full"
            >
              <button
                type="submit"
                className="w-full flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-rose-100/70 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-200">
                    <Icon icon="heroicons:power" className="w-3.5 h-3.5" />
                  </div>
                  <span>Log out</span>
                </div>
                <Icon icon="heroicons:arrow-right-on-rectangle" className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ProfileInfo;
