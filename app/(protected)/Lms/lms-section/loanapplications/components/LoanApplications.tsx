"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchLoans } from "../../../../services/loans/api";
import { DataProps } from "../../loanapplications/table/columns";
import PartnerStatus from "../components/PartnerStatus";

const ExampleTwo = dynamic(() => import(".././table"), {
  loading: () => <p>Loading table...</p>,
  ssr: false,
});

export interface SelectedValues {
  netMonthlyIncome: string[] | null;
  loanType: (string | { name: string })[] | null;
  profession: (string | { name: string })[] | null;
  phoneNumber: (string | { name: string })[] | null;
  desiredLoanAmount: (string | { name: string })[] | null;
  loanTenure: (string | { name: string })[] | null;
  employmentStatus: (string | { name: string })[] | null;
  hasCreditCard: (string | { name: string })[] | null;
  employmentLevel: (string | { name: string })[] | null;
  loanPurpose: (string | { name: string })[] | null;
  hasGST: (boolean | { name: boolean })[] | null;
  businessType: (string | { name: string })[] | null;
  natureOfBusiness: (string | { name: string })[] | null;
  yearsInBusiness: (string | { name: string })[] | null;
  businessTurnover: (string | { name: string })[] | null;
  businessIncome: (string | { name: string })[] | null;
  studentIncome: (string | { name: string })[] | null;
}

const LeadPage = ({ token }: { token: string }) => {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    phoneNumber: null,
    desiredLoanAmount: null,
    loanTenure: null,
    loanType: null,
    employmentStatus: null,
    netMonthlyIncome: null,
    hasCreditCard: null,
    employmentLevel: null,
    loanPurpose: null,
    hasGST: null,
    businessType: null,
    natureOfBusiness: null,
    yearsInBusiness: null,
    businessTurnover: null,
    businessIncome: null,
    profession: null,
    studentIncome: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const businessFields = [
    "tradeName",
    "businessType",
    "natureOfBusiness",
    "yearsInBusiness",
    "businessTurnover",
    "businessIncome",
    "profession",
  ];

  // Only include business fields if hasGST is "true"
  const filteredSelectedValues = Object.fromEntries(
    Object.entries(selectedValues).filter(([key]) => {
      if (businessFields.includes(key)) {
        return selectedValues.hasGST?.some((item) =>
          typeof item === "boolean" ? item : item?.name === true
        );
      }
      return true;
    })
  );

  const [columns, setColumns] = useState<any[]>([]);
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<DataProps | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [datesLoaded, setDatesLoaded] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedStatusPartner, setSelectedStatusPartner] = useState<string>("");

  // Load dates from localStorage
  useEffect(() => {
    const storedStart = localStorage.getItem("startDateLoan");
    const storedEnd = localStorage.getItem("endDateLoan");

    if (storedStart && storedEnd) {
      setStartDate(storedStart);
      setEndDate(storedEnd);
    }
    setDatesLoaded(true);
  }, []);

  useEffect(() => {
    const loadColumns = async () => {
      const mod = await import(".././table/columns");
      const cols = mod.columns({
        isModalOpen,
        setIsModalOpen,
        setSelectedRow,
        pageSize,
        totalPages,
        currentPage,
        recordsCount,
      });
      setColumns(cols);
    };
    loadColumns();
  }, [isModalOpen, pageSize, totalPages, currentPage, recordsCount]);

  const fetchData = async () => {
    const params: any = {
      page: currentPage,
      pageSize: pageSize,
    };
    try {
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (selectedStatusPartner !="Partners") params.partner = selectedStatusPartner;
      if (selectedStatus!="Status") params.status = selectedStatus;
      const result = await fetchLoans(params);
      setData(result.data);
      setTotalPages(result.totalPages);
      setPageSize(result.totalRecords >= 20 ? pageSize : result.totalRecords);
      setRecordsCount(result.totalRecords);
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
  }, [datesLoaded, refresh, startDate, endDate, currentPage, pageSize, selectedStatus, selectedStatusPartner]);

  const incomeRanges = [
    { min: 0, max: 14999, label: "Under 15000" },
    { min: 15000, max: 20000, label: "15000-20000" },
    { min: 20001, max: 25000, label: "20001-25000" },
    { min: 25001, max: 35000, label: "25001-35000" },
    { min: 35001, max: 50000, label: "35001-50000" },
    { min: 50001, max: 75000, label: "50001-75000" },
    { min: 75001, max: 100000, label: "75001-100000" },
    { min: 100001, max: 150000, label: "100001-150000" },
    { min: 150001, max: 200000, label: "150001-200000" },
    { min: 200001, max: Infinity, label: "2lac+" },
  ];

  const getIncomeRange = (income: number): string => {
    const range = incomeRanges.find((r) => income >= r.min && income <= r.max);
    return range ? range.label : "Under 15000";
  };

  const isInRange = (value: number, range: string): boolean => {
    const numValue = Number(value);
    if (isNaN(numValue)) return false;
    return getIncomeRange(numValue) === range;
  };

  const filteredData = data.filter((item) => {
    return Object.entries(filteredSelectedValues).every(([key, value]) => {
      if (!value || !(value as string | number).toString().trim()) return true;

      const fieldValue = item[key];

      // Handle income-related fields
      if (
        [
          "netMonthlyIncome",
          "desiredLoanAmount",
          "businessTurnover",
          "businessIncome",
          "studentIncome",
        ].includes(key)
      ) {
        const numValue = Number(fieldValue);
        if (isNaN(numValue)) return false;
        return isInRange(numValue, value as string);
      }

      // Handle boolean fields (hasCreditCard, hasGST)
      if (["hasCreditCard", "hasGST"].includes(key)) {
        if (value === "All") return true;
        const boolValue = value === "Yes";
        return fieldValue === boolValue;
      }

      // Handle yearsInBusiness (extract year from date)
      if (key === "yearsInBusiness" && typeof fieldValue === "string") {
        const date = new Date(fieldValue);
        if (!isNaN(date.getTime())) {
          return date.getFullYear().toString() === value;
        }
        return false;
      }

      // Handle other fields
      if (typeof fieldValue === "string") {
        return (
          typeof value === "string" &&
          fieldValue.toLowerCase().includes(value.toLowerCase())
        );
      }
      return fieldValue == value;
    });
  });

  return (
    <div>
      <ExampleTwo
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        tableData={filteredData}
        tableColumns={columns}
        token={token}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSelectedStatus={setSelectedStatus}
        selectedStatus={selectedStatus}
        setSelectedStatusPartner={setSelectedStatusPartner}
        selectedStatusPartner={selectedStatusPartner}
      />
      {isModalOpen && selectedRow && (
        <PartnerStatus
          isOpen={isModalOpen}
          close={() => {
            setIsModalOpen(false);
            setSelectedRow(null);
          }}
          loanDataStatus={selectedRow.loanDataStatus}
        />
      )}
    </div>
  );
};

export default LeadPage;
