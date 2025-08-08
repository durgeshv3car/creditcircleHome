"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchLoans } from "../../../../services/loans/api";
import { DataProps } from "../../loanapplications/table/columns";

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
  companyName: (string | { name: string })[] | null;
  employmentLevel: (string | { name: string })[] | null;
  loanPurpose: (string | { name: string })[] | null;
  hasGST: (boolean | { name: boolean })[] | null;
  businessName: (string | { name: string })[] | null;
  tradeName: (string | { name: string })[] | null;
  PrincipalPlaceofBusiness: (string | { name: string })[] | null;
  businessType: (string | { name: string })[] | null;
  natureOfBusiness: (string | { name: string })[] | null;
  yearsInBusiness: (string | { name: string })[] | null;
  businessTurnover: (string | { name: string })[] | null;
  businessIncome: (string | { name: string })[] | null;
  businessBank: (string | { name: string })[] | null;
  yearRegistration: (string | { name: string })[] | null;
  studentIncome: (string | { name: string })[] | null;
  livesWithParents: (string | { name: string })[] | null;
}

const LeadPage = () => {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    phoneNumber: null,
    desiredLoanAmount: null,
    loanTenure: null,
    loanType: null,
    employmentStatus: null,
    netMonthlyIncome: null,
    hasCreditCard: null,
    companyName: null,
    employmentLevel: null,
    loanPurpose: null,
    hasGST: null,
    businessName: null,
    tradeName: null,
    PrincipalPlaceofBusiness: null,
    businessType: null,
    natureOfBusiness: null,
    yearsInBusiness: null,
    businessTurnover: null,
    businessIncome: null,
    businessBank: null,
    profession: null,
    yearRegistration: null,
    studentIncome: null,
    livesWithParents: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const businessFields = [
    "businessName",
    "tradeName",
    "PrincipalPlaceofBusiness",
    "businessType",
    "natureOfBusiness",
    "yearsInBusiness",
    "businessTurnover",
    "businessIncome",
    "businessBank",
    "profession",
    "yearRegistration",
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

  useEffect(() => {
    const loadColumns = async () => {
      const mod = await import(".././table/columns");
      const cols = mod.columns({
        isModalOpen,
        setIsModalOpen,
      });
      setColumns(cols);
    };
    loadColumns();
  }, [isModalOpen]);

  const fetchData = async () => {
    try {
      const result = await fetchLoans();
      setData(Array.isArray(result) ? result : [result]);
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

  const filteredData = data.filter((item) => {
    return Object.entries(filteredSelectedValues).every(([key, value]) => {
      if (!value || !(value as string | number).toString().trim()) return true;
      const fieldValue = item[key];
      if (typeof fieldValue === "string") {
        return (
          typeof fieldValue === "string" &&
          typeof value === "string" &&
          (fieldValue as string)
            .toLowerCase()
            .includes((value as string).toLowerCase())
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
      />
    </div>
  );
};

export default LeadPage;
