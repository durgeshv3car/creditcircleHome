import React from "react";
import { SelectedValues } from "./Leads";
import { DataProps } from "../table/columns";
import CategoryMultiSelect from "./CreateMultiSelect";
import { Search, RotateCcw, SlidersHorizontal, Sparkles, X, Filter as FilterIcon } from "lucide-react";

interface FilterProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  data: DataProps[];
  allFilterOptions: Record<string, string[]>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const FIELD_ORDER = [
  "state",
  "city",
  "pincode",
  "dob",
  "netMonthlyIncome",
  "loanType",
  "profession",
];

const getFieldLabel = (field: string) => {
  switch (field) {
    case "dob":
      return "Age";
    case "netMonthlyIncome":
      return "Net Monthly Income";
    case "loanType":
      return "Loan Type";
    default:
      return field.replace(/([A-Z])/g, " $1").trim();
  }
};

export default function Filter({
  selectedValues,
  setSelectedValues,
  data,
  allFilterOptions,
  searchTerm,
  setSearchTerm,
}: FilterProps) {
  const handleSelectChange = (field: string, newValues: string[]) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: newValues,
    }));
  };

  const handleReset = () => {
    const emptyValues: SelectedValues = {};
    Object.keys(selectedValues).forEach((key) => {
      emptyValues[key] = [];
    });
    setSelectedValues(emptyValues);
    setSearchTerm("");
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
      {/* Filter Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#0B1740] text-white flex items-center justify-center shadow-2xs shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Filter Leads
              </h3>
              {activeFiltersCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF1ED] text-[#EA580C] border border-orange-200/80 shadow-2xs">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF6B4A]" />
                  </span>
                  {activeFiltersCount} active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Filter by demographics, location, income and loan preferences
            </p>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 px-3 py-1.5 rounded-md border border-rose-100 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Filter Fields Grid: Perfectly balanced 2x4 on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {FIELD_ORDER.map((field) => {
          const selectedCount = selectedValues[field]?.length || 0;
          const label = getFieldLabel(field);
          return (
            <div key={field} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between px-0.5">
                <label className="text-xs font-semibold text-slate-700 capitalize tracking-tight flex items-center gap-1">
                  <span>{label}</span>
                </label>
                {selectedCount > 0 && (
                  <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFF1ED] px-1.5 py-0.2 rounded-md">
                    {selectedCount} selected
                  </span>
                )}
              </div>
              <CategoryMultiSelect
                label={field}
                selectedIds={selectedValues[field] || []}
                onChange={(newValues) => handleSelectChange(field, newValues)}
                options={allFilterOptions[field] || []}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          );
        })}

        {/* Action Buttons in 8th slot of 2x4 grid */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 h-10 px-3.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 text-xs font-semibold rounded-md shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer group"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 group-hover:-rotate-45 transition-all duration-200" />
            Reset
          </button>
          <button
            type="button"
            className="flex-1 h-10 px-3.5 bg-gradient-to-r from-[#FF6B4A] via-orange-500 to-[#F48220] hover:from-[#E65A38] hover:via-orange-600 hover:to-[#D9532F] text-white text-xs font-semibold rounded-md shadow-xs hover:shadow-md hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer group"
          >
            <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
            Search
          </button>
        </div>
      </div>

      {/* Quick Active Filter Chips Ribbon */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100/90 animate-in fade-in-0 duration-200">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <FilterIcon className="w-3 h-3" /> Active:
          </span>
          {Object.entries(selectedValues).map(([field, values]) => {
            if (!Array.isArray(values) || values.length === 0) return null;
            const fieldLabel = getFieldLabel(field);
            return values.map((val) => (
              <span
                key={`${field}-${val}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 hover:bg-[#FFF1ED] text-slate-700 hover:text-[#EA580C] border border-slate-200/80 hover:border-orange-200 transition-all shadow-2xs group"
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