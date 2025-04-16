"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { fetchUsers } from "../../services/users/api";
import { ColumnDef } from "@tanstack/react-table"; // ✅ Import proper type
import { DataProps } from "./table/columns"; // ✅ Import type from columns
import { useRouter } from "next/navigation";
import { columns } from "./table/columns";

interface SelectedValues {
  firstName: string | null;
  email: string | null;
  phone: string | null;
  dob: string | null;
  pan: string | null;
  pinCode: string | null;
  city: string | null;
  state: string | null;
  houseNo: string | null;
  streetAddress: string | null;
  landmark: string | null;
  gender: string | null;
  education: string | null;
  maritalStatus: string | null;
  ageRange?: {
    min: number | null;
    max: number | null;
  };
}

const ExampleTwo = dynamic<{
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  tableData: DataProps[];
  tableColumns: ColumnDef<DataProps>[]; // ✅ Updated here
}>(() => import("./table"), {
  loading: () => <p>Loading table...</p>,
  ssr: false,
});

const LeadPage: React.FC = () => {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    hasCreditCard: null,
    netMonthlyIncome: null,
    ownsFourWheeler: null,
    ownsTwoWheeler: null,
    companyName: null,
    insurancePlans: null,
    email: null,
    phone: null,
    dob: null,
    city: null,
    state: null,
    gender: null,
    education: null,
    maritalStatus: null,
  });

  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const router = useRouter();
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const result = await fetchUsers();
      if (!result || result.status === 404) {
        setData([]);
      } else {
        setData(Array.isArray(result) ? result : [result]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refresh]);
  const calculateAge = (dobStr: string): number => {
    const dob = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const filteredData = data.filter((user) => {
    return (
      (!selectedValues.email?.trim() ||
        user.email
          ?.toLowerCase()
          .includes(selectedValues.email.toLowerCase())) &&
      (!selectedValues.phone?.trim() ||
        user.phoneNumber?.includes(selectedValues.phone)) &&
      (!selectedValues.city?.trim() ||
        user.city?.toLowerCase().includes(selectedValues.city.toLowerCase())) &&
      (!selectedValues.state?.trim() ||
        user.state
          ?.toLowerCase()
          .includes(selectedValues.state.toLowerCase())) &&
      (!selectedValues.gender?.trim() ||
        user.gender?.toLowerCase() === selectedValues.gender.toLowerCase()) &&
      (!selectedValues.education?.trim() ||
        user.education
          ?.toLowerCase()
          .includes(selectedValues.education.toLowerCase())) &&
      (!selectedValues.maritalStatus?.trim() ||
        user.maritalStatus
          ?.toLowerCase()
          .includes(selectedValues.maritalStatus.toLowerCase())) &&
      (selectedValues.hasCreditCard === null ||
        user.hasCreditCard === selectedValues.hasCreditCard) &&
      (selectedValues.ownsFourWheeler === null ||
        user.ownsFourWheeler === selectedValues.ownsFourWheeler) &&
      (selectedValues.ownsTwoWheeler === null ||
        user.ownsTwoWheeler === selectedValues.ownsTwoWheeler) &&
      (!selectedValues.companyName?.trim() ||
        user.companyName
          ?.toLowerCase()
          .includes(selectedValues.companyName.toLowerCase())) &&
      (!selectedValues.insurancePlans?.trim() ||
        user.insurancePlans
          ?.toLowerCase()
          .includes(selectedValues.insurancePlans.toLowerCase())) &&
      (!selectedValues.dob?.trim() ||
        (() => {
          if (!user.dob) return false;
          const age = calculateAge(user.dob);
          const dobFilter = selectedValues.dob;
          if (dobFilter === "less than 21") return age < 21;
          if (dobFilter === "between 21 to 50") return age >= 21 && age <= 50;
          if (dobFilter === "greater than 50") return age > 50;
          return true;
        })()) &&
      (!selectedValues.netMonthlyIncome?.trim() ||
        (() => {
          const income = parseFloat(user.netMonthlyIncome || "");
          const incomeFilter = selectedValues.netMonthlyIncome;
          if (incomeFilter === "less than 20k") return income < 20000;
          if (incomeFilter === "between 20k to 50k")
            return income >= 20000 && income <= 50000;
          if (incomeFilter === "between 50k to 1L")
            return income > 50000 && income <= 100000;
          if (incomeFilter === "greater than 1L") return income > 100000;
          return true;
        })())
    );
  });

  if (loading) return <p className="p-4 text-gray-600">Loading users...</p>;

  return (
    <div>
      <ExampleTwo
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        tableData={filteredData}
        tableColumns={columns(fetchData, router)}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default LeadPage;
