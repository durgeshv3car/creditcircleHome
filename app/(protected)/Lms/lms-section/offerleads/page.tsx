"use client";
import { useState, useEffect, useRef } from "react";

import dynamic from "next/dynamic";
import { fetchOfferLeads } from "../../../services/offerleads/api";

const ExampleTwo = dynamic(() => import("./table"), {
  loading: () => <p>Loading table...</p>,
  ssr: false,
});

const OfferLeadsPage = () => {
  const [selectedValues, setSelectedValues] = useState({
    source: "",
    title: null,
    category: null,
    user: "",
    phone: null,
  });

  const [columns, setColumns] = useState<any[]>([]);
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

  // Dynamically import columns
  useEffect(() => {
    const loadColumns = async () => {
      const mod = await import("./table/columns");
      setColumns(mod.columns);
    };
    loadColumns();
  }, []);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchOfferLeadsData = async () => {
      try {
        hasFetched.current = true;
        const result = await fetchOfferLeads();
        if (result.status === 404) {
          setData([]);
          return;
        }
        console.log("result", result);
        setData(result);
      } catch (error) {
        console.error("Error fetching offer leads:", error);
      }
    };

    fetchOfferLeadsData();
  }, [refresh]);

  const filteredData = data.filter((item) => {
    return (
      (!selectedValues.title?.trim() ||
        (item.offer?.title &&
          item.offer.title
            .toLowerCase()
            .includes(selectedValues.title.toLowerCase()))) &&
      (!selectedValues.category?.trim() ||
        (item.offer?.category &&
          item.offer.category
            .toLowerCase()
            .includes(selectedValues.category.toLowerCase()))) &&
      (!selectedValues.user?.trim() ||
        (item.user?.firstName &&
          item.user.firstName.toLowerCase() ===
            selectedValues.user.toLowerCase())) &&
      (!selectedValues.phone?.trim() ||
        (item.user?.phoneNumber &&
          item.user.phoneNumber.includes(selectedValues.phone)))
    );
  });

  return (
    <>
      <div className="mt-6  space-y-6">
        <ExampleTwo
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          tableData={filteredData}
          tableColumns={columns}
          setRefresh={setRefresh}
        />
      </div>
    </>
  );
};

export default OfferLeadsPage;
