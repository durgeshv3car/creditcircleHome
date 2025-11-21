"use client";
import React, { useState, useEffect } from "react";

import ExampleTwo from "../HomeTable";

import { notFound } from "next/navigation";
import { useRouter } from "@/i18n/routing";



import { columnsCategory } from "./columnsCategory";
import { fetchCategories } from "@/app/(protected)/services/categorys/api";
import { fetchNotificationsCount } from "../../../services/notifications/app/api";
interface Category {
  offerId: string;
  offerTitle: string;
  total: number;
  sent: number;
  failed: number;
}

function Category() {
  const allowed = ["Super Admin", "Admin"];
  const role = "Admin";
  if (!allowed.includes(role)) {
    notFound();
  }
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const type = "category";


    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [datesLoaded, setDatesLoaded] = useState(false);


    
  
    useEffect(() => {
      const storedStart = localStorage.getItem("startDateToolsAna");
      const storedEnd = localStorage.getItem("endDateToolsAna");
  
      if (storedStart && storedEnd) {
        setStartDate(storedStart);
        setEndDate(storedEnd);
      }
      setDatesLoaded(true);
    }, []);
    console.log(data);
    const fetchData = async () => {
      try {
        const params: any = {};
  
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
  
  
        params.type = "application";
  
        const result = await fetchNotificationsCount(params);
  
        if (result.status === 404) {
          setData([]);
          return;
        }
  
        setData(result.counts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
 useEffect(() => {
  if (datesLoaded) {
    fetchData();
  }
}, [datesLoaded, refresh, startDate, endDate]);




  if (loading) return <p>Loading...</p>;
  return (
    <>
      <div className="space-y-6">
        <ExampleTwo
          tableHeading="Analytics List"
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
