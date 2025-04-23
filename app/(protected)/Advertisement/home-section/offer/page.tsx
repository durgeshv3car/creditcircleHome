"use client";
import React, { useState, useEffect } from "react";

import ExampleTwo from "../../HomeTable";

import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

import { columnsRecommend } from "./components/columnsRecommend";
import { fetchOffers } from "@/app/(protected)/services/offers/api";

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
  const type = "offer";

  const fetchData = async () => {
    try {
      const result = await fetchOffers();
      console.log("result", result.status);
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
          tableHeading="Offer List"
          tableData={data}
          tableColumns={columnsRecommend(setRefresh, router)}
          setRefresh={setRefresh}
          type={type}
        />
      </div>
    </>
  );
}

export default Users;
