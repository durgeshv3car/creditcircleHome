"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchLoans } from "../../services/loans/api";

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
    salaryMode: null,
    hasCreditCard: null,
    salaryBank: null,
    companyName: null,
    employmentLevel: null,
    officeLocation: null,
    officeStreet: null,
    officePinCode: null,
    officeCity: null,
    officeState: null,
    loanPurpose: null,
    hasGST: null,
    gstNumber: null,
    businessPAN: null,
    businessName: null,
    tradeName: null,
    PrincipalPlaceofBusiness: null,
    businessType: null,
    natureOfBusiness: null,
    yearsInBusiness: null,
    businessTurnover: null,
    GSTStatus: null,
    businessIncome: null,
    businessBank: null,
    profession: null,
    registrationNumber: null,
    yearRegistration: null,
    studentIncome: null,
    studentIncomeMode: null,
    fatherName: null,
    motherName: null,
    livesWithParents: null,
    loanCompletion: null,
  });

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
    return Object.entries(selectedValues).every(([key, value]) => {
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
