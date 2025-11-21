"use client";

import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import { fetchNotificationsCount } from "../../services/notifications/app/api";

function AnalyticsPage() {
 interface AnalyticsData {
    total: number;
    sent: number;
    failed: number;
    offerTitle: string | null;
  }

  const [selectedOffer, setSelectedOffer] = useState("");
  const [data, setData] = useState<AnalyticsData>({
    total: 0,
    sent: 0,
    failed: 0,
    offerTitle: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
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

      if (selectedOffer && selectedOffer !== "All") {
        params.title = selectedOffer;
      }

      params.type = "application";

      const result = await fetchNotificationsCount(params);

      if (result.status === 404) {
        setData({ ...data, total: 0, sent: 0, failed: 0 });
        return;
      }

      setData(result.counts);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ❗ FIXED — replaced selectedValues with selectedOffer
  useEffect(() => {
    fetchData();
  }, [refresh, startDate, endDate, selectedOffer]);

  return (
    <div className="p-6">
      {/* Header + Right Side Filter */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Notification Data</h2>
        <Filter
          selectedOffer={selectedOffer}
          setSelectedOffer={setSelectedOffer}
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">
            {data.offerTitle ? data.offerTitle : "Total Notifications"}
          </h3>
          <p className="text-4xl font-bold mt-3">{data.total}</p>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Sent</h3>
          <p className="text-4xl font-bold mt-3 text-green-600">{data.sent}</p>
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Failed</h3>
          <p className="text-4xl font-bold mt-3 text-red-600">{data.failed}</p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
