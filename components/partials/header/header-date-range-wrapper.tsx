"use client";

import { usePathname } from "next/navigation";
import { HeaderDateRange } from "./header-date-range";

export function HeaderDateRangeWrapper() {
  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return <HeaderDateRange />;
  }

  return null;
}
