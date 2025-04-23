import React, { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/soho-light/theme.css";

interface FilterProps {
  selectedValues: Record<string, string[]>;
  setSelectedValues: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  data: Array<Record<string, any>>;
  allFilterOptions: Record<string, Set<string>>; // Add this prop
}

export default function Filter({
  selectedValues,
  setSelectedValues,
  data,
  allFilterOptions, // Get all options
}: FilterProps) {
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, { name: string }[]>
  >({});

  const [customAgeRange, setCustomAgeRange] = useState<{
    min?: number;
    max?: number;
  }>({});
  const [customIncomeRange, setCustomIncomeRange] = useState<{
    min?: number;
    max?: number;
  }>({});

  // Use the full options instead of extracting from filtered data
  useEffect(() => {
    const newDropdowns: Record<string, { name: string }[]> = {};

    // Handle predefined options

    
    // Use the allFilterOptions for other fields
    for (const field in allFilterOptions) {
      newDropdowns[field] = Array.from(allFilterOptions[field])
        .sort()
        .map((value) => ({ name: value }));
    }

    setDropdownOptions(newDropdowns);
  }, [allFilterOptions]); // Only depend on allFilterOptions

  const handleSelectChange = (field: string, selectedOptions: string[]) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: selectedOptions,
    }));
  };

  return (
    <div className="card flex flex-wrap gap-4">
      {Object.keys(selectedValues).map((field) => (
        <div key={field} className="w-[250px]">
          <MultiSelect
            value={(selectedValues[field] || []).map((val) => ({ name: val }))}
            onChange={(e) =>
              handleSelectChange(
                field,
                e.value.map((opt: { name: string }) => opt.name)
              )
            }
            options={dropdownOptions[field] || []}
            optionLabel="name"
            display="chip"
            filter
            placeholder={`Select ${field}`}
            maxSelectedLabels={5}
            className="w-full"
          />

          {/* Show custom age input */}
          {field === "dob" && selectedValues.dob?.includes("Custom") && (
            <div className="mt-2 flex gap-2 items-center">
              <InputNumber
                value={customAgeRange.min}
                onValueChange={(e) =>
                  setCustomAgeRange((prev) => ({ ...prev, min: e.value }))
                }
                placeholder="Min age"
                className="w-full"
              />
              <InputNumber
                value={customAgeRange.max}
                onValueChange={(e) =>
                  setCustomAgeRange((prev) => ({ ...prev, max: e.value }))
                }
                placeholder="Max age"
                className="w-full"
              />
            </div>
          )}

          {/* Show custom income input */}
          {field === "netMonthlyIncome" &&
            selectedValues.netMonthlyIncome?.includes("Custom") && (
              <div className="mt-2 flex gap-2 items-center">
                <InputNumber
                  value={customIncomeRange.min}
                  onValueChange={(e) =>
                    setCustomIncomeRange((prev) => ({ ...prev, min: e.value }))
                  }
                  placeholder="Min income"
                  className="w-full"
                />
                <InputNumber
                  value={customIncomeRange.max}
                  onValueChange={(e) =>
                    setCustomIncomeRange((prev) => ({ ...prev, max: e.value }))
                  }
                  placeholder="Max income"
                  className="w-full"
                />
              </div>
            )}
        </div>
      ))}
    </div>
  );
}