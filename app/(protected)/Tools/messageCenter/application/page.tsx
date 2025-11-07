"use client";
import { useState, useEffect } from "react";

import ExampleTwo from "./table";
import { columns } from "./table/columns";
import { fetchNotifications } from "../../../services/notifications/app/api";
import {DataProps} from "./table/columns";

export type SelectedValues = {
  title: string | null;
  status: string | null;
  category: string | null;
  user: string;
  phone: string | null;
};




const NotificationCenterPage = () => {
  const [selectedValues, setSelectedValues] = useState<
   SelectedValues
  >({
    title: null,
    status: null,
    category: null,
    user: "",
    phone: null,
  });

  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
   const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] =useState(1);

  const fetchData = async () => {
    try {
      const params: any = {};
      if (currentPage) params.page = currentPage;
      if (pageSize) params.pageSize = pageSize;
      params.type="application"
      const result = await fetchNotifications(params);
      if (result.status === 404) {
        setData([]);
        return;
      }
      console.log("result", result);
      setData(result.data);
      setTotalPages(result.totalPages);
      setPageSize(result.totalRecords >= 20 ? pageSize : result.totalRecords);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh, currentPage, pageSize]);

  const filteredData = data.filter((item) => {
    return (
      (!selectedValues.title ||
        item.title.toLowerCase().includes(selectedValues.title.toLowerCase())) &&
      (!selectedValues.category ||
        (item.offer?.category &&
          item.offer.category.toLowerCase().includes(selectedValues.category.toLowerCase()))) &&
      (!selectedValues.user ||
        (item.user?.firstName && item.user.firstName === selectedValues.user)) &&
      (!selectedValues.phone ||
        (item.user?.phoneNumber && item.user.phoneNumber.includes(selectedValues.phone)))
    );
  });

  return (
    <>
      <div className="mt-6 space-y-6">
        <ExampleTwo
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          tableData={filteredData}
          tableColumns={columns}
          setRefresh={setRefresh}
           pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default NotificationCenterPage;
