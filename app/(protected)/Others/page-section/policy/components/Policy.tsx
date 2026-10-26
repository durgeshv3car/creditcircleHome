"use client";
import React, { useState, useEffect } from "react";

import ExampleTwo from "../../../PageTable";

import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

import { columnsCategory } from "./columnsCategory";
import { fetchpolicy } from "@/app/(protected)/services/policys/api";
import type { Category } from "./columnsCategory";
import Loader from "@/components/loader";

function PolicyPage() {
  const allowed = ["superadmin", "admin"];
  const role = "admin";
  if (!allowed.includes(role)) {
    notFound();
  }
  const router = useRouter();

  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const type = "policy";

  const fetchData = async () => {
    try {
      const result = await fetchpolicy();
      if (!result || result.status === 404) {
        setData([]);
        return;
      }

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
      <ExampleTwo<Category>
        tableHeading="Policy List"
        tableData={data}
        tableColumns={columnsCategory(fetchData, router)}
        setRefresh={setRefresh}
        type={type}
        isLoading={loading}
      />
    </div>
  );
}

export default PolicyPage;
