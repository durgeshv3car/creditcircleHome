"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { columnsCategory } from "./columnsCategory";
import type { Categorys } from "./columnsCategory";
import type { ColumnDef } from "@tanstack/react-table";
import { fetchUsers } from "@/app/(protected)/services/adminUsers/api";
import { createLogs } from "@/app/(protected)/services/userLogs/api";

// Dynamic imports
const ExampleTwo = dynamic(() => import("../../../adminTable"), {
  ssr: false,
});

function Category({
  adminId,
  role,
  permissions,
}: {
  adminId: string;
  role: string;
  permissions: any;
}) {
  const router = useRouter();
  const [data, setData] = useState<Categorys[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [permissionList, setPermissionList] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<string>("1d");
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [date, setDate] = React.useState<Date>();
  const [startDateRange, setStartDateRange] = React.useState<string>("");
  const [endDateRange, setEndDateRange] = React.useState<string>("");

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    setEndDate(now);

    let start = new Date();
    start.setHours(0, 0, 0, 0);

    switch (value) {
      case "1w":
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
      case "1m":
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        break;
      case "6m":
        start = new Date(now);
        start.setMonth(now.getMonth() - 6);
        start.setHours(0, 0, 0, 0);
        break;
      default: // "1d"
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        break;
    }
    setStartDate(start);
  };
  const type = "user";

  const fetchData = async () => {
    try {
      const result = await fetchUsers();
      // const logs=await createLogs("User view list of admin-user section")
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  if (loading) return <Loader2 className="me-2 h-4 w-4 animate-spin" />;

  return (
    <>
      <div className="space-y-6">
        <ExampleTwo
          tableHeading="User List"
          tableData={data}
          tableColumns={
            columnsCategory({
              fetchData,
              router,
              adminId,
              open,
              setOpen,
              permissionList,
              setPermissionList,
            }) as ColumnDef<Categorys>[]
          }
          setRefresh={setRefresh}
          type={type}
          role={role}
          permissions={permissions}
          setDateRange={handleDateRangeChange}
          dateRange={dateRange}
          date={date}
          setDate={setDate}
        />
      </div>
    </>
  );
}

export default Category;
