"use client";
import React, { useState, useEffect } from "react";

import ExampleTwo from "../../example2";

import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

import { columnsRecommend } from "./components/columnsRecommend";
import { fetchServices } from "@/app/(protected)/services/ourServices/api";

function Users() {
  const allowed = ["superadmin", "admin"];
  const role = "admin";
  if (!allowed.includes(role)) {
    notFound();
  }
  const router = useRouter();

  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  
  const [type,setType] = useState<string>("stockmarket");

  const fetchData = async () => {
    try {
      const result = await fetchServices(type);
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

  if (loading) return <p>Loading...</p>;
  return (
    <>
      <div className="space-y-6">
        <ExampleTwo
          tableHeading="StockMarket List"
          tableData={data}
          tableColumns={columnsRecommend(setRefresh,type,router)}
          setRefresh={setRefresh}
          type={type}
        />
      </div>
    </>
  );
}

export default Users;
