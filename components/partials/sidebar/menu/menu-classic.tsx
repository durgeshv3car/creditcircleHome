"use client";

import React from "react";
import { Ellipsis, LogOut } from "lucide-react";
import { usePathname } from "@/components/navigation";
import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menus";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useConfig } from "@/hooks/use-config";
import MenuLabel from "../common/menu-label";
import MenuItem from "../common/menu-item";
import { CollapseMenuButton } from "../common/collapse-menu-button";


import { useParams } from "next/navigation";

import { getLangDir } from "rtl-detect";
import Logo from "@/components/logo";
import { useMenuHoverConfig } from "@/hooks/use-menu-hover";
import { useMediaQuery } from "@/hooks/use-media-query";



export function MenuClassic({role,permissions}: { role: string,permissions: string[]; }) {
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();
  const direction = getLangDir(params?.locale ?? "");

  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const menuList = getMenuList(pathname, role,permissions);
  const [config, setConfig] = useConfig();
  const collapsed = config.collapsed;
  const [hoverConfig] = useMenuHoverConfig();
  const { hovered } = hoverConfig;

  const scrollableNodeRef = React.useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (
        scrollableNodeRef.current &&
        scrollableNodeRef.current.scrollTop > 0
      ) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current?.addEventListener("scroll", handleScroll);
  }, [scrollableNodeRef]);


  return (
    <>
      {isDesktop && (
        <div className={cn("flex items-center border-b border-white/[0.08] bg-white/[0.02] transition-all duration-300", {
          "px-5 py-4": !collapsed,
          "justify-center px-2 py-4": collapsed,
        })}>
          <Logo />
        </div>
      )}

      <ScrollArea className="[&>div>div[style]]:!block" dir={direction}>
        <nav className="mt-4 h-full w-full">
          <ul className={cn("h-full flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1.5 pb-8 transition-all duration-300", {
            "px-3.5": !collapsed,
            "px-2 items-center": collapsed
          })}>
            {menuList?.map(({ groupLabel, menus }, index) => (
              <li className={cn("w-full", groupLabel ? "" : "")} key={index}>
                {!collapsed && groupLabel ? (
                  <MenuLabel label={groupLabel} />
                ) : collapsed && groupLabel ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger className="w-full">
                        <div className="w-full flex justify-center items-center py-1">
                          <Ellipsis className="h-4 w-4 text-slate-500" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{groupLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}

                {menus.map(
                  ({ href, label, icon, active, id, submenus }, index) =>
                    submenus.length === 0 ? (
                      <div className="w-full mb-2 last:mb-0" key={index}>
                        <TooltipProvider disableHoverableContent>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <div>
                                <MenuItem
                                  label={label}
                                  icon={icon}
                                  href={href}
                                  active={active ?? false}
                                  id={id}
                                  collapsed={collapsed}
                                />
                              </div>
                            </TooltipTrigger>
                            {collapsed && (
                              <TooltipContent side="right">
                                {label}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div className="w-full mb-2" key={index}>
                        <CollapseMenuButton
                          icon={icon}
                          label={label}
                          active={active ?? false}
                          submenus={submenus}
                          collapsed={collapsed}
                          id={id}
                        />
                      </div>
                    )
                )}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </>
  );
}
