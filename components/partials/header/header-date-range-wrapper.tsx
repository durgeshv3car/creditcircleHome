"use client";

import { usePathname } from "next/navigation";
import { HeaderDateRange } from "./header-date-range";
import { HeaderDateRangeApi } from "./header-date-range-api";

export function HeaderDateRangeWrapper() {
  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return <HeaderDateRange />;
  }
  if (pathname === "/Admin/admin-section/api-management"){
    return <HeaderDateRangeApi />;
  }

  return null;
}
