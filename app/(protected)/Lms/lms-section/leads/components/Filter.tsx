import React, { useState, useEffect } from "react";
import { SelectedValues } from "./Leads";
import { DataProps } from "../table/columns";
import CategoryMultiSelect from "./CreateMultiSelect";

interface FilterProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  data: DataProps[];
  allFilterOptions: Record<string, string[]>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}


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

  return (
    <div className="card flex flex-wrap gap-4">
      {Object.keys(selectedValues).map((field) => (
        <div key={field} className="w-[250px] dark:bg-slate-800 bg-white">
          <CategoryMultiSelect
          
            label={field}
            selectedIds={selectedValues[field] || []}
            onChange={(newValues) => handleSelectChange(field, newValues)}
            options={allFilterOptions[field] || []}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      ))}
    </div>
  );
}