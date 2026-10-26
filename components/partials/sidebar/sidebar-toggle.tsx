'use client'
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/hooks/use-config";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Icon } from "@/components/ui/icon";
import { motion } from 'framer-motion';


export function SidebarToggle() {
    const [config, setConfig] = useConfig()
    const collapsed = config.collapsed
    const isDesktop = useMediaQuery('(min-width: 1280px)')
    if (!isDesktop) return null
    if (config.sidebar === 'two-column' && !config.hasSubMenu || config.menuHidden || config.layout === "horizontal") {
        return null
    }
    if (config.sidebar === 'two-column') {
        return (

            <Button
                onClick={() => setConfig((prevConfig) => ({ ...prevConfig, subMenu: !prevConfig.subMenu }))}
                className="h-9 w-9 rounded-sm border border-slate-200/90 bg-white hover:bg-gradient-to-tr hover:from-orange-50/80 hover:to-amber-50/80 hover:border-orange-300 text-slate-600 hover:text-[#FF6B4A] shadow-sm hover:shadow-md hover:shadow-orange-500/10 active:scale-95 transition-all duration-200 flex items-center justify-center group"
                variant="ghost"
                size="icon"
            >
                {config.subMenu ? (
                    <motion.div
                        key={config.subMenu ? 'collapsed' : 'expanded'}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Icon icon="heroicons:arrow-small-right-solid" className="h-5 w-5 group-hover:scale-105 transition-transform duration-200" />
                    </motion.div>
                ) : (
                    <motion.div
                        key={config.subMenu ? 'collapsed' : 'expanded'}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Icon icon="heroicons:bars-3-bottom-left-solid" className="h-5 w-5 group-hover:scale-105 transition-transform duration-200" />
                    </motion.div>
                )}
            </Button>

        )
    }
    return (

        <Button
            onClick={() => setConfig({ ...config, collapsed: !collapsed })}
            className="h-9 w-9 rounded-sm border border-slate-200/90 bg-white hover:bg-gradient-to-tr hover:from-orange-50/80 hover:to-amber-50/80 hover:border-orange-300 text-slate-600 hover:text-[#FF6B4A] shadow-sm hover:shadow-md hover:shadow-orange-500/10 active:scale-95 transition-all duration-200 flex items-center justify-center group"
            variant="ghost"
            size="icon"
        >
            {collapsed ? (
                <motion.div
                    key={collapsed ? 'collapsed' : 'expanded'}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Icon icon="heroicons:arrow-small-right-solid" className="h-5 w-5 group-hover:scale-105 transition-transform duration-200" />
                </motion.div>
            ) : (
                <motion.div
                    key={collapsed ? 'collapsed' : 'expanded'}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Icon icon="heroicons:bars-3-bottom-left-solid" className="h-5 w-5 group-hover:scale-105 transition-transform duration-200" />
                </motion.div>
            )}
        </Button>

    );
}