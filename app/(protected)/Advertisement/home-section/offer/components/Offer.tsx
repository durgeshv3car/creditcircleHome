"use client";
import React, { useState, useEffect } from "react";

import ExampleTwo from "../../../HomeTable";

import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { RowData } from "./columnsRecommend";

import { columnsRecommend } from "./columnsRecommend";
import { fetchOffers } from "@/app/(protected)/services/offers/api";

function Users() {
  const router = useRouter();

  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [offerId, setOfferId] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const type = "offer";

  const fetchData = async () => {
    try {
      const result = await fetchOffers();
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
          tableColumns={columnsRecommend(
            setRefresh,
            router,
            setSelectedDate,
            open,
            setOpen,
            selectedDate,
            setOfferId,
            offerId
          )}
          setRefresh={setRefresh}
          type={type}
        />
      </div>
    </>
  );
}

export default Users;
