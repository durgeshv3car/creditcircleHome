"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { fetchUserFilters, fetchUsers } from "../../../../services/users/api";
import { ColumnDef } from "@tanstack/react-table";
import { DataProps } from ".././table/columns";
import { useRouter } from "next/navigation";
import PartnerStatusModal from "./PartnerStatus";

export type SelectedValues = {
  [key: string]: string[];
};

const ExampleTwo = dynamic(() => import(".././table"), {
  loading: () => <p>Loading table...</p>,
  ssr: false,
});
interface LeadPageProps {
  token: string;
}

const LeadPage: React.FC<LeadPageProps> = ({ token }) => {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    state: [],
    city: [],
    pincode: [],
    dob: [],
    netMonthlyIncome: [],
    loanType: [],
    profession: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [tableColumns, setTableColumns] = useState<ColumnDef<DataProps>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    phoneNumber: number;
  } | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [pageSize, setPageSize] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
   const [query, setQuery] = React.useState("");
   const [selected, setSelected] = React.useState<string>("all");
  
  const options = [
    { value: "all", label: "All" },
    { value: "phoneNumber", label: "PhoneNumber" },
    { value: "firstName", label: "FirstName" },
    { value: "email", label: "Email" },
    { value: "status", label: "Status" },
  ];
  const [allFilterOptions, setAllFilterOptions] = useState<
    Record<string, string[]>
  >({
    state: [],
    city: [],
    pincode: [],
    dob: [],
    netMonthlyIncome: [],
    loanType: [],
    profession: [],
  });

  const router = useRouter();

  // Load dates from localStorage
  useEffect(() => {
    const storedStart = localStorage.getItem("startDateLead");
    const storedEnd = localStorage.getItem("endDateLead");

    if (storedStart && storedEnd) {
      setStartDate(storedStart);
      setEndDate(storedEnd);
    }
  }, []);

  type Lead = {
    createdAt: string;
    [key: string]: any;
  };

  // Helper function to clean array data
  const cleanArrayData = (arr: any[]): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((item) => item !== null && item !== undefined && item !== "")
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  };

  // Fetch filter options from backend
  const fetchFilters = useCallback(async () => {
    try {
      const params: any = {};
      if(currentPage) params.page =currentPage
      if(pageSize) params.pageSize =pageSize
      if (searchTerm) params.pincodeSearch=searchTerm;
       
      

      if (selectedValues.state?.length)
        params.state = selectedValues.state.join(",");
      if (selectedValues.city?.length)
        params.city = selectedValues.city.join(",");
      if (selectedValues.pincode?.length)
        params.pincode = selectedValues.pincode.join(",");
      if (selectedValues.ageRange?.length)
        params.ageRange = selectedValues.ageRange.join(",");
      if (selectedValues.incomeRange?.length)
        params.incomeRange = selectedValues.incomeRange.join(",");
      if (selectedValues.loanType?.length)
        params.loanType = selectedValues.loanType.join(",");
      if (selectedValues.profession?.length)
        params.profession = selectedValues.profession.join(",");

      const filterData = await fetchUserFilters(params);

      // Clean and deduplicate the data
      const uniqueStates = [
        ...new Set(cleanArrayData(filterData.states || [])),
      ];
      const uniqueCities = [
        ...new Set(cleanArrayData(filterData.cities || [])),
      ];
      const uniquePincodes = [
        ...new Set(cleanArrayData(filterData.pincodes || [])),
      ];
      const uniqueLoanTypes = [
        ...new Set(cleanArrayData(filterData.loanTypes || [])),
      ];
      const uniqueProfessions = [
        ...new Set(cleanArrayData(filterData.professions || [])),
      ];

      // Convert age ranges to labels
      const ageRangeLabels = (filterData.ageRanges || []).map(
        (range: any) => range.label
      );

      // Convert income ranges to labels
      const incomeRangeLabels = (filterData.netMonthlyIncome || []).map(
        (range: any) => range.label
      );

      setAllFilterOptions({
        state: uniqueStates.sort(),
        city: uniqueCities.sort(),
        pincode: uniquePincodes.sort(),
        dob: ageRangeLabels,
        netMonthlyIncome: incomeRangeLabels,
        loanType: uniqueLoanTypes.sort(),
        profession: uniqueProfessions.sort(),
      });
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  }, [selectedValues,searchTerm,currentPage,pageSize]);

  // Fetch user data
  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize,
      };

      // Apply filters only if they have values
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      if (selected=="firstName") params.firstName = query;
      if (selected=="phoneNumber") params.phoneNumber = query;
      if (selected=="email") params.email = query;

      if (selectedValues.state?.length) params.state = selectedValues.state;

      if (selectedValues.city?.length) params.city = selectedValues.city;

      if (selectedValues.pincode?.length)
        params.pincode = selectedValues.pincode;

      if (selectedValues.dob?.length) params.age = selectedValues.dob;

      if (selectedValues.loanType?.length)
        params.loanType = selectedValues.loanType;

      if (selectedValues.profession?.length)
        params.profession = selectedValues.profession;

      if (selectedValues.netMonthlyIncome?.length)
        params.netMonthlyIncome = selectedValues.netMonthlyIncome;

      if (selectedValues.loanDataStatus?.length)
        params.loanDataStatus = selectedValues.loanDataStatus;

      const result = await fetchUsers(params);
      setData(result.data);
      setTotalPages(result.totalPages);
      setPageSize(result.totalRecords >= 20 ? 20 : result.totalRecords);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedValues, startDate, endDate, currentPage, pageSize,selected,query]);

  // Load table columns
  useEffect(() => {
    const loadColumns = async () => {
      try {
        const columnsModule = await import(".././table/columns");
        setTableColumns(
          columnsModule.columns({
            isModalOpen,
            setIsModalOpen,
            fetchData,
            router,
            selectedUser,
            setSelectedUser,
          })
        );
      } catch (error) {
        console.error("Error loading columns:", error);
        setTableColumns([]);
      }
    };

    loadColumns();
  }, [fetchData, isModalOpen, router, selectedUser]);

  // Initial data and filters fetch
  useEffect(() => {
    fetchData();
    fetchFilters();
  }, [searchTerm,fetchData, fetchFilters, refresh]);

  return (
    <div>
      <ExampleTwo
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        tableData={data}
        tableColumns={tableColumns}
        setRefresh={setRefresh}
        allFilterOptions={allFilterOptions}
        token={token}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        options={options}
        query={query}
        setQuery={setQuery}
        selected={selected}
        setSelected={setSelected}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {selectedUser && (
        <PartnerStatusModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          id={selectedUser.id}
          phoneNumber={String(selectedUser.phoneNumber)}
        />
      )}
    </div>
  );
};

export default LeadPage;
