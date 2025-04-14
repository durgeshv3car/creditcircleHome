"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandList, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

interface FilterProps {
  selectedValues: Record<string, string>;
  setSelectedValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  data: Array<Record<string, any>>;
}

export default function Filter({ selectedValues, setSelectedValues, data }: FilterProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, string[]>>({});

  const fieldPaths: Record<string, (item: Record<string, any>) => string | undefined> = {
    firstName: (item) => item?.firstName,
    email: (item) => item?.email,
    phone: (item) => item?.phoneNumber,
    dob: (item) => item?.dob,
    pan: (item) => item?.pan,
    pinCode: (item) => item?.pinCode,
    city: (item) => item?.city,
    state: (item) => item?.state,
    houseNo: (item) => item?.houseNo,
    streetAddress: (item) => item?.streetAddress,
    landmark: (item) => item?.landmark,
    gender: (item) => item?.gender,
    education: (item) => item?.education,
    maritalStatus: (item) => item?.maritalStatus,
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const newDropdowns: Record<string, string[]> = {};
    for (const field in selectedValues) {
      const values = data.map(fieldPaths[field]).filter(Boolean) as string[];
      newDropdowns[field] = ["All", ...Array.from(new Set(values)).sort()];
    }
    setDropdownOptions(newDropdowns);
  }, [data]);

  const handleChange = (field: string, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [field]: value === "All" ? "" : value }));
    setOpenFilter(null);
  };

  const handleOpenChange = (field: string, isOpen: boolean) => {
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
