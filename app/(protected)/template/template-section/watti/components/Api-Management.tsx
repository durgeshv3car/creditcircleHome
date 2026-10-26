"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import dynamic from "next/dynamic";
import { columnsCategory } from "./columnsCategory";
import type { Categorys } from "./columnsCategory";
import type { ColumnDef } from "@tanstack/react-table";
import { fetchWatti } from "@/app/(protected)/services/wattiTemplate/api";
import Loader from "@/components/loader";

const ExampleTwo = dynamic(() => import("../../../templateTable"), {
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

  const type = "watti";

  const fetchData = async () => {
    try {
      const result = await fetchWatti();
      setData(
        Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  if (loading) return <Loader className="min-h-[50vh] h-auto" />;

  return (
    <div className="space-y-6">
      <ExampleTwo
        tableHeading="Watti Templates"
        tableData={data}
        tableColumns={
          columnsCategory({
            fetchData,
            router,
          }) as ColumnDef<Categorys>[]
        }
        setRefresh={setRefresh}
        type={type}
        role={role}
        permissions={permissions}
        isLoading={loading}
      />
    </div>
  );
}

export default Category;
