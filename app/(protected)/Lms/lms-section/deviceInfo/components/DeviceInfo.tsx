"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchDevices } from "@/app/(protected)/services/deviceInfo/api";
import { DataProps } from "../../loanapplications/table/columns";

const ExampleTwo = dynamic(() => import("../table"), {
  loading: () => <p>Loading table...</p>,
  ssr: false,
});

export type SelectedValues = {
  [key: string]: string[]; // ✅ This enables dynamic keys
};

const LeadPage = ({ token }: { token: string }) => {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    phoneNumber: [],
    brand: [],
  });



  const [columns, setColumns] = useState<any[]>([]);
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsCount, setRecordsCount] = useState<number>(0);

  // New state for filter options
  const [allFilterOptions, setAllFilterOptions] = useState<{
    phoneNumber: string[];
    brand: string[];
  }>({
    phoneNumber: [],
    brand: [],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const activeFilters = {
        page: currentPage,
        pageSize: pageSize,
        phoneNumber: selectedValues.phoneNumber,
        brand: selectedValues.brand,
      };

      const result = await fetchDevices(activeFilters);
      setData(result.data || []);
      setTotalPages(result.pagination?.totalPages || 0);
      setRecordsCount(result.pagination?.totalRecords || 0);
      setPageSize(
        result.pagination?.totalRecords >= 20 ? 20 : result.pagination?.totalRecords || 20
      );
      setAllFilterOptions({
        phoneNumber: result.filters?.phoneNumbers || [],
        brand: result.filters?.brands || [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setRecordsCount(0);
      setAllFilterOptions({ phoneNumber: [], brand: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadColumns = async () => {
      const mod = await import("../table/columns");
      setColumns(
        mod.columns({
          fetchData,
          pageSize,
          totalPages,
          currentPage,
          recordsCount,
        })
      );
    };
    loadColumns();
  }, [pageSize, totalPages, currentPage, recordsCount]);

  useEffect(() => {
    fetchData();
  }, [refresh, currentPage, pageSize, JSON.stringify(selectedValues)]);

  return (
    <div>
      <ExampleTwo
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        tableData={data}
        tableColumns={columns}
        allFilterOptions={allFilterOptions}
        token={token}
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

export default LeadPage;
