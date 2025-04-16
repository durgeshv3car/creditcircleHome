"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandList, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

export default function Filter({ selectedValues, setSelectedValues, data }) {
  const [openFilter, setOpenFilter] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState({});

  const fieldPaths = {
    phoneNumber: (item) => item?.phoneNumber,
    desiredLoanAmount: (item) => item?.desiredLoanAmount,
    loanTenure: (item) => item?.loanTenure,
    loanType: (item) => item?.loanType,
    employmentStatus: (item) => item?.employmentStatus,
    netMonthlyIncome: (item) => item?.netMonthlyIncome,
    hasCreditCard: (item) => item?.hasCreditCard,
    companyName: (item) => item?.companyName,
    employmentLevel: (item) => item?.employmentLevel,
    loanPurpose: (item) => item?.loanPurpose,
    hasGST: (item) => item?.hasGST,
    businessName: (item) => item?.businessName,
    tradeName: (item) => item?.tradeName,
    PrincipalPlaceofBusiness: (item) => item?.PrincipalPlaceofBusiness,
    businessType: (item) => item?.businessType,
    natureOfBusiness: (item) => item?.natureOfBusiness,
    yearsInBusiness: (item) => item?.yearsInBusiness,
    businessTurnover: (item) => item?.businessTurnover,
    businessIncome: (item) => item?.businessIncome,
    businessBank: (item) => item?.businessBank,
    profession: (item) => item?.profession,
    yearRegistration: (item) => item?.yearRegistration,
    studentIncome: (item) => item?.studentIncome,
    livesWithParents: (item) => item?.livesWithParents,
  };
  

  useEffect(() => {
    if (!data || data.length === 0) return;

    const newDropdowns = {};
    for (const field in selectedValues) {
      const values = data.map(fieldPaths[field]).filter(Boolean);
      newDropdowns[field] = ["All", ...Array.from(new Set(values)).sort()];
    }
    setDropdownOptions(newDropdowns);
  }, [data]);

  const handleChange = (field, value) => {
    setSelectedValues((prev) => ({ ...prev, [field]: value === "All" ? "" : value }));
    setOpenFilter(null);
  };

  const handleOpenChange = (field, isOpen) => {
    setOpenFilter(isOpen ? field : null);
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
              {selectedValues[field] || `Select ${field}`}
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
                      className={`ml-auto ${selectedValues[field] === option ? "opacity-100" : "opacity-0"}`}
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
