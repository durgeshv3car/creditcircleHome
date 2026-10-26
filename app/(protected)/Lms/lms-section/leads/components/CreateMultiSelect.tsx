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
import {
  X,
  ChevronDown,
  MapPin,
  Building2,
  Hash,
  Calendar,
  Wallet,
  Landmark,
  Briefcase,
  Check,
} from "lucide-react";
import React from "react";

interface CategoryMultiSelectProps {
  label: string;
  selectedIds: string[];
  onChange: (newValues: string[]) => void;
  options: string[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const getFieldIcon = (field: string) => {
  switch (field.toLowerCase()) {
    case "state":
      return <MapPin className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0" />;
    case "city":
      return <Building2 className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0" />;
    case "pincode":
      return <Hash className="w-3.5 h-3.5 text-emerald-500/90 shrink-0" />;
    case "dob":
      return <Calendar className="w-3.5 h-3.5 text-amber-500/90 shrink-0" />;
    case "netmonthlyincome":
      return <Wallet className="w-3.5 h-3.5 text-violet-500/90 shrink-0" />;
    case "loantype":
      return <Landmark className="w-3.5 h-3.5 text-sky-500/90 shrink-0" />;
    case "profession":
      return <Briefcase className="w-3.5 h-3.5 text-teal-500/90 shrink-0" />;
    default:
      return null;
  }
};

const CategoryMultiSelect = ({
  label,
  selectedIds,
  onChange,
  options,
  searchTerm,
  setSearchTerm,
}: CategoryMultiSelectProps) => {
  const maxSelectedLabels = 1;

  // Ensure selectedIds and options are always arrays of strings
  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];
  const safeOptions = Array.isArray(options)
    ? options.filter((opt) => opt != null && opt !== "").map((opt) => String(opt))
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

  const displayLabel =
    label === "dob"
      ? "Age"
      : label === "netMonthlyIncome"
      ? "Net Monthly Income"
      : label === "loanType"
      ? "Loan Type"
      : label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <Popover key={`${label}-${options.length}`}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between items-center h-10 px-3 bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-orange-400 focus:border-[#FF6B4A] rounded-md text-xs font-normal text-slate-700 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 group cursor-pointer"
        >
          <div className="flex items-center gap-2 overflow-hidden truncate flex-1 min-w-0">
            {getFieldIcon(label)}
            <div className="flex items-center flex-wrap gap-1 overflow-hidden truncate">
              {safeSelectedIds.length === 0 ? (
                <span className="text-slate-400 text-xs truncate font-normal">
                  {label === "pincode" ? "Enter Pincode" : `Select ${displayLabel}`}
                </span>
              ) : (
                <>
                  {safeSelectedIds.slice(0, maxSelectedLabels).map((value) => (
                    <Badge
                      key={`badge-${value}`}
                      className="py-0.5 px-2 bg-gradient-to-r from-[#FFF1ED] to-orange-50 text-[#EA580C] border border-orange-200/80 font-semibold text-[11px] rounded-md flex items-center gap-1 shadow-none hover:bg-orange-100/70 transition-colors"
                    >
                      <span className="truncate max-w-[100px]">{value}</span>
                      <X
                        size={12}
                        className="cursor-pointer text-orange-400 hover:text-rose-600 transition-colors shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange(safeSelectedIds.filter((id) => id !== value));
                        }}
                      />
                    </Badge>
                  ))}
                  {safeSelectedIds.length > maxSelectedLabels && (
                    <Badge
                      className="py-0.5 px-1.5 bg-[#FFF1ED] text-[#EA580C] border border-orange-200/80 font-bold text-[11px] rounded-md shadow-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      +{safeSelectedIds.length - maxSelectedLabels}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5 group-hover:text-[#FF6B4A] group-hover:rotate-180 transition-all duration-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[240px] max-h-[320px] overflow-hidden p-0 rounded-lg border border-slate-200/90 bg-white shadow-xl shadow-slate-900/10 animate-in fade-in-0 zoom-in-95 duration-150">
        <Command>
          <div className="relative p-2.5 pb-1 border-b border-slate-100">
            <CommandInput
              placeholder={`Search ${displayLabel.toLowerCase()}...`}
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="pr-8 text-xs h-9 bg-slate-50/60 rounded-md"
            />
            <PopoverClose asChild>
              <button
                type="button"
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </PopoverClose>
          </div>
          {safeSelectedIds.length > 0 && (
            <div className="px-2.5 pt-2 flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-semibold text-slate-500">
                {safeSelectedIds.length} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md h-6 px-2 transition-colors cursor-pointer"
              >
                Clear all
              </Button>
            </div>
          )}
          <CommandList className="p-2 max-h-[220px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = safeSelectedIds.includes(option);
                return (
                  <CommandItem
                    key={`option-${option}`}
                    onSelect={() => toggleValue(option)}
                    className="flex items-center justify-between cursor-pointer rounded-md px-2.5 py-2 text-xs text-slate-700 hover:bg-[#FFF1ED] hover:text-[#EA580C] data-[selected=true]:bg-[#FFF1ED] data-[selected=true]:text-[#EA580C] transition-colors mb-0.5"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Checkbox
                        checked={isSelected}
                        className="rounded-md border-slate-300 data-[state=checked]:bg-[#FF6B4A] data-[state=checked]:border-[#FF6B4A]"
                      />
                      <span className="truncate">{option}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0 ml-1" />
                    )}
                  </CommandItem>
                );
              })
            ) : (
              <div className="px-2 py-4 text-xs text-center text-slate-400">
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