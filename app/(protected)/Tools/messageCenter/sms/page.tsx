"use client";
import { useState, useEffect } from "react";

import ExampleTwo from "./table";
import { columns } from "./table/columns";
import { fetchNotifications } from "../../../services/notifications/app/api";

const NotificationCenterPage = () => {
  const [selectedValues, setSelectedValues] = useState({
    title: null,
    status: null,
    category: null,
    user: "",
    phone: null,
  });

  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const fetchData = async () => {
    try {
      const result = await fetchNotifications();
      if (result.status == 404) {
        setData([]);
        return;
      }
      console.log("result", result);
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

  const filteredData = data.filter((item) => {
    return (
      (!selectedValues.title ||
        item.title
          .toLowerCase()
          .includes(selectedValues.title.toLowerCase())) &&
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

  return (
    <>
    <div className="text-xl  font-medium">Notifications Data</div>
    <div className="bg-white p-3 mt-5 shadow rounded-md">
      
      <div className="  space-y-6">
      
            <ExampleTwo
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              tableData={filteredData}
              tableColumns={columns}
              setRefresh={setRefresh}
            />
          
      </div>
    </div>
    </>
  );
};

export default NotificationCenterPage;
