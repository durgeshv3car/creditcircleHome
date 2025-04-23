"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchLoans } from "../../../services/loans/api";

const ExampleTwo = dynamic(() => import("./table"), {
  loading: () => <p>Loading table...</p>,
  ssr: false,
});

const LeadPage = () => {
  const [selectedValues, setSelectedValues] = useState({
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
        return selectedValues.hasGST === "true";
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
      const mod = await import("./table/columns");
      setColumns(mod.columns);
    };
    loadColumns();
  }, []);

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
      if (!value || !value.toString().trim()) return true;
      const fieldValue = item[key];
      if (typeof fieldValue === "string") {
        return fieldValue.toLowerCase().includes(value.toLowerCase());
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
