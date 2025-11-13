"use client";

import { usePathname } from "next/navigation";
import { HeaderDateRange } from "./header-date-range";
import { HeaderDateRangeApi } from "./header-date-range-api";
import { HeaderDateRangeLead } from "./header-date-range-leads";
import { HeaderDateRangeLoan } from "./header-date-range-loans";
import { HeaderDateRangeLogs } from "./header-date-range-logs";
import {HeaderDateRangeTools} from "./header-date-range-tools"

export function HeaderDateRangeWrapper() {
  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return <HeaderDateRange />;
  }
  if (pathname === "/Admin/admin-section/api-management"){
    return <HeaderDateRangeApi />;
  }
    if (pathname === "/Lms/lms-section/leads"){
    return <HeaderDateRangeLead />;
  }
    if (pathname === "/Lms/lms-section/loanapplications"){
    return <HeaderDateRangeLoan />;
  }
  if (pathname === "/Admin/admin-section/user-logs"){
    return <HeaderDateRangeLogs />;
  }
  if (pathname === "/Tools/messageCenter/application"){
    return <HeaderDateRangeTools />;
  }

  return null;
}
