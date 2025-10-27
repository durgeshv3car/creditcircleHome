"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { columnsCategory } from "./columnsCategory";
import type { Categorys } from "./columnsCategory";
import type { ColumnDef } from "@tanstack/react-table";
import { fetchLogs } from "@/app/(protected)/services/userLogs/api";
import { createLogs } from "@/app/(protected)/services/userLogs/api";

// Dynamic imports
const ExampleTwo = dynamic(() => import("../../../adminTable"), {
  ssr: false,
});

function Category({
  adminId,
  role,
  permissions,
  token,
}: {
  adminId: string;
  role: string;
  permissions: any;
  token: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<Categorys[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [pageSize, setPageSize] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  // Load dates from localStorage
  useEffect(() => {
    const storedStart = localStorage.getItem("startDateLogs");
    const storedEnd = localStorage.getItem("endDateLogs");

    if (storedStart && storedEnd) {
      setStartDate(storedStart);
      setEndDate(storedEnd);
    }
  }, []);

  const type = "logs";

  const fetchData = async () => {
    try {
      const result = await fetchLogs(
        currentPage,
        pageSize,
        startDate,
        endDate,
        token
      );
      // const logs=await createLogs("User view user-logs section list")
      console.log(result, "results");
      setData(result.data);
      setTotalPages(result.totalPages);
      setPageSize(result.totalRecords >= 20 ? 20 : result.totalRecords);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh, currentPage, pageSize, startDate, endDate]);

  if (loading) return <Loader2 className="me-2 h-4 w-4 animate-spin" />;

  return (
    <>
      <div className="space-y-6">
        <ExampleTwo
          tableHeading="User-Logs List"
          tableData={data}
          tableColumns={
            columnsCategory({
              fetchData,
              router,
              token,
            }) as ColumnDef<Categorys>[]
          }
          setRefresh={setRefresh}
          type={type}
          role={role}
          permissions={permissions}
          token={token}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}

export default Category;
