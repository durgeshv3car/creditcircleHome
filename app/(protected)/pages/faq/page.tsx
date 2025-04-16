"use client";
import React, { useState, useEffect } from "react";

import ExampleTwo from "../example2";

import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

import { columnsCategory } from "./components/columnsCategory";
import { fetchfaq } from "@/app/(protected)/services/faqs/api";

function Category() {
  const allowed = ["superadmin", "admin"];
  const role = "admin";
  if (!allowed.includes(role)) {
    notFound();
  }
  const router = useRouter();
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const type = "faq";

  const fetchData = async () => {
    try {
      const result = await fetchfaq();
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
          tableHeading="Faq List"
          tableData={data}
          tableColumns={columnsCategory(fetchData, router)}
          setRefresh={setRefresh}
          type={type}
        />
      </div>
    </>
  );
}

export default Category;
