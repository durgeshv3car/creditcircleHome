"use client";
import { useState, useEffect } from "react";

import ExampleTwo from "./table";
import { columns } from "./table/columns";
import { fetchNotifications } from "../../../services/notifications/app/api";
import { DataProps } from "./table/columns";
import Loader from "@/components/loader";

export type SelectedValues = {
  title: string | null;
  status: string | null;
  counter: string | null;
  category: string | null;
  user: string;
  phone: string | null;
};

const NotificationCenterPage = () => {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    title: null,
    status: null,
    counter: null,
    category: null,
    user: "",
    phone: null,
  });

  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [datesLoaded, setDatesLoaded] = useState(false);


 useEffect(() => {
  const storedStart = localStorage.getItem("startDateTools");
  const storedEnd = localStorage.getItem("endDateTools");

  if (storedStart) setStartDate(storedStart);
  if (storedEnd) setEndDate(storedEnd);

  setDatesLoaded(true); // ✅ signal ready
}, []);


  const fetchData = async () => {
    try {
      const params: any = {};

      // ✅ Reset pagination when "All" is selected
      if (selectedValues.title === "All" || selectedValues.status === "All") {
        params.page = 1;
        params.pageSize = 20;
      } else {
        if (currentPage) params.page = currentPage;
        if (pageSize) params.pageSize = pageSize;
      }

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      if (selectedValues.title && selectedValues.title !== "All")
        params.title = selectedValues.title;

      if (selectedValues.status && selectedValues.status !== "All")
        params.status = selectedValues.status;

      if (selectedValues.counter && selectedValues.counter!=="All") {
        params.counter = selectedValues.counter;
      }

      params.type = "application";

      const result = await fetchNotifications(params);

      if (result.status === 404) {
        setData([]);
        return;
      }

      setData(Array.isArray(result?.data) ? result.data : []);
      setTotalPages(result?.totalPages || 0);
      setRecordsCount(result?.totalRecords || 0);

      // ✅ Reset page size back to 20 when "All" is selected
      if (selectedValues.title === "" || selectedValues.status === "" || selectedValues.counter==="") {
        setPageSize(20);
      } else {
        setPageSize(result?.totalRecords >= 20 ? pageSize : result?.totalRecords || 20);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (!datesLoaded) return; 

  fetchData();
}, [refresh, currentPage, pageSize, startDate, endDate, selectedValues, datesLoaded]);


  const safeData = Array.isArray(data) ? data : [];
  const filteredData = safeData.filter((item) => {
    if (!item) return false;
    return (
      (!selectedValues.title ||
        (item.title &&
          item.title
            .toLowerCase()
            .includes(selectedValues.title.toLowerCase()))) &&
      (!selectedValues.category ||
        (item.offer?.category &&
          item.offer.category
            .toLowerCase()
            .includes(selectedValues.category.toLowerCase()))) &&
      (!selectedValues.user ||
        (item.user?.firstName &&
          item.user.firstName === selectedValues.user)) &&
      (!selectedValues.phone ||
        (item.user?.phoneNumber &&
          item.user.phoneNumber.includes(selectedValues.phone)))
    );
  });

  if (loading) return <Loader className="min-h-[50vh] h-auto" />;

  return (
    <div className="w-full space-y-6">
      <ExampleTwo
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        tableData={filteredData}
        tableColumns={columns({
          pageSize,
          totalPages,
          currentPage,
          recordsCount,
        })}
        setRefresh={setRefresh}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        recordsCount={recordsCount}
        isLoading={loading}
      />
    </div>
  );
};

export default NotificationCenterPage;
