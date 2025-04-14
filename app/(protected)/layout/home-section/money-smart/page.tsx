"use client";
import React, { useState, useEffect } from "react";

import ExampleTwo from "../../example2";

import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

import { columnsMoney } from "./components/columnsMoney";
import { fetchMoney } from "@/app/(protected)/services/moneySmart/api";

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
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const type = "money";

  const fetchData = async () => {
    try {
      const result = await fetchMoney();
      if (result.status == 404) {
        setData([]);
        return;
      }

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
          tableHeading="Money List"
          tableData={data}
          tableColumns={columnsMoney(
            fetchData,
            router,
            setSelectedDate,
            selectedDate,
            open,
            setOpen
          )}
          setRefresh={setRefresh}
          type={type}
        />
      </div>
    </>
  );
}

export default Users;
