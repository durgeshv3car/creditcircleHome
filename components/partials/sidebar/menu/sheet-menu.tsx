'use client'
import { Link } from '@/i18n/routing';
import { MenuIcon, PanelsTopLeft } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/partials/sidebar/menu";
import {
    Sheet,
    SheetHeader,
    SheetTitle,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { MenuClassic } from "./menu-classic";
import DashCodeLogo from "@/components/dascode-logo";
import { useMobileMenuConfig } from "@/hooks/use-mobile-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useConfig } from "@/hooks/use-config";

export function SheetMenu() {
    const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();
    const [config, setConfig] = useConfig()
    const { isOpen } = mobileMenuConfig;

    const isDesktop = useMediaQuery("(min-width: 1280px)");
    if (isDesktop) return null;
    return (
        <Sheet open={isOpen} onOpenChange={() => setMobileMenuConfig({ isOpen: !isOpen })}>
            <SheetTrigger className="xl:hidden" asChild>
                <Button 
                    className="h-9 w-9 rounded-sm border border-slate-200/90 bg-white hover:bg-gradient-to-tr hover:from-orange-50/80 hover:to-amber-50/80 hover:border-orange-300 text-slate-700 hover:text-[#FF6B4A] shadow-sm hover:shadow-md hover:shadow-orange-500/10 active:scale-95 transition-all duration-200 flex items-center justify-center" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setConfig({
                        ...config, collapsed: false,
                    })} 
                >
                    <Icon icon="heroicons:bars-3-bottom-right" className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent 
                className="w-72 sm:w-80 p-0 h-full flex flex-col bg-gradient-to-b from-[#0B1740] via-[#0D1B48] to-[#111F50] text-slate-200 border-r border-white/[0.08] shadow-2xl" 
                side="left"
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
                    <Link 
                        href="/dashboard" 
                        className="group flex gap-2.5 items-center transition-all duration-200"
                        onClick={() => setMobileMenuConfig({ isOpen: false })}
                    >
                        <div className="transition-transform duration-200 group-hover:scale-105">
                            <DashCodeLogo className="h-8 w-8" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight select-none">
                            <span className="text-white">CREDIT</span>{" "}
                            <span className="text-[#FF6B4A]">CIRCLE</span>
                        </h1>
                    </Link>
                </div>
                <MenuClassic role="" permissions={[]} />
            </SheetContent>
        </Sheet>
    );
}
