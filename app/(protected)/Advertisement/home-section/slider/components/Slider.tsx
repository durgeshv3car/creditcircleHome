"use client";
import React, { useState, useEffect } from "react";
import ExampleTwo from "../../../HomeTable";


import { useRouter } from "next/navigation";
import { columnsSlider } from "./columnsSlider";
import { fetchSliderImages } from "@/app/(protected)/services/sliders/api";
import { SliderData } from "./columnsSlider";

function Users() {
  
  const router = useRouter();

  const [data, setData] = useState<SliderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [open, setOpen] = React.useState(false);
  const [offerId, setOfferId] = useState<string>("");

  const type = "slider";

  const fetchData = async () => {
    try {
      const result = await fetchSliderImages(type);

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
          tableHeading="Slider List"
          tableData={data}
          tableColumns={columnsSlider({
            fetchData,
            router,
            setSelectedDate,
            selectedDate,
            open,
            setOpen,
            setOfferId,
            offerId
          })}
          setRefresh={setRefresh}
          type={type}
        />
      </div>
    </>
  );
}

export default Users;
