"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { fetchUsers } from "../../services/users/api";
import { ColumnDef } from "@tanstack/react-table"; // ✅ Import proper type
import { DataProps } from "./table/columns"; // ✅ Import type from columns

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
    firstName: null,
    email: null,
    phone: null,
    dob: null,
    pan: null,
    pinCode: null,
    city: null,
    state: null,
    houseNo: null,
    streetAddress: null,
    landmark: null,
    gender: null,
    education: null,
    maritalStatus: null,
  });

  const [columns, setColumns] = useState<ColumnDef<DataProps>[]>([]); // ✅ Updated type
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);

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

  useEffect(() => {
    const loadColumns = async (): Promise<void> => {
      const mod = await import("./table/columns");
      setColumns(mod.columns(fetchData)); // ✅ Now fully type-safe
    };
    loadColumns();
  }, [fetchData]);

  const filteredData = data.filter((user) => {
    return (
      (!selectedValues.firstName?.trim() ||
        user.firstName?.toLowerCase().includes(selectedValues.firstName.toLowerCase())) &&
      (!selectedValues.email?.trim() ||
        user.email?.toLowerCase().includes(selectedValues.email.toLowerCase())) &&
      (!selectedValues.phone?.trim() ||
        user.phoneNumber?.includes(selectedValues.phone)) &&
      (!selectedValues.dob?.trim() || user.dob?.includes(selectedValues.dob)) &&
      (!selectedValues.pan?.trim() ||
        user.pan?.toLowerCase().includes(selectedValues.pan.toLowerCase())) &&
      (!selectedValues.pinCode?.trim() ||
        user.pinCode?.includes(selectedValues.pinCode)) &&
      (!selectedValues.city?.trim() ||
        user.city?.toLowerCase().includes(selectedValues.city.toLowerCase())) &&
      (!selectedValues.state?.trim() ||
        user.state?.toLowerCase().includes(selectedValues.state.toLowerCase())) &&
      (!selectedValues.houseNo?.trim() ||
        user.houseNo?.toLowerCase().includes(selectedValues.houseNo.toLowerCase())) &&
      (!selectedValues.streetAddress?.trim() ||
        user.streetAddress?.toLowerCase().includes(selectedValues.streetAddress.toLowerCase())) &&
      (!selectedValues.landmark?.trim() ||
        user.landmark?.toLowerCase().includes(selectedValues.landmark.toLowerCase())) &&
      (!selectedValues.gender?.trim() ||
        user.gender?.toLowerCase() === selectedValues.gender.toLowerCase()) &&
      (!selectedValues.education?.trim() ||
        user.education?.toLowerCase().includes(selectedValues.education.toLowerCase())) &&
      (!selectedValues.maritalStatus?.trim() ||
        user.maritalStatus?.toLowerCase().includes(selectedValues.maritalStatus.toLowerCase()))
    );
  });

  if (loading) return <p className="p-4 text-gray-600">Loading users...</p>;

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
