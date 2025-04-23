"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandList, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

export default function Filter({ selectedValues, setSelectedValues, data }) {
  const [categories, setCategories] = React.useState([]);
  const [titles, setTitles] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [numbers, setNumbers] = React.useState([]);
  const [openFilter, setOpenFilter] = React.useState(null);

  React.useEffect(() => {
    if (data.length > 0) {
      const uniqueCategories = Array.from(new Set(data.map(item => item.offer.category))).sort();
      const uniqueTitles = Array.from(new Set(data.map(item => item.title))).sort();
      const uniqueNumbers = Array.from(new Set(data.map(item => item.user.phoneNumber))).sort();
      const uniqueNames = Array.from(new Set(data.map(item => item.user.firstName))).sort();

      setCategories(["All", ...uniqueCategories]);
      setTitles(["All", ...uniqueTitles]);
      setUsers(["All", ...uniqueNames]);
      setNumbers(["All", ...uniqueNumbers]);
    }
  }, [data]);

  const handleChange = (field, value) => {
    setSelectedValues((prev) => ({ ...prev, [field]: value === "All" ? "" : value }));
    setOpenFilter(null); // Close popover after selecting a value
  };

  const handleOpenChange = (field, isOpen) => {
    setOpenFilter(isOpen ? field : null);
  };

  const fields = ["categories", "titles", "users", "numbers"];
  const options = { categories, titles, users, numbers };

  return (
    <div className="flex flex-wrap gap-4">
      {fields.map((field) => (
        <Popover key={field} open={openFilter === field} onOpenChange={(isOpen) => handleOpenChange(field, isOpen)}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              {selectedValues[field] || `Select ${field}`}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {options[field] ? (
                <CommandList>
                  {options[field].map((option) => (
                    <CommandItem key={option} onSelect={() => handleChange(field, option)}>
                      {option}
                      <Check className={`ml-auto ${selectedValues[field] === option ? "opacity-100" : "opacity-0"}`} />
                    </CommandItem>
                  ))}
                </CommandList>
              ) : (
                <CommandInput
                  placeholder={`Enter ${field}...`}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              )}
            </Command>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
