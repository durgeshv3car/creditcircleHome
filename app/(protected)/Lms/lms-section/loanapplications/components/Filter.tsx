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
  CommandEmpty,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, SlidersHorizontal, RotateCcw, X, Filter as FilterIcon } from "lucide-react";
import { SelectedValues } from "./LoanApplications";
import { cn } from "@/lib/utils";

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
        const strValues = values
          .map((v) => {
            if (v === null || v === undefined) return "";
            if (typeof v === "object") return String(v?.name ?? v?.label ?? "");
            return String(v);
          })
          .filter(Boolean);
        newDropdowns[key] = ["All", ...Array.from(new Set(strValues)).sort()];
      }
    }
    setDropdownOptions(newDropdowns);
  }, [fieldPaths, selectedValues, data]);

const FIELD_LABELS: Record<string, string> = {
  phoneNumber: "Phone Number",
  desiredLoanAmount: "Desired Loan Amount",
  loanTenure: "Loan Tenure",
  loanType: "Loan Type",
  employmentStatus: "Employment Status",
  netMonthlyIncome: "Net Monthly Income",
  hasCreditCard: "Has Credit Card",
  employmentLevel: "Employment Level",
  loanPurpose: "Loan Purpose",
  hasGST: "Has GST",
  businessType: "Business Type",
  natureOfBusiness: "Nature of Business",
  yearsInBusiness: "Years in Business",
  businessTurnover: "Business Turnover",
  businessIncome: "Business Income",
  profession: "Profession",
  yearRegistration: "Year of Registration",
  studentIncome: "Student Income",
};

const formatFieldLabel = (field: any): string => {
  if (field === null || field === undefined) return "";
  const str = String(field);
  if (FIELD_LABELS[str]) return FIELD_LABELS[str];
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
};

const formatOptionLabel = (option: any): string => {
  if (option === null || option === undefined) return "";
  const str = typeof option === "object" ? String(option?.name ?? option?.label ?? "") : String(option);
  if (!str || str === "All") return str;
  if (str === "PersonalLoan") return "Personal Loan";
  if (str === "HomeLoan") return "Home Loan";
  if (str === "BusinessLoan") return "Business Loan";
  if (str === "EducationLoan") return "Education Loan";
  if (str === "SelfEmployedBusiness") return "Self Employed Business";
  if (str === "SelfEmployedProfessional") return "Self Employed Professional";
  if (str === "Salaried") return "Salaried";
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim();
};

  const getDisplayLabel = (field: keyof SelectedValues): string => {
    const value: any = selectedValues[field];
    if (!value || (Array.isArray(value) && value.length === 0) || value === "") {
      return formatFieldLabel(field);
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? formatOptionLabel(String(value[0])) : formatFieldLabel(field);
    }
    return formatOptionLabel(String(value));
  };

  const isFieldActive = (field: keyof SelectedValues): boolean => {
    const val: any = selectedValues[field];
    if (val === null || val === undefined || val === "") return false;
    if (Array.isArray(val)) return val.length > 0;
    return true;
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

  const handleReset = () => {
    const resetValues: any = {};
    (Object.keys(selectedValues) as (keyof SelectedValues)[]).forEach((key) => {
      resetValues[key] = null;
    });
    setSelectedValues(resetValues);
  };

  const activeFiltersCount = (Object.keys(selectedValues) as (keyof SelectedValues)[]).filter(
    (field) => isFieldActive(field)
  ).length;

  return (
    <div className="w-full space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0B1740] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Filter Loan Applications
              </h3>
              {activeFiltersCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FFF1ED] text-[#EA580C] border border-orange-200/80">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF6B4A]" />
                  </span>
                  {activeFiltersCount} active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Filter by applicant profile, employment, income and business details
            </p>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 px-2.5 py-1.5 rounded-md border border-rose-100 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Filter Buttons Grid: Equal column width on every row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {(Object.keys(selectedValues) as (keyof SelectedValues)[]).map((field) => {
          const active = isFieldActive(field);
          return (
            <Popover
              key={field}
              open={openFilter === field}
              onOpenChange={(isOpen) => handleOpenChange(field, isOpen)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-9 px-2.5 justify-between text-xs rounded-md transition-colors cursor-pointer select-none",
                    active
                      ? "bg-[#FFF1ED] border-orange-200 text-[#EA580C] font-semibold hover:bg-[#FFE6DF] hover:border-orange-300"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium"
                  )}
                  title={getDisplayLabel(field)}
                >
                  <span className="truncate mr-1.5 text-left">{getDisplayLabel(field)}</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 opacity-50 shrink-0 ml-auto" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={4}
                collisionPadding={12}
                className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-0 rounded-lg border border-slate-200 bg-white shadow-xl overflow-hidden z-50"
              >
                {/* Popup Header */}
                <div className="px-3 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {formatFieldLabel(field)}
                  </span>
                  {active && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChange(field, "All");
                      }}
                      className="text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-2"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <Command className="w-full">
                  <div className="border-b border-slate-100">
                    <CommandInput
                      placeholder={`Search ${formatFieldLabel(field)}...`}
                      className="text-xs h-9 py-1.5 border-0 focus:ring-0 outline-none w-full placeholder:text-slate-400"
                    />
                  </div>
                  <CommandList className="max-h-56 overflow-y-auto p-1 clean-scrollbar">
                    <CommandEmpty className="py-4 text-center text-xs text-slate-400">
                      No options found.
                    </CommandEmpty>
                    {dropdownOptions[field]?.map((option) => {
                      const isSelected =
                        option === "All"
                          ? !active
                          : selectedValues[field]?.toString() === option;
                      return (
                        <CommandItem
                          key={option}
                          value={`${option} ${formatOptionLabel(option)}`}
                          onSelect={() => handleChange(field, option)}
                          className={cn(
                            "text-xs rounded-md cursor-pointer py-1.5 px-2 flex items-center justify-between transition-colors",
                            isSelected
                              ? "bg-[#FFF1ED] text-[#EA580C] font-semibold"
                              : "hover:bg-slate-50 text-slate-700"
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={cn(
                                "w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors shrink-0",
                                isSelected
                                  ? "bg-[#FF6B4A] border-[#FF6B4A] text-white"
                                  : "border-slate-300 bg-white"
                              )}
                            >
                              {isSelected && (
                                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                              )}
                            </div>
                            <span className="truncate">
                              {formatOptionLabel(option)}
                            </span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
}
