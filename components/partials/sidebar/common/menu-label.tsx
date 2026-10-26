'use client'
import { cn } from "@/lib/utils"
import { useConfig } from '@/hooks/use-config'
import React from 'react'

const MenuLabel = ({ label, className }: { label: string, className?: string }) => {
    const [config] = useConfig()
    if (config.sidebar === 'compact') return null
    return (
        <p className={cn('text-[11px] font-semibold text-slate-400/70 tracking-wider py-3 px-3 max-w-[248px] truncate uppercase', className)}>
            {label}
        </p>
    )
}

export default MenuLabel