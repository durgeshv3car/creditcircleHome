"use client";
import React, { CSSProperties } from 'react'
import { Link, usePathname } from "@/components/navigation";
import { useState } from "react";
import { ChevronDown, Dot, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";

import { Icon } from "@/components/ui/icon";
import { SubChildren } from '@/lib/menus';
import { useMobileMenuConfig } from '@/hooks/use-mobile-menu';




interface CollapseMenuButtonProps {
    icon?: string;
    label: string;
    active: boolean;
    submenus: SubChildren[]


}

export function MultiCollapseMenuButton({
    icon,
    label,
    active,
    submenus,



}: CollapseMenuButtonProps) {
    const pathname = usePathname();
    const isSubmenuActive = submenus.some((submenu) => submenu.active || pathname.startsWith(submenu.href));
    const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);
    const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig();
    return (

        <Collapsible
            open={isCollapsed}
            onOpenChange={setIsCollapsed}
            className="w-full mb-2 last:mb-0 "
        >
            <CollapsibleTrigger
                asChild
            >
                <div className='flex items-center group [&[data-state=open]>button>div>div>svg]:rotate-180 first:mt-1'>
                    <Button
                        variant="sidebar"
                        className={cn("group/multi w-full justify-start h-auto hover:!bg-white/[0.08] hover:!text-white rounded-sm capitalize text-sm font-medium py-2.5 px-3 text-slate-300 transition-all", {
                            "text-white font-medium bg-white/[0.12] ring-1 ring-white/10 hover:!bg-white/[0.16]": isCollapsed || active || isSubmenuActive
                        })}
                        fullWidth
                    >
                        <div className="w-full items-center flex justify-between">
                            <div className="flex items-center">
                                <span
                                    className={cn(
                                        "h-2 w-2 me-2.5 rounded-full transition-all duration-150 shrink-0",
                                        active
                                            ? "bg-white ring-2 ring-white/40 shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                                            : "bg-slate-400/60 ring-1 ring-slate-400/20 group-hover/multi:bg-white/80"
                                    )}
                                ></span>
                                <p className="max-w-[160px] truncate text-sm">
                                    {label}
                                </p>
                            </div>
                            <div
                                className={cn(
                                    "whitespace-nowrap inline-flex items-center justify-center rounded-full h-5 w-5 text-slate-400 group-hover:text-white transition-all duration-300",
                                    {
                                        'text-white': active || isSubmenuActive
                                    }
                                )}
                            >
                                <ChevronDown
                                    size={14}
                                    className="transition-transform duration-200"
                                />
                            </div>
                        </div>
                    </Button>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down pl-3 my-1 border-l border-white/[0.12] ml-3.5 space-y-1.5">
                {submenus.map(({ href, label, active }, index) => (
                    <Button
                        key={index}
                        onClick={() => setMobileMenuConfig({ ...mobileMenuConfig, isOpen: false })}
                        variant="sidebar"
                        className={cn('group/sub w-full justify-start h-auto mb-1 text-sm py-2 px-3 rounded-sm transition-all duration-200', {
                            'font-semibold text-white bg-gradient-to-r from-[#FF6B4A] to-[#F48220] shadow-md shadow-orange-500/25 ring-1 ring-white/20 hover:!from-[#E65A38] hover:!to-[#D9532F] hover:!text-white': active,
                            'text-slate-300 font-medium hover:!text-white hover:!bg-white/[0.08]': !active,
                        })}
                        asChild
                    >
                        <Link href={href} className="flex items-center w-full">
                            <span
                                className={cn(
                                    "h-2 w-2 me-2.5 rounded-full transition-all duration-200 shrink-0",
                                    active
                                        ? "bg-white ring-2 ring-white/40 shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                                        : "bg-slate-400/60 ring-1 ring-slate-400/20 group-hover/sub:bg-white/80"
                                )}
                            ></span>
                            <p className={cn("max-w-[170px] truncate text-sm transition-colors duration-200", active ? "text-white font-semibold" : "text-slate-300 group-hover/sub:text-white")}>
                                {label}
                            </p>
                        </Link>
                    </Button>
                ))}
            </CollapsibleContent>
        </Collapsible>

    )
}
