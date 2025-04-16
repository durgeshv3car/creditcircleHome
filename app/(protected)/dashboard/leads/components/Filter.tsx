"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandList, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

interface FilterProps {
  selectedValues: Record<string, any>;
  setSelectedValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  data: Array<Record<string, any>>;
}

export default function Filter({ selectedValues, setSelectedValues, data }: FilterProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, string[]>>({});

  const fieldPaths: Record<string, (item: Record<string, any>) => string | undefined> = {
    email: (item) => item?.email,
    phone: (item) => item?.phoneNumber,
    dob: (item) => item?.dob,
    city: (item) => item?.city,
    state: (item) => item?.state,
    gender: (item) => item?.gender,
    education: (item) => item?.education,
    maritalStatus: (item) => item?.maritalStatus,
    hasCreditCard: (item) => String(item?.hasCreditCard),
    ownsFourWheeler: (item) => String(item?.ownsFourWheelers), // Fixed to match actual property name
    ownsTwoWheeler: (item) => String(item?.ownsTwoWheelers), // Fixed to match actual property name
    companyName: (item) => item?.companyName,
    insurancePlans: (item) => item?.insurancePlans,
    netMonthlyIncome: (item) => String(item?.netMonthlyIncome),
  };

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

  useEffect(() => {
    if (!data || data.length === 0) return;

    const newDropdowns: Record<string, string[]> = {};

    for (const field in selectedValues) {
      const extractor = fieldPaths[field];
      if (typeof extractor !== "function") continue;

      if (["hasCreditCard", "ownsFourWheeler", "ownsTwoWheeler"].includes(field)) {
        newDropdowns[field] = ["All", "true", "false"];
      } else if (field === "netMonthlyIncome") {
        const incomeGroups = new Set<string>();
        for (const item of data) {
          const incomeStr = extractor(item);
          if (!incomeStr) continue;
          const income = parseFloat(incomeStr);
          if (income < 20000) incomeGroups.add("less than 20k");
          else if (income <= 50000) incomeGroups.add("between 20k to 50k");
          else if (income <= 100000) incomeGroups.add("between 50k to 1L");
          else incomeGroups.add("greater than 1L");
        }
        newDropdowns[field] = ["All", ...Array.from(incomeGroups)];
      } else if (field === "dob") {
        const ageGroups = new Set<string>();
        for (const item of data) {
          const dobStr = extractor(item);
          if (!dobStr) continue;
          const age = calculateAge(dobStr);
          if (age < 21) ageGroups.add("less than 21");
          else if (age <= 50) ageGroups.add("between 21 to 50");
          else ageGroups.add("greater than 50");
        }
        newDropdowns[field] = ["All", ...Array.from(ageGroups)];
      } else {
        const values = data.map(extractor).filter(Boolean) as string[];
        newDropdowns[field] = ["All", ...Array.from(new Set(values)).sort()];
      }
    }

    setDropdownOptions(newDropdowns);
  }, [data, Object.keys(selectedValues).join(",")]);

  const handleChange = (field: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: value === "All" 
        ? null 
        : (["hasCreditCard", "ownsFourWheeler", "ownsTwoWheeler"].includes(field) && ["true", "false"].includes(value))
          ? value === "true" 
          : value,
    }));
    setOpenFilter(null);
  };

  const handleOpenChange = (field: string, isOpen: boolean) => {
    setOpenFilter(isOpen ? field : null);
  };

  // Helper function to display selected values correctly
  const displayValue = (field: string, value: any): string => {
    if (value === null) return `Select ${field}`;
    if (typeof value === "boolean") return value ? "true" : "false";
    return value;
  };

  return (
    <div className="flex flex-wrap gap-4">
      {Object.keys(selectedValues).map((field) => (
        <Popover
          key={field}
          open={openFilter === field}
          onOpenChange={(isOpen) => handleOpenChange(field, isOpen)}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between capitalize">
              {displayValue(field, selectedValues[field])}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={`Search ${field}`} />
              <CommandList>
                {dropdownOptions[field]?.map((option) => (
                  <CommandItem key={option} onSelect={() => handleChange(field, option)}>
                    {option}
                    <Check
                      className={`ml-auto ${
                        selectedValues[field] === (option === "true" ? true : option === "false" ? false : option) 
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