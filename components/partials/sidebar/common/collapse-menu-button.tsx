"use client";
import React, { CSSProperties } from 'react'
import { Link, usePathname } from "@/components/navigation";
import { useState } from "react";
import { ChevronDown, Dot, LucideIcon } from "lucide-react";
import { GripVertical } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Submenu } from "@/lib/menus"

// for dnd 

import {
    useSortable,
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useConfig } from '@/hooks/use-config';
import { MultiCollapseMenuButton } from './classic-multi-collapse-button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMobileMenuConfig } from '@/hooks/use-mobile-menu';
import { useMenuHoverConfig } from '@/hooks/use-menu-hover';


interface CollapseMenuButtonProps {
    icon: string;
    label: string;
    active: boolean;
    submenus: Submenu[];
    collapsed: boolean | undefined;
    id: string

}

export function CollapseMenuButton({
    icon,
    label,
    active,
    submenus,
    collapsed,
    id,

}: CollapseMenuButtonProps) {
    const pathname = usePathname();
    const isSubmenuActive = submenus.some((submenu) => submenu.active || pathname.startsWith(submenu.href));
    const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);
    const [mobileMenuConfig, setMobileMenuConfig] = useMobileMenuConfig()
    const [config] = useConfig();
    const [hoverConfig] = useMenuHoverConfig();
    const { hovered } = hoverConfig;
    const sidebarTheme = config.sidebarTheme !== 'light' ? `dark theme-${config.sidebarTheme}` : `theme-${config.sidebarTheme}`
    const isDesktop = useMediaQuery("(min-width: 1280px)");
    const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({
        id: id,

    })

    React.useEffect(() => {
        setIsCollapsed(isSubmenuActive);
    }, [isSubmenuActive, pathname]);


    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: "relative",
    };

    if (config.sidebar === 'compact' && isDesktop) {
        return (
            <Collapsible
                open={isCollapsed}
                onOpenChange={setIsCollapsed}


            >
                <CollapsibleTrigger

                    asChild
                >
                    <Button

                        variant={active ? "default" : "ghost"}
                        fullWidth
                        color={active ? 'default' : 'secondary'}
                        className={cn('flex-col h-auto py-1.5 px-3.5 capitalize font-semibold ring-offset-sidebar', {
                            'data-[state=open]:bg-secondary': !active
                        })}


                    >

                        <Icon icon={icon} className={cn('h-6 w-6 mb-1 ')} />

                        <p
                            className={cn(
                                "max-w-[200px]  text-[11px] truncate ",
                            )}
                        >
                            {label}
                        </p>


                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    {submenus.map(({ href, label, active }, index) => (


                        <Button
                            key={index}
                            color={active ? 'default' : 'secondary'}
                            variant="ghost"
                            fullWidth
                            size='sm'
                            className={cn('w-full justify-center text-center p-0  h-auto  hover:bg-transparent hover:text-default capitalize text-xs font-normal mb-2 first:mt-4 last:mb-0', {
                                'font-semibold': active
                            })}
                            asChild
                        >
                            <Link href={href}>

                                {label}
                            </Link>
                        </Button>

                    ))}
                </CollapsibleContent>
            </Collapsible>
        )
    }
    return !collapsed ? (
        <Collapsible
            open={isCollapsed}
            onOpenChange={setIsCollapsed}


        >
            <CollapsibleTrigger
                className=""
                asChild
            >
                <div className='peer flex items-center group [&[data-state=open]>button>div>div>svg]:rotate-180' >

                    <Button
                        style={style}
                        ref={setNodeRef}
                        variant="sidebar"
                        className={cn('justify-start capitalize group h-auto py-2.5 md:px-3 px-3 rounded-sm transition-all duration-200 ease-in-out', {
                            'hover:md:ps-8': config.sidebar === 'draggable' && isDesktop,
                            'bg-white/[0.12] text-white shadow-sm ring-1 ring-white/10 font-medium hover:!bg-white/[0.16] hover:!text-white': active || isSubmenuActive,
                            'text-slate-300 hover:!text-white hover:!bg-white/[0.08]': !(active || isSubmenuActive)
                        })}
                        fullWidth
                    >
                        <div className="w-full items-center flex justify-between">

                            <div className="flex items-center">
                                {config.sidebar === 'draggable' && isDesktop && (
                                    <GripVertical

                                        {...attributes} {...listeners} className={cn('inset-t-0 absolute me-1 h-5 w-5 ltr:-translate-x-6 rtl:translate-x-6 invisible opacity-0 group-hover:opacity-100 transition-all group-hover:visible ltr:group-hover:-translate-x-5 rtl:group-hover:translate-x-5 ', {

                                        })} />
                                )}
                                <span className={cn(
                                    "me-2.5 transition-transform duration-200 group-hover:scale-105 group-hover:translate-x-0.5",
                                    (active || isSubmenuActive) ? "text-white" : "text-slate-300 group-hover:text-white"
                                )}>
                                    <Icon icon={icon} className="h-5 w-5" />
                                </span>
                                <p
                                    className={cn(
                                        "max-w-[150px] truncate transition-colors duration-200",
                                        !collapsed
                                            ? "translate-x-0 opacity-100"
                                            : "-translate-x-96 opacity-0",
                                        (active || isSubmenuActive) ? "text-white font-medium" : "text-slate-300 group-hover:text-white"
                                    )}
                                >
                                    {label}
                                </p>
                            </div>
                            <div
                                className={cn(
                                    "whitespace-nowrap inline-flex items-center justify-center rounded-full h-5 w-5 transition-all duration-200 shadow-sm",
                                    !collapsed
                                        ? "translate-x-0 opacity-100"
                                        : "-translate-x-96 opacity-0",
                                    (active || isSubmenuActive)
                                        ? 'bg-[#FF6B4A]/40 text-white ring-1 ring-[#FF6B4A]/60'
                                        : 'bg-white/[0.08] text-slate-300 group-hover:text-white group-hover:bg-white/[0.16]'
                                )}
                            >
                                <ChevronDown
                                    size={13}
                                    className="transition-transform duration-300 ease-in-out"
                                />
                            </div>
                        </div>
                    </Button>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="border-l border-white/[0.12] pl-3 ml-4.5 my-1.5 space-y-1.5">
                {submenus.map(({ href, label, active, children: subChildren }, index) => (

                    subChildren?.length === 0 ? (
                        <Button
                            onClick={() => setMobileMenuConfig({ ...mobileMenuConfig, isOpen: false })}
                            key={index}
                            variant="sidebar"
                            className={cn('group/sub w-full justify-start h-auto py-2.5 px-3 rounded-sm transition-all duration-200', {
                                'bg-gradient-to-r from-[#FF6B4A] to-[#F48220] text-white font-semibold shadow-md shadow-orange-500/25 ring-1 ring-white/20 hover:!from-[#E65A38] hover:!to-[#D9532F] hover:!text-white': active,
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
                                          : "bg-slate-400/60 ring-1 ring-slate-400/20 group-hover/sub:bg-white/80 group-hover/sub:ring-white/30"
                                    )}
                                ></span>
                                <p
                                    className={cn(
                                        "max-w-[180px] truncate text-sm transition-colors duration-200",
                                        active ? "text-white font-semibold" : "text-slate-300 group-hover/sub:text-white",
                                        !collapsed
                                            ? "translate-x-0 opacity-100"
                                            : "-translate-x-96 opacity-0"
                                    )}
                                >
                                    {label}
                                </p>
                            </Link>
                        </Button>
                    ) : (
                        <React.Fragment key={index}>
                            <MultiCollapseMenuButton
                                label={label}
                                active={active ?? false}
                                submenus={subChildren as any}


                            />
                        </React.Fragment>
                    )


                ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    ) : (
        <DropdownMenu >
            <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={cn("w-10 h-10 mx-auto rounded-sm flex items-center justify-center transition-all duration-200", {
                                    "bg-gradient-to-r from-[#FF6B4A] to-[#F48220] text-white shadow-md shadow-orange-500/25 ring-1 ring-white/20": active || isSubmenuActive,
                                    "text-slate-300 hover:text-white hover:bg-white/[0.08]": !(active || isSubmenuActive),
                                })}
                                size="icon"
                            >
                                <Icon icon={icon} className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="start" alignOffset={2}>
                        {label}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent side="right" sideOffset={14} align="start" className="bg-[#0B1740] border border-white/[0.12] shadow-2xl text-slate-200 rounded-sm p-2 min-w-[200px] backdrop-blur-xl" >
                <DropdownMenuLabel className="max-w-[190px] truncate text-xs font-semibold text-white/90 px-2 py-1.5">
                    {label}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-white/[0.1] my-1' />
                <DropdownMenuGroup className="space-y-1">


                    {submenus.map(({ href, label, icon, active, children }, index) => (
                        children?.length === 0 ? (
                            <DropdownMenuItem key={index} asChild className={cn('rounded-sm cursor-pointer px-2.5 py-2 text-xs transition-colors', {
                                'bg-gradient-to-r from-[#FF6B4A] to-[#F48220] text-white font-semibold shadow-sm shadow-orange-500/25': active,
                                'text-slate-300 hover:text-white hover:bg-white/[0.08] focus:bg-white/[0.08] focus:text-white': !active
                            })}>
                                <Link className="cursor-pointer flex items-center gap-2.5 w-full" href={href}>
                                    {icon ? (
                                        <Icon icon={icon} className='h-4 w-4 shrink-0' />
                                    ) : (
                                        <span className={cn(
                                            "h-1.5 w-1.5 rounded-full shrink-0 transition-all",
                                            active 
                                              ? "bg-white ring-2 ring-white/40 shadow-[0_0_6px_rgba(255,255,255,0.7)]" 
                                              : "bg-slate-400/60"
                                        )} />
                                    )}
                                    <p className="max-w-[170px] truncate">{label}</p>
                                </Link>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuSub key={index}>
                                <DropdownMenuSubTrigger>
                                    <span>{label}</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <ScrollArea className='h-[200px]'>


                                            {children?.map(({ href, label, active }, index) => (


                                                <DropdownMenuItem key={`nested-index-${index}`}>
                                                    <Link href={href}>{label}</Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </ScrollArea>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        )


                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
