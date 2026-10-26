"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronsUpDown,
  Phone,
  Smartphone,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryOption {
  id: string;
  title: string;
}

interface CategoryMultiSelectProps {
  label: string;
  selectedIds: string[];
  onChange: (newValues: string[]) => void;
  options: CategoryOption[] | string[];
}

const getFieldIcon = (field: string) => {
  switch (field.toLowerCase()) {
    case "phonenumber":
      return <Phone className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0" />;
    case "brand":
      return <Smartphone className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0" />;
    default:
      return null;
  }
};

const formatFieldLabel = (field: string): string => {
  if (field.toLowerCase() === "phonenumber") return "Phone Number";
  if (field.toLowerCase() === "brand") return "Brand";
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
};

const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({
  label,
  selectedIds,
  onChange,
  options,
}) => {
  const [open, setOpen] = useState(false);
  const maxSelectedLabels = 1;

  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];

  // Normalize options to { id: string, title: string }
  const normalizedOptions: CategoryOption[] = (options || []).map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return {
        id: String(opt.id ?? opt.title ?? ""),
        title: String(opt.title ?? opt.id ?? ""),
      };
    }
    return { id: String(opt), title: String(opt) };
  });

  const toggleValue = (id: string) => {
    if (safeSelectedIds.includes(id)) {
      onChange(safeSelectedIds.filter((i) => i !== id));
    } else {
      onChange([...safeSelectedIds, id]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const displayTitle = formatFieldLabel(label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between items-center h-10 px-3 bg-white text-xs font-normal rounded-md transition-colors shadow-2xs cursor-pointer select-none",
            safeSelectedIds.length > 0
              ? "border-[#FFD7CC] bg-[#FFF1ED]/40 text-slate-900 hover:bg-[#FFF1ED]/70 hover:border-orange-300"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden truncate flex-1 min-w-0 mr-1.5">
            {getFieldIcon(label)}
            {safeSelectedIds.length === 0 ? (
              <span className="text-slate-400 text-xs truncate font-normal">
                Select {displayTitle}...
              </span>
            ) : (
              <div className="flex items-center gap-1.5 overflow-hidden truncate">
                {safeSelectedIds.slice(0, maxSelectedLabels).map((id) => {
                  const opt = normalizedOptions.find((o) => o.id === id);
                  const title = opt ? opt.title : id;
                  return (
                    <span
                      key={`badge-${id}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FFF1ED] text-[#EA580C] border border-[#FFD7CC] shrink-0"
                    >
                      <span className="truncate max-w-[110px]">{title}</span>
                      <X
                        size={12}
                        className="cursor-pointer text-orange-400 hover:text-rose-600 transition-colors shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleValue(id);
                        }}
                      />
                    </span>
                  );
                })}
                {safeSelectedIds.length > maxSelectedLabels && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-[#FFF1ED] text-[#EA580C] border border-[#FFD7CC] shrink-0">
                    +{safeSelectedIds.length - maxSelectedLabels}
                  </span>
                )}
              </div>
            )}
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 opacity-50 shrink-0 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        collisionPadding={12}
        className="w-[var(--radix-popover-trigger-width)] min-w-[240px] p-0 rounded-lg border border-slate-200 bg-white shadow-xl overflow-hidden z-50"
      >
        {/* Header */}
        <div className="px-3 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800 truncate">
            {displayTitle}
          </span>
          {safeSelectedIds.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-2"
            >
              Clear
            </button>
          )}
        </div>

        <Command className="w-full">
          <div className="border-b border-slate-100">
            <CommandInput
              placeholder={`Search ${displayTitle}...`}
              className="text-xs h-9 py-1.5 border-0 focus:ring-0 outline-none w-full placeholder:text-slate-400"
            />
          </div>
          <CommandList className="max-h-56 overflow-y-auto p-1 clean-scrollbar">
            <CommandEmpty className="py-4 text-center text-xs text-slate-400">
              No {displayTitle.toLowerCase()} found.
            </CommandEmpty>
            {normalizedOptions.map((cat) => {
              const isSelected = safeSelectedIds.includes(cat.id);
              return (
                <CommandItem
                  key={cat.id}
                  value={`${cat.id} ${cat.title}`}
                  onSelect={() => toggleValue(cat.id)}
                  className={cn(
                    "text-xs rounded-md cursor-pointer py-1.5 px-2 flex items-center justify-between transition-colors",
                    isSelected
                      ? "bg-[#FFF1ED] text-[#EA580C] font-semibold"
                      : "hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={cn(
                        "w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors shrink-0",
                        isSelected
                          ? "bg-[#FF6B4A] border-[#FF6B4A] text-white"
                          : "border-slate-300 bg-white"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      )}
                    </div>
                    <span className="truncate">{cat.title}</span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryMultiSelect;
