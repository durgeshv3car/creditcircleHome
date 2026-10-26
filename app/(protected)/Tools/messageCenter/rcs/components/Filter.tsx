"use client";

import * as React from "react";
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
import {
  Check,
  ChevronsUpDown,
  SlidersHorizontal,
  RotateCcw,
  X,
  Filter as FilterIcon,
} from "lucide-react";
import { SelectedValues } from "../page";
import { DataProps } from "../table/columns";
import { cn } from "@/lib/utils";

interface FilterProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  data: DataProps[];
}

export default function Filter({
  selectedValues,
  setSelectedValues,
  data,
}: FilterProps) {
  const [categories, setCategories] = React.useState<string[]>([]);
  const [titles, setTitles] = React.useState<string[]>([]);
  const [users, setUsers] = React.useState<string[]>([]);
  const [numbers, setNumbers] = React.useState<string[]>([]);
  const [openFilter, setOpenFilter] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.offer?.category || "").filter(Boolean))
      ).sort();
      const uniqueTitles = Array.from(
        new Set(data.map((item) => item.title || "").filter(Boolean))
      ).sort();
      const uniqueNumbers = Array.from(
        new Set(data.map((item) => item.user?.phoneNumber || "").filter(Boolean))
      ).sort();
      const uniqueNames = Array.from(
        new Set(data.map((item) => item.user?.firstName || "").filter(Boolean))
      ).sort();

      setCategories(uniqueCategories);
      setTitles(uniqueTitles);
      setUsers(uniqueNames);
      setNumbers(uniqueNumbers);
    }
  }, [data]);

  const handleChange = (field: keyof SelectedValues, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: value === "All" ? "" : value,
    }));
    setOpenFilter(null);
  };

  const handleOpenChange = (field: string, isOpen: boolean) => {
    setOpenFilter(isOpen ? field : null);
  };

  const handleReset = () => {
    setSelectedValues({
      title: null,
      status: null,
      category: null,
      user: "",
      phone: null,
    });
  };

  const removeSingleFilter = (field: keyof SelectedValues) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: field === "user" ? "" : null,
    }));
  };

  const fields: { key: keyof SelectedValues; label: string }[] = [
    { key: "category", label: "Category" },
    { key: "title", label: "Title" },
    { key: "user", label: "Recipient" },
    { key: "phone", label: "Phone Number" },
  ];

  const optionsMap: Record<string, string[]> = {
    category: categories,
    title: titles,
    user: users,
    phone: numbers,
  };

  const activeFiltersCount = fields.filter(({ key }) => {
    const val = selectedValues[key];
    return val !== null && val !== undefined && val !== "" && val !== "All";
  }).length;

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Filter RCS Messages
              </h3>
              {activeFiltersCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/80 shadow-2xs">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-600" />
                  </span>
                  {activeFiltersCount} active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Filter by offer category, RCS campaign title, recipient name, or phone number
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

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {fields.map(({ key, label }) => {
          const currentVal = selectedValues[key];
          const isActive =
            currentVal !== null &&
            currentVal !== undefined &&
            currentVal !== "" &&
            currentVal !== "All";

          const fieldOptions = optionsMap[key] || [];

          return (
            <Popover
              key={key}
              open={openFilter === key}
              onOpenChange={(isOpen) => handleOpenChange(key, isOpen)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-9 px-3 justify-between text-xs rounded-md transition-colors cursor-pointer select-none",
                    isActive
                      ? "bg-purple-50/80 border-purple-200 text-purple-800 font-semibold hover:bg-purple-100/70 hover:border-purple-300"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium"
                  )}
                >
                  <span className="truncate mr-1.5 text-left">
                    {isActive ? currentVal : `All ${label}s`}
                  </span>
                  <ChevronsUpDown className="w-3.5 h-3.5 opacity-50 shrink-0 ml-auto" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={4}
                className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-0 rounded-lg border border-slate-200 bg-white shadow-xl overflow-hidden z-50"
              >
                <div className="px-3 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {label}
                  </span>
                  {isActive && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChange(key, "All");
                      }}
                      className="text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <Command className="w-full">
                  <div className="border-b border-slate-100">
                    <CommandInput
                      placeholder={`Search ${label}...`}
                      className="text-xs h-9 py-1.5 border-0 focus:ring-0 outline-none w-full placeholder:text-slate-400"
                    />
                  </div>
                  <CommandList className="max-h-56 overflow-y-auto p-1 clean-scrollbar">
                    <CommandEmpty className="py-4 text-center text-xs text-slate-400">
                      No options found.
                    </CommandEmpty>

                    <CommandItem
                      value="all"
                      onSelect={() => handleChange(key, "All")}
                      className={cn(
                        "text-xs rounded-md cursor-pointer py-1.5 px-2 flex items-center justify-between transition-colors",
                        !isActive
                          ? "bg-purple-50/80 text-purple-800 font-semibold"
                          : "hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      <span>All {label}s</span>
                      {!isActive && (
                        <Check className="w-3 h-3 text-purple-700" />
                      )}
                    </CommandItem>

                    {fieldOptions.map((option) => {
                      const isSelected = currentVal === option;
                      return (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => handleChange(key, option)}
                          className={cn(
                            "text-xs rounded-md cursor-pointer py-1.5 px-2 flex items-center justify-between transition-colors",
                            isSelected
                              ? "bg-purple-50/80 text-purple-800 font-semibold"
                              : "hover:bg-slate-50 text-slate-700"
                          )}
                        >
                          <span className="truncate">{option}</span>
                          {isSelected && (
                            <Check className="w-3 h-3 text-purple-700" />
                          )}
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

      {/* Active Filter Chips Ribbon */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100/90">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <FilterIcon className="w-3 h-3" /> Active:
          </span>
          {fields.map(({ key, label }) => {
            const val = selectedValues[key];
            if (
              val === null ||
              val === undefined ||
              val === "" ||
              val === "All"
            )
              return null;

            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-800 border border-slate-200/80 hover:border-purple-200 transition-all shadow-2xs"
              >
                <span className="text-slate-400 text-[10px] uppercase font-bold">
                  {label}:
                </span>
                <span className="font-semibold truncate max-w-[150px]">
                  {val}
                </span>
                <button
                  type="button"
                  onClick={() => removeSingleFilter(key)}
                  className="text-slate-400 hover:text-rose-600 ml-0.5 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
