"use client";
import React, { useCallback,useState, useEffect } from "react";

import ExampleTwo from "../../../LoanTable";

import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

import { columnsRecommend } from "./columnsRecommend";
import { fetchServices } from "@/app/(protected)/services/ourServices/api";
import { RowData } from "./columnsRecommend";
import Loader from "@/components/loader";

function Users() {
  const allowed = ["superadmin", "admin"];
  const role = "admin";
  if (!allowed.includes(role)) {
    notFound();
  }
  const router = useRouter();

  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  
  const type= "stockmarket";

  const fetchData = useCallback(async () => {
    try {
      const result = await fetchServices(type);
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchData();
  }, [refresh,fetchData]);

  if (loading) return <Loader className="min-h-[50vh] h-auto" />;
  return (
    <>
      <div className="space-y-6">
        <ExampleTwo
          tableHeading="StockMarket List"
          tableData={data}
          tableColumns={columnsRecommend({setRefresh,type,router})}
          setRefresh={setRefresh}
          type={type}
        />
      </div>
    </>
  );
}

export default Users;
