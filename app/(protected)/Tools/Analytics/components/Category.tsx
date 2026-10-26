"use client";
import React, { useState, useEffect } from "react";

import ExampleTwo from "../HomeTable";

import { notFound } from "next/navigation";
import { useRouter } from "@/i18n/routing";



import { columnsCategory } from "./columnsCategory";
import { fetchCategories } from "@/app/(protected)/services/categorys/api";
import { fetchNotificationsCount } from "../../../services/notifications/app/api";
import Loader from "@/components/loader";
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
  
        setData(Array.isArray(result?.counts) ? result.counts : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
  
 useEffect(() => {
  if (datesLoaded) {
    fetchData();
  }
}, [datesLoaded, refresh, startDate, endDate]);




  if (loading) return <Loader className="min-h-[50vh] h-auto" />;

  return (
    <div className="w-full space-y-6">
      <ExampleTwo
        tableHeading="Notification Analytics"
        tableData={data}
        tableColumns={columnsCategory(fetchData, router)}
        setRefresh={setRefresh}
        type={type}
        isLoading={loading}
      />
    </div>
  );
}

export default Category;
