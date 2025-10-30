import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface CategoryMultiSelectProps {
  label: string;
  selectedIds: string[];
  onChange: (newValues: string[]) => void;
  options: string[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const CategoryMultiSelect = ({
  label,
  selectedIds,
  onChange,
  options,
  searchTerm,
  setSearchTerm
}: CategoryMultiSelectProps) => {

  const maxSelectedLabels = 1;
 

  // Ensure selectedIds and options are always arrays of strings
  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];
  const safeOptions = Array.isArray(options) 
    ? options.filter(opt => opt != null && opt !== "").map(opt => String(opt))
    : [];

  const toggleValue = (value: string) => {
    if (safeSelectedIds.includes(value)) {
      onChange(safeSelectedIds.filter((v) => v !== value));
    } else {
      onChange([...safeSelectedIds, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const filteredOptions = safeOptions.filter((option) =>
    String(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayLabel = label === "dob" ? "Age" : label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <Popover key={`${label}-${options.length}`}  >
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start flex-wrap h-auto min-h-[40px]">
          {safeSelectedIds.length === 0 ? (
            <span>{displayLabel}</span>
          ) : (
            <>
              {safeSelectedIds.slice(0, maxSelectedLabels).map((value) => (
                <Badge
                  key={`badge-${value}`}
                  className="mr-1 mb-1 flex items-center gap-1"
                >
                  {value}
                  <X
                    size={16}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(safeSelectedIds.filter((id) => id !== value));
                    }}
                  />
                </Badge>
              ))}
              {safeSelectedIds.length > maxSelectedLabels && (
                <Badge 
                  className="mr-1 mb-1 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  +{safeSelectedIds.length - maxSelectedLabels} more
                </Badge>
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full overflow-y-auto p-0 max-h-[300px]">
        <Command>
          <div className="relative p-2 pb-0">
            <CommandInput
              placeholder={`Search ${displayLabel.toLowerCase()}...`}
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="pr-10"
            />
            <PopoverClose asChild>
              <button
                type="button"
                className="absolute right-4 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </PopoverClose>
          </div>
          {safeSelectedIds.length > 0 && (
            <div className="px-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="w-full text-xs"
              >
                Clear all ({safeSelectedIds.length})
              </Button>
            </div>
          )}
          <CommandList className="p-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <CommandItem
                  key={`option-${option}`}
                  onSelect={() => toggleValue(option)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox checked={safeSelectedIds.includes(option)} />
                  {option}
                </CommandItem>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-muted-foreground">
                No options found.
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryMultiSelect;