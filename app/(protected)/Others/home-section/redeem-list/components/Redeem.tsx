"use client";
import React, { useState, useEffect } from "react";

import ExampleTwo from "../../../HomeTable";

import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

import { columnsRefer } from "./columnsRefer";
import { fetchRedeemItems } from "@/app/(protected)/services/redeemList/api";
import Loader from "@/components/loader";

interface LogoData {
  id: string;
  title: string;
  points: string;
  thumbnail: string | { web?: string; mobile?: string };
  companyUrl: string;
  active: boolean;
}

function Users() {
  const router = useRouter();

  const [data, setData] = useState<LogoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [open, setOpen] = React.useState(false);
  const type = "redeem";

  const fetchData = async () => {
    try {
      const result = await fetchRedeemItems();
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
      <ExampleTwo<LogoData>
        tableHeading="Redeem List"
        tableData={data}
        tableColumns={columnsRefer({
          fetchData,
          router,
          setSelectedDate,
          selectedDate,
          open,
          setOpen,
        })}
        setRefresh={setRefresh}
        type={type}
        isLoading={loading}
      />
    </div>
  );
}

export default Users;
