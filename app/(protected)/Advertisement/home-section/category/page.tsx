"use client";
import React, { useState, useEffect } from "react";

import ExampleTwo from "../../HomeTable";

import { notFound } from "next/navigation";
import { useRouter } from "@/i18n/routing";



import { columnsCategory } from "./components/columnsCategory";
import { fetchCategories } from "@/app/(protected)/services/categorys/api";
interface DataProps {
  id: string;
  title: string;

 
}

function Category() {
  const allowed = ["Super Admin", "Admin"];
  const role = "Admin";
  if (!allowed.includes(role)) {
    notFound();
  }
  const router = useRouter();
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const type = "category";
  const fetchData = async () => {
    try {
      const result = await fetchCategories();
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
        <ExampleTwo<DataProps>
          tableHeading="Category List"
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
