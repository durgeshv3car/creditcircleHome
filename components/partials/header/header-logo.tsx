'use client'
import React from 'react'
import { Link } from '@/components/navigation'
import DashCodeLogo from "@/components/dascode-logo"
import { useConfig } from '@/hooks/use-config'
import { useMediaQuery } from '@/hooks/use-media-query'

const HeaderLogo = () => {
    const [config] = useConfig();

    const isDesktop = useMediaQuery('(min-width: 1280px)');

    return (
        config.layout === 'horizontal' ? (
            <Link href="/dashboard" className="flex gap-2.5 items-center">
                <DashCodeLogo className="h-8 w-8" />
                <h1 className="text-xl font-bold tracking-tight lg:block hidden">
                    <span className="text-slate-900">CREDIT</span>{" "}
                    <span className="text-[#FF6B4A]">CIRCLE</span>
                </h1>
            </Link>
        ) :
            !isDesktop ? (
                <Link href="/dashboard" className="flex gap-2.5 items-center">
                    <DashCodeLogo className="h-8 w-8" />
                    <h1 className="text-xl font-bold tracking-tight">
                        <span className="text-slate-900">CREDIT</span>{" "}
                        <span className="text-[#FF6B4A]">CIRCLE</span>
                    </h1>
                </Link>
            ) : null
    )
}

export default HeaderLogo