"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { SelectedValues } from "./LoanApplications";

interface FilterProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  data: Record<string, any>[];
}

export default function Filter({
  selectedValues,
  setSelectedValues,
  data,
}: FilterProps) {
  const [openFilter, setOpenFilter] = useState<keyof SelectedValues | null>(
    null
  );
  const [dropdownOptions, setDropdownOptions] = useState<
    Partial<Record<keyof SelectedValues, string[]>>
  >({});

  const fieldPaths = React.useMemo(() => {
    return {
      phoneNumber: (item: any) => item?.phoneNumber,
      desiredLoanAmount: (item: any) => item?.desiredLoanAmount,
      loanTenure: (item: any) => item?.loanTenure,
      loanType: (item: any) => item?.loanType,
      employmentStatus: (item: any) => item?.employmentStatus,
      netMonthlyIncome: (item: any) => item?.netMonthlyIncome,
      hasCreditCard: (item: any) => item?.hasCreditCard,
      employmentLevel: (item: any) => item?.employmentLevel,
      loanPurpose: (item: any) => item?.loanPurpose,
      hasGST: (item: any) => item?.hasGST,
      businessType: (item: any) => item?.businessType,
      natureOfBusiness: (item: any) => item?.natureOfBusiness,
      yearsInBusiness: (item: any) => item?.yearsInBusiness,
      businessTurnover: (item: any) => item?.businessTurnover,
      businessIncome: (item: any) => item?.businessIncome,
      profession: (item: any) => item?.profession,
      yearRegistration: (item: any) => item?.yearRegistration,
      studentIncome: (item: any) => item?.studentIncome,
    };
  }, []);

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
    { min: 200001, max: Infinity, label: "2lac+" }
  ];

  const getIncomeRange = (income: number): string => {
    const range = incomeRanges.find(r => income >= r.min && income <= r.max);
    return range ? range.label : "Under 15000";
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const newDropdowns: Partial<Record<keyof SelectedValues, string[]>> = {};
    
    for (const field in selectedValues) {
      const key = field as keyof SelectedValues;
      const values = data.map(fieldPaths[key]).filter((value) => value !== undefined && value !== null);
      
      // Handle special fields
      if (["netMonthlyIncome", "desiredLoanAmount", "businessTurnover", "businessIncome", "studentIncome"].includes(field)) {
        // Income ranges
        newDropdowns[key] = ["All", ...incomeRanges.map(r => r.label)];
      } 
      else if (["hasCreditCard", "hasGST"].includes(field)) {
        // Boolean fields
        newDropdowns[key] = ["All", "Yes", "No"];
      }
      else if (field === "yearsInBusiness") {
        // Extract years from dates and create unique year list
        const years = new Set<string>();
        values.forEach((value) => {
          if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              years.add(date.getFullYear().toString());
            }
          }
        });
        newDropdowns[key] = ["All", ...Array.from(years).sort((a, b) => b.localeCompare(a))]; // Sort years in descending order
      }
      else {
        newDropdowns[key] = ["All", ...Array.from(new Set(values)).sort()];
      }
    }
    setDropdownOptions(newDropdowns);
  }, [fieldPaths, selectedValues, data]);

  const getDisplayLabel = (field: keyof SelectedValues): string => {
    const value = selectedValues[field];
    if (!value || value.length === 0) {
      return field.replace(/([A-Z])/g, ' $1').trim();
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? String(value[0]) : field.replace(/([A-Z])/g, ' $1').trim();
    }
    return String(value);
  };

  const handleChange = (field: keyof SelectedValues, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: value === "All" ? "" : value,
    }));
    setOpenFilter(null);
  };

  const handleOpenChange = (field: keyof SelectedValues, isOpen: boolean) => {
    setOpenFilter(isOpen ? field : null);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {(Object.keys(selectedValues) as (keyof SelectedValues)[]).map((field) => (
        <Popover
          key={field}
          open={openFilter === field}
          onOpenChange={(isOpen) => handleOpenChange(field, isOpen)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-between capitalize"
            >
              {getDisplayLabel(field)}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={`Search ${field}`} />
              <CommandList>
                {dropdownOptions[field]?.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => handleChange(field, option)}
                  >
                    {option}
                    <Check
                      className={`ml-auto ${
                        selectedValues[field]?.toString() === option
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
