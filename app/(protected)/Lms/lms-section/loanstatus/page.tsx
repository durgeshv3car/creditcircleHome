"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fetchUsers } from "../../../services/users/api";

const ExampleTwo = dynamic(() => import("./table"), {
  loading: () => <p>Loading table...</p>,
  ssr: false,
});

const LeadPage = () => {
  const [selectedValues, setSelectedValues] = useState({
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
  const fetchData = async () => {
    try {
      const result = await fetchUsers();

      if (!result || result.status === 404) {
        setData([]);
        return;
      }

      setData(Array.isArray(result) ? result : [result]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Ensure state is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const filteredData = data.filter((item) => {
    const user = item;

    return (
      (!selectedValues.firstName?.trim() ||
        user.firstName
          ?.toLowerCase()
          .includes(selectedValues.firstName.toLowerCase())) &&
      (!selectedValues.email?.trim() ||
        user.email
          ?.toLowerCase()
          .includes(selectedValues.email.toLowerCase())) &&
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
        user.state
          ?.toLowerCase()
          .includes(selectedValues.state.toLowerCase())) &&
      (!selectedValues.houseNo?.trim() ||
        user.houseNo
          ?.toLowerCase()
          .includes(selectedValues.houseNo.toLowerCase())) &&
      (!selectedValues.streetAddress?.trim() ||
        user.streetAddress
          ?.toLowerCase()
          .includes(selectedValues.streetAddress.toLowerCase())) &&
      (!selectedValues.landmark?.trim() ||
        user.landmark
          ?.toLowerCase()
          .includes(selectedValues.landmark.toLowerCase())) &&
      (!selectedValues.gender?.trim() ||
        user.gender?.toLowerCase() === selectedValues.gender.toLowerCase()) &&
      (!selectedValues.education?.trim() ||
        user.education
          ?.toLowerCase()
          .includes(selectedValues.education.toLowerCase())) &&
      (!selectedValues.maritalStatus?.trim() ||
        user.maritalStatus
          ?.toLowerCase()
          .includes(selectedValues.maritalStatus.toLowerCase()))
    );
  });

  return (
    <>
     
      <div className="">
        <ExampleTwo
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
          tableData={filteredData}
          tableColumns={columns}
        />
      </div>
    </>
  );
};

export default LeadPage;
