"use client";

import React, { useState, useEffect } from "react";
import { SelectedValues } from "./DeviceInfo";
import { DataProps } from "../table/columns";
import CategoryMultiSelect from "./CreateMultiSelect";
import { SlidersHorizontal, RotateCcw, X, Filter as FilterIcon } from "lucide-react";

interface FilterProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  data: DataProps[];
  allFilterOptions: Record<string, any>;
}

const formatFieldLabel = (field: string): string => {
  if (field.toLowerCase() === "phonenumber") return "Phone Number";
  if (field.toLowerCase() === "brand") return "Brand";
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
};

export default function Filter({
  selectedValues,
  setSelectedValues,
  data,
  allFilterOptions,
}: FilterProps) {
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, { id: string; title: string }[]>
  >({});

  useEffect(() => {
    const newDropdowns: Record<string, { id: string; title: string }[]> = {};
    for (const field in allFilterOptions) {
      const raw = allFilterOptions[field];
      const list = Array.isArray(raw) ? raw : Array.from(raw || []);
      newDropdowns[field] = list
        .filter((v: any) => v != null && v !== "")
        .sort()
        .map((value: any) => ({
          id: String(value),
          title: String(value),
        }));
    }
    setDropdownOptions(newDropdowns);
  }, [allFilterOptions]);

  const handleSelectChange = (field: string, newValues: string[]) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: newValues,
    }));
  };

  const handleReset = () => {
    const resetValues: SelectedValues = {};
    Object.keys(selectedValues).forEach((key) => {
      resetValues[key] = [];
    });
    setSelectedValues(resetValues);
  };

  const removeSingleFilter = (field: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((v) => v !== value),
    }));
  };

  const activeFiltersCount = Object.values(selectedValues).reduce(
    (acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0),
    0
  );

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
                Filter Device Info
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
              Filter by phone number, device model and brand details
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
        {Object.keys(selectedValues).map((field) => {
          const selectedCount = selectedValues[field]?.length || 0;
          const label = formatFieldLabel(field);
          return (
            <div key={field} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between px-0.5">
                <label className="text-xs font-semibold text-slate-700 capitalize tracking-tight flex items-center gap-1">
                  <span>{label}</span>
                </label>
                {selectedCount > 0 && (
                  <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFF1ED] px-1.5 py-0.5 rounded-md border border-orange-200">
                    {selectedCount} selected
                  </span>
                )}
              </div>
              <CategoryMultiSelect
                label={field}
                selectedIds={selectedValues[field] || []}
                onChange={(newValues) => handleSelectChange(field, newValues)}
                options={dropdownOptions[field] || []}
              />
            </div>
          );
        })}

        {/* Reset Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="h-10 px-4 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold rounded-md shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset
          </button>
        </div>
      </div>

      {/* Active Filter Chips Ribbon */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 animate-in fade-in-0 duration-200">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <FilterIcon className="w-3 h-3" /> Active:
          </span>
          {Object.entries(selectedValues).map(([field, values]) => {
            if (!Array.isArray(values) || values.length === 0) return null;
            const fieldLabel = formatFieldLabel(field);
            return values.map((val) => (
              <span
                key={`${field}-${val}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 hover:bg-[#FFF1ED] text-slate-700 hover:text-[#EA580C] border border-slate-200 hover:border-orange-200 transition-all shadow-2xs group"
              >
                <span className="text-slate-400 text-[10px] uppercase font-bold">{fieldLabel}:</span>
                <span className="font-semibold">{val}</span>
                <button
                  type="button"
                  onClick={() => removeSingleFilter(field, val)}
                  className="text-slate-400 hover:text-rose-600 ml-0.5 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ));
          })}
        </div>
      )}
    </div>
  );
}
