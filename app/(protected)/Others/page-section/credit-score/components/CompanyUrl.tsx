"use client";
import React, { useState, useEffect } from "react";

import ExampleTwo from "../../../PageTable";

import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

import { columnsCategory } from "./columnsCategory";
import type { Category } from "./columnsCategory";
import { fetchcompanyUrl } from "@/app/(protected)/services/companyUrl/api";

function Category() {
  const allowed = ["superadmin", "admin"];
  const role = "admin";
  if (!allowed.includes(role)) {
    notFound();
  }
  const router = useRouter();
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const type = "creditScore";

  const fetchData = async () => {
    try {
      const result = await fetchcompanyUrl();
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
        <ExampleTwo<Category>
          tableHeading="Credit Score Url List"
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
