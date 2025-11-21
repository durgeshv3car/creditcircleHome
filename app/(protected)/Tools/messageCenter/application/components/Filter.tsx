"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandList, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { SelectedValues } from "../page";
import { fetchNotificationsFilters } from "@/app/(protected)/services/notifications/app/api";

interface FilterProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
}

export default function Filter({ selectedValues, setSelectedValues }: FilterProps) {
  const [titles, setTitles] = React.useState<string[]>([]);
  const [statuses, setStatuses] = React.useState<string[]>([]);
  const [counteres, setCounteres] = React.useState<string[]>([]);
  const [openFilter, setOpenFilter] = React.useState<string | null>(null);

  // ✅ Fetch unique filter options from API
  const fetchFilterOptions = async () => {
    try {
      const response = await fetchNotificationsFilters("application");
      console.log(response)
      setTitles(response.titles || []);
      setStatuses(response.statuses || []);
      setCounteres(response.counter || [])
    } catch (error) {
      console.error("❌ Error fetching filter options:", error);
    }
  };

  React.useEffect(() => {
    fetchFilterOptions();
  }, []);

  // ✅ Handle value selection
  const handleChange = (field: keyof SelectedValues, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: value === "All" ? "" : value, // Store empty string for "All"
    }));
    setOpenFilter(null);
  };

  const handleOpenChange = (field: string, isOpen: boolean) => {
    setOpenFilter(isOpen ? field : null);
  };

  // ✅ Define fields and map data correctly
  const fields: (keyof SelectedValues)[] = ["title", "status","counter"];
  const options: Record<string, string[]> = {
    title: titles,
    status: statuses,
    counter:counteres
  };

  return (
    <div className="flex flex-wrap gap-4">
      {fields.map((field) => (
        <Popover
          key={field}
          open={openFilter === field}
          onOpenChange={(isOpen) => handleOpenChange(field, isOpen)}
        >
          <PopoverTrigger asChild>
         <Button variant="outline" className="w-[200px] justify-between">
  {selectedValues[field]
    ? selectedValues[field].length > 30
      ? `${selectedValues[field].slice(0, 24)}...`
      : selectedValues[field]
    : `All ${field}s`}
  <ChevronsUpDown className="opacity-50" />
</Button>

          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandItem key="all" onSelect={() => handleChange(field, "All")}>
                  All
                  <Check
                    className={`ml-auto ${
                      selectedValues[field] === "" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </CommandItem>

                {options[field]?.map((option) => (
                  <CommandItem key={option} onSelect={() => handleChange(field, option)}>
                    {option}
                    <Check
                      className={`ml-auto ${
                        selectedValues[field] === option ? "opacity-100" : "opacity-0"
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
