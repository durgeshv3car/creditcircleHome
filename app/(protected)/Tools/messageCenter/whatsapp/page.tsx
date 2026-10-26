"use client";

import { useState, useEffect } from "react";
import ExampleTwo from "./table";
import { columns } from "./table/columns";
import { fetchNotifications } from "../../../services/notifications/whatsapp/api";
import { DataProps } from "./table/columns";
import Loader from "@/components/loader";

export type SelectedValues = {
  title: string | null;
  status: string | null;
  category: string | null;
  user: string;
  phone: string | null;
};

const NotificationCenterPage = () => {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
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
      setLoading(true);
      const result = await fetchNotifications();
      if (!result || result.status === 404 || result.error) {
        setData([]);
        return;
      }

      let items: DataProps[] = [];
      if (Array.isArray(result)) {
        items = result;
      } else if (Array.isArray(result.data)) {
        items = result.data;
      } else if (Array.isArray(result.notifications)) {
        items = result.notifications;
      }

      setData(items);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const safeData = Array.isArray(data) ? data : [];
  const filteredData = safeData.filter((item) => {
    if (!item) return false;
    const titleMatch =
      !selectedValues.title ||
      (item.title &&
        item.title.toLowerCase().includes(selectedValues.title.toLowerCase()));

    const categoryMatch =
      !selectedValues.category ||
      (item.offer?.category &&
        item.offer.category
          .toLowerCase()
          .includes(selectedValues.category.toLowerCase()));

    const userMatch =
      !selectedValues.user ||
      (item.user?.firstName && item.user.firstName === selectedValues.user);

    const phoneMatch =
      !selectedValues.phone ||
      (item.user?.phoneNumber &&
        item.user.phoneNumber.includes(selectedValues.phone));

    return titleMatch && categoryMatch && userMatch && phoneMatch;
  });

  if (loading) return <Loader className="min-h-[50vh] h-auto" />;

  return (
    <div className="w-full space-y-6">
      <ExampleTwo
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        tableData={filteredData}
        tableColumns={columns}
        setRefresh={setRefresh}
        isLoading={loading}
      />
    </div>
  );
};

export default NotificationCenterPage;
