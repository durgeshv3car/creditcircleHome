'use client'
import React from "react";
import DashCodeLogo from "./dascode-logo";
import { Link } from '@/i18n/routing';
import { useConfig } from "@/hooks/use-config";
import { useMenuHoverConfig } from "@/hooks/use-menu-hover";
import { useMediaQuery } from "@/hooks/use-media-query";



const Logo = () => {
    const [config] = useConfig()
    const [hoverConfig] = useMenuHoverConfig();
    const { hovered } = hoverConfig
    const isDesktop = useMediaQuery('(min-width: 1280px)');

    if (config.sidebar === 'compact') {
        return <Link href="/dashboard/analytics" className="flex gap-2 items-center   justify-center    ">
            <DashCodeLogo className="  text-default-900 h-8 w-8 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" />

        </Link>
    }
    if (config.sidebar === 'two-column' || !isDesktop) return null

    return (
        <Link href="/dashboard" className="group flex gap-2.5 items-center transition-all duration-200">
            <div className="transition-transform duration-200 group-hover:scale-105">
                <DashCodeLogo className="h-8 w-8" />
            </div>
            {!config?.collapsed && (
                <h1 className="text-xl font-bold tracking-tight select-none">
                    <span className="text-white">CREDIT</span>{" "}
                    <span className="text-[#FF6B4A]">CIRCLE</span>
                </h1>
            )}
        </Link>
    );
};

export default Logo;
