"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { hexToRGB } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react"
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon"

const ThemeButton = () => {
    const { theme, setTheme } = useTheme();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" rounded="full" className="h-9 w-9 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600 hover:text-slate-900 shadow-sm transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 hover:ring-0">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-600" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-600" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1.5 rounded-lg bg-white border border-slate-200/90 shadow-xl min-w-[140px]">
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className={cn(
                        "flex items-center gap-2 px-2.5 py-2 text-xs font-medium rounded-md cursor-pointer transition-colors mb-0.5",
                        theme === "light"
                            ? "bg-[#FFF1ED] text-[#EA580C] font-semibold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                >
                    <Icon icon="heroicons-outline:sun" className="w-4 h-4 text-amber-500" />
                    <span>Light</span>
                    <Check
                        className={cn("w-3.5 h-3.5 ml-auto text-[#FF6B4A]", {
                            hidden: theme !== "light",
                        })}
                    />
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className={cn(
                        "flex items-center gap-2 px-2.5 py-2 text-xs font-medium rounded-md cursor-pointer transition-colors mb-0.5",
                        theme === "dark"
                            ? "bg-[#FFF1ED] text-[#EA580C] font-semibold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                >
                    <Icon icon="heroicons-outline:moon" className="w-4 h-4 text-[#FF6B4A]" />
                    <span>Dark</span>
                    <Check
                        className={cn("w-3.5 h-3.5 ml-auto text-[#FF6B4A]", {
                            hidden: theme !== "dark",
                        })}
                    />
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className={cn(
                        "flex items-center gap-2 px-2.5 py-2 text-xs font-medium rounded-md cursor-pointer transition-colors",
                        theme === "system"
                            ? "bg-[#FFF1ED] text-[#EA580C] font-semibold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                >
                    <Icon icon="heroicons:computer-desktop" className="w-4 h-4 text-slate-500" />
                    <span>System</span>
                    <Check
                        className={cn("w-3.5 h-3.5 ml-auto text-[#FF6B4A]", {
                            hidden: theme !== "system",
                        })}
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ThemeButton;
