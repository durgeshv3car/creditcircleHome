"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { fetchUsers } from "../../../services/users/api";
import { ColumnDef } from "@tanstack/react-table"; 
import { DataProps } from "./table/columns"; 
import { useRouter } from "next/navigation";
import { columns } from "./table/columns";


interface SelectedValues {
  city: string[] | null;
  state: string[] | null;
  pincode: string[] | null;
  dob: string[] | null;
  netMonthlyIncome: string[] | null;
  loanType: string[] | null;
  profession: string[] | null;
}

const ExampleTwo = dynamic<{
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  tableData: DataProps[];
  tableColumns: ColumnDef<DataProps>[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  allFilterOptions: Record<string, Set<string>>; // Add this prop
}>(() => import("./table"), {
  loading: () => <p>Loading table...</p>,
  ssr: false,
});

const LeadPage: React.FC = () => {
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    state: null,
    city: null,
    pincode: null,
    dob: null,
    netMonthlyIncome: null,
    loanType: null,
    profession: null,
  });
  const [customAgeRange, setCustomAgeRange] = useState<{
    min?: number;
    max?: number;
  }>({});
  const [customIncomeRange, setCustomIncomeRange] = useState<{
    min?: number;
    max?: number;
  }>({});

  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [tableColumns, setTableColumns] = useState<ColumnDef<DataProps>[]>([]);
 

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
    const loadColumns = async () => {
      try {
        const columnsModule = await import('./table/columns');
        setTableColumns(columnsModule.columns(fetchData, router));
      } catch (error) {
        console.error("Error loading columns:", error);
        setTableColumns([]);
      }
    };
    
    loadColumns();
  }, [fetchData, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refresh]);
  const [allFilterOptions, setAllFilterOptions] = useState<
    Record<string, Set<string>>
  >({
    state: new Set(),
    city: new Set(),
    pincode: new Set(),
    loanType: new Set(),
    profession: new Set(),
  });

  // Initialize the filter options when data is first loaded

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

  const {
    stateData,
    cityData,
    pincodeData,
    dobData,
    incomeData,
    loanTypeData,
    professionData,
    filteredData,
  } = React.useMemo(() => {
    const stateData = selectedValues.state?.length
      ? data.filter((user) =>
          selectedValues.state!.some((state) =>
            typeof state === "object" && state.name
              ? user.state?.toLowerCase().includes(state.name.toLowerCase())
              : typeof state === "string" &&
                user.state?.toLowerCase().includes(state.toLowerCase())
          )
        )
      : data;

    const cityData = selectedValues.city?.length
      ? data.filter((user) =>
          selectedValues.city!.some((city) =>
            typeof city === "object" && city.name
              ? user.city?.toLowerCase().includes(city.name.toLowerCase())
              : typeof city === "string" &&
                user.city?.toLowerCase().includes(city.toLowerCase())
          )
        )
      : data;

    const pincodeData = selectedValues.pincode?.length
      ? data.filter((user) =>
          selectedValues.pincode!.some((pin) =>
            user.pinCode?.toString().includes(pin)
          )
        )
      : data;

    const dobData = selectedValues.dob?.length
      ? data.filter((user) =>
          selectedValues.dob!.some((dobFilter) => {
            if (!user.dob) return false;
            const age = calculateAge(user.dob);

            switch (dobFilter) {
              case "Under 15":
                return age < 15;
              case "15-18":
                return age >= 15 && age <= 18;
              case "18-21":
                return age >= 18 && age <= 21;
              case "22-25":
                return age >= 22 && age <= 25;
              case "26-30":
                return age >= 26 && age <= 30;
              case "31-35":
                return age >= 31 && age <= 35;
              case "36-40":
                return age >= 36 && age <= 40;
              case "41-45":
                return age >= 41 && age <= 45;
              case "46-50":
                return age >= 46 && age <= 50;
              case "51-60":
                return age >= 51 && age <= 60;
              case "60+":
                return age > 60;
              case "Custom":
                return (
                  customAgeRange.min !== undefined &&
                  customAgeRange.max !== undefined &&
                  age >= customAgeRange.min &&
                  age <= customAgeRange.max
                );
              default:
                return false;
            }
          })
        )
      : data;

    const incomeData = selectedValues.netMonthlyIncome?.length
      ? data.filter((user) =>
          selectedValues.netMonthlyIncome!.some((incomeFilter) => {
            const income = parseFloat(user.netMonthlyIncome || "");
            if (isNaN(income)) return false;

            switch (incomeFilter) {
              case "Under 15000":
                return income < 15000;
              case "15001-20000":
                return income >= 15001 && income <= 20000;
              case "20001-25000":
                return income >= 20001 && income <= 25000;
              case "25001-35000":
                return income >= 25001 && income <= 35000;
              case "35001-50000":
                return income >= 35001 && income <= 50000;
              case "50001-75000":
                return income >= 50001 && income <= 75000;
              case "75001-100000":
                return income >= 75001 && income <= 100000;
              case "100001-150000":
                return income >= 100001 && income <= 150000;
              case "150001-200000":
                return income >= 150001 && income <= 200000;
              case "2lac+":
                return income > 200000;
              case "Custom":
                return (
                  customIncomeRange.min !== undefined &&
                  customIncomeRange.max !== undefined &&
                  income >= customIncomeRange.min &&
                  income <= customIncomeRange.max
                );
              default:
                return false;
            }
          })
        )
      : data;

    const loanTypeData = selectedValues.loanType?.length
      ? data.filter((user) =>
          selectedValues.loanType!.some((loan) => {
            const loanValue = typeof loan === "object" ? loan.name : loan;
            return (
              user?.LoanApplication?.loanType &&
              loanValue &&
              user.LoanApplication.loanType
                .toLowerCase()
                .includes(loanValue.toLowerCase())
            );
          })
        )
      : data;

    const professionData = selectedValues.profession?.length
      ? data.filter((user) =>
          selectedValues.profession!.some((profession) => {
            const loanValue =
              typeof profession === "object" ? profession.name : profession;
            return (
              user?.LoanApplication?.profession &&
              loanValue &&
              user.LoanApplication.profession
                .toLowerCase()
                .includes(loanValue.toLowerCase())
            );
          })
        )
      : data;

    // Final filtered data = intersection of all filters
    const filteredData = data.filter((user) => {
      return (
        (!selectedValues.state?.length ||
          stateData.some((u) => u.id === user.id)) &&
        (!selectedValues.city?.length ||
          cityData.some((u) => u.id === user.id)) &&
        (!selectedValues.pincode?.length ||
          pincodeData.some((u) => u.id === user.id)) &&
        (!selectedValues.dob?.length ||
          dobData.some((u) => u.id === user.id)) &&
        (!selectedValues.netMonthlyIncome?.length ||
          incomeData.some((u) => u.id === user.id)) &&
        (!selectedValues.loanType?.length ||
          loanTypeData.some((u) => u.id === user.id)) &&
        (!selectedValues.profession?.length ||
          professionData.some((u) => u.id === user.id))
      );
    });

    return {
      stateData,
      cityData,
      pincodeData,
      dobData,
      incomeData,
      loanTypeData,
      professionData,
      filteredData,
    };
  }, [data, selectedValues, customAgeRange, customIncomeRange]);

  useEffect(() => {
    const options: Record<string, Set<string>> = {
      state: new Set<string>(),
      city: new Set<string>(),
      pincode: new Set<string>(),
      dob: new Set<string>(),         
      netMonthlyIncome: new Set<string>(), 
      loanType: new Set<string>(),
      profession: new Set<string>(),
    };
    

    const dataForStateFilter = data.filter(user => 
      (!selectedValues.city?.length || cityData.some(u => u.id === user.id)) &&
      (!selectedValues.pincode?.length || pincodeData.some(u => u.id === user.id)) &&
      (!selectedValues.dob?.length || dobData.some(u => u.id === user.id)) &&
      (!selectedValues.netMonthlyIncome?.length || incomeData.some(u => u.id === user.id)) &&
      (!selectedValues.loanType?.length || loanTypeData.some(u => u.id === user.id)) &&
      (!selectedValues.profession?.length || professionData.some(u => u.id === user.id))
    );
    
    // For cities, use data filtered by all except city filter
    const dataForCityFilter = data.filter(user => 
      (!selectedValues.state?.length || stateData.some(u => u.id === user.id)) &&
      (!selectedValues.pincode?.length || pincodeData.some(u => u.id === user.id)) &&
      (!selectedValues.dob?.length || dobData.some(u => u.id === user.id)) &&
      (!selectedValues.netMonthlyIncome?.length || incomeData.some(u => u.id === user.id)) &&
      (!selectedValues.loanType?.length || loanTypeData.some(u => u.id === user.id)) &&
      (!selectedValues.profession?.length || professionData.some(u => u.id === user.id))
    );
    
    // For pincodes, use data filtered by all except pincode filter
    const dataForPincodeFilter = data.filter(user => 
      (!selectedValues.state?.length || stateData.some(u => u.id === user.id)) &&
      (!selectedValues.city?.length || cityData.some(u => u.id === user.id)) &&
      (!selectedValues.dob?.length || dobData.some(u => u.id === user.id)) &&
      (!selectedValues.netMonthlyIncome?.length || incomeData.some(u => u.id === user.id)) &&
      (!selectedValues.loanType?.length || loanTypeData.some(u => u.id === user.id)) &&
      (!selectedValues.profession?.length || professionData.some(u => u.id === user.id))
    );
    
    // For DOB ranges, use data filtered by all except dob filter
    const dataForDobFilter = data.filter(user => 
      (!selectedValues.state?.length || stateData.some(u => u.id === user.id)) &&
      (!selectedValues.city?.length || cityData.some(u => u.id === user.id)) &&
      (!selectedValues.pincode?.length || pincodeData.some(u => u.id === user.id)) &&
      (!selectedValues.netMonthlyIncome?.length || incomeData.some(u => u.id === user.id)) &&
      (!selectedValues.loanType?.length || loanTypeData.some(u => u.id === user.id)) &&
      (!selectedValues.profession?.length || professionData.some(u => u.id === user.id))
    );
    
    // For income ranges, use data filtered by all except income filter
    const dataForIncomeFilter = data.filter(user => 
      (!selectedValues.state?.length || stateData.some(u => u.id === user.id)) &&
      (!selectedValues.city?.length || cityData.some(u => u.id === user.id)) &&
      (!selectedValues.pincode?.length || pincodeData.some(u => u.id === user.id)) &&
      (!selectedValues.dob?.length || dobData.some(u => u.id === user.id)) &&
      (!selectedValues.loanType?.length || loanTypeData.some(u => u.id === user.id)) &&
      (!selectedValues.profession?.length || professionData.some(u => u.id === user.id))
    );
    
    // For loan types, use data filtered by all except loan type filter
    const dataForLoanTypeFilter = data.filter(user => 
      (!selectedValues.state?.length || stateData.some(u => u.id === user.id)) &&
      (!selectedValues.city?.length || cityData.some(u => u.id === user.id)) &&
      (!selectedValues.pincode?.length || pincodeData.some(u => u.id === user.id)) &&
      (!selectedValues.dob?.length || dobData.some(u => u.id === user.id)) &&
      (!selectedValues.netMonthlyIncome?.length || incomeData.some(u => u.id === user.id)) &&
      (!selectedValues.profession?.length || professionData.some(u => u.id === user.id))
    );
    
    // For professions, use data filtered by all except profession filter
    const dataForProfessionFilter = data.filter(user => 
      (!selectedValues.state?.length || stateData.some(u => u.id === user.id)) &&
      (!selectedValues.city?.length || cityData.some(u => u.id === user.id)) &&
      (!selectedValues.pincode?.length || pincodeData.some(u => u.id === user.id)) &&
      (!selectedValues.dob?.length || dobData.some(u => u.id === user.id)) &&
      (!selectedValues.netMonthlyIncome?.length || incomeData.some(u => u.id === user.id)) &&
      (!selectedValues.loanType?.length || loanTypeData.some(u => u.id === user.id))
    );
    
 
    dataForStateFilter.forEach(user => {
      if (user.state) options.state.add(user.state);
    });
    
    dataForCityFilter.forEach(user => {
      if (user.city) options.city.add(user.city);
    });
    
    dataForPincodeFilter.forEach(user => {
      if (user.pinCode) options.pincode.add(user.pinCode);
    });
    
    
    if (dataForDobFilter.length > 0) {
    
      dataForDobFilter.forEach(user => {
        if (!user.dob) return;
        
        const age = calculateAge(user.dob);
        
        if (age < 15) options.dob.add("Under 15");
        else if (age >= 15 && age <= 18) options.dob.add("15-18");
        else if (age >= 18 && age <= 21) options.dob.add("18-21");
        else if (age >= 22 && age <= 25) options.dob.add("22-25");
        else if (age >= 26 && age <= 30) options.dob.add("26-30");
        else if (age >= 31 && age <= 35) options.dob.add("31-35");
        else if (age >= 36 && age <= 40) options.dob.add("36-40");
        else if (age >= 41 && age <= 45) options.dob.add("41-45");
        else if (age >= 46 && age <= 50) options.dob.add("46-50");
        else if (age >= 51 && age <= 60) options.dob.add("51-60");
        else if (age > 60) options.dob.add("60+");
      });
      
    
      options.dob.add("Custom");
      
    }
    

    if (dataForIncomeFilter.length > 0) {
    
      
      dataForIncomeFilter.forEach(user => {
        const income = parseFloat(user.netMonthlyIncome || "");
        if (isNaN(income)) return;
        
        if (income < 15000) options.netMonthlyIncome.add("Under 15000");
        else if (income >= 15001 && income <= 20000) options.netMonthlyIncome.add("15001-20000");
        else if (income >= 20001 && income <= 25000) options.netMonthlyIncome.add("20001-25000");
        else if (income >= 25001 && income <= 35000) options.netMonthlyIncome.add("25001-35000");
        else if (income >= 35001 && income <= 50000) options.netMonthlyIncome.add("35001-50000");
        else if (income >= 50001 && income <= 75000) options.netMonthlyIncome.add("50001-75000");
        else if (income >= 75001 && income <= 100000) options.netMonthlyIncome.add("75001-100000");
        else if (income >= 100001 && income <= 150000) options.netMonthlyIncome.add("100001-150000");
        else if (income >= 150001 && income <= 200000) options.netMonthlyIncome.add("150001-200000");
        else if (income > 200000) options.netMonthlyIncome.add("2lac+");
      });
      

      options.netMonthlyIncome.add("Custom");
      
    }
    
    dataForLoanTypeFilter.forEach(user => {
      if (user?.LoanApplication?.loanType && user.LoanApplication.loanType !== "null") {
        options.loanType.add(user.LoanApplication.loanType);
      }
    });
    
    dataForProfessionFilter.forEach(user => {
      if (user?.LoanApplication?.profession && user.LoanApplication.profession !== "null") {
        options.profession.add(user.LoanApplication.profession);
      }
    });
    
    setAllFilterOptions(options);
  }, [
    data, 
    selectedValues, 
    stateData, 
    cityData, 
    pincodeData, 
    dobData, 
    incomeData, 
    loanTypeData, 
    professionData,
    
  ]);

  if (loading) return <p className="p-4 text-gray-600">Loading users...</p>;

  return (
    <div>
      <ExampleTwo
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        tableData={filteredData}
        tableColumns={tableColumns}
        setRefresh={setRefresh}
        allFilterOptions={allFilterOptions}
      />
    </div>
  );
};

export default LeadPage;
