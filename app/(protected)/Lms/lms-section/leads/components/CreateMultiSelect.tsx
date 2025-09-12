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
import { Span } from "next/dist/trace";

interface CategoryOption {
  id: string;
  title: string;
}

const CategoryMultiSelect = ({
  label,
  selectedIds,
  onChange,
  options,
}: {
  label: string;
  selectedIds: string[];
  onChange: (newValues: string[]) => void;
  options: CategoryOption[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const maxSelectedLabels = 1;

  // Ensure selectedIds is always an array
  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : [];

  const toggleValue = (id: string) => {
    if (safeSelectedIds.includes(id)) {
      onChange(safeSelectedIds.filter((i) => i !== id));
    } else {
      onChange([...safeSelectedIds, id]);
    }
  };

  const filteredOptions = options.filter((cat) =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start flex-wrap">
          {safeSelectedIds.length === 0 ? (
             (label=="dob")?<span>age</span>:<span>{label}</span>
        
          ) : (
            <>
              {options
                .filter((o) => safeSelectedIds.includes(o.id))
                .slice(0, maxSelectedLabels)
                .map((o) => (
                  <Badge
                    key={o.id}
                    className="mr-1 mb-1 flex items-center gap-1"
                  >
                    {o.title}
                    <X
                      size={16}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        onChange(safeSelectedIds.filter((id) => id !== o.id));
                      }}
                    />
                  </Badge>
                ))}
              {safeSelectedIds.length > maxSelectedLabels && (
                <Badge className="mr-1 mb-1">
                  +{safeSelectedIds.length - maxSelectedLabels} more
                </Badge>
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full overflow-y-auto p-0">
        <Command>
          <div className="relative p-2 pb-0">
            <CommandInput
              placeholder="Search categories..."
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
          <CommandList className="p-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((cat) => (
                <CommandItem
                  key={cat.id}
                  onSelect={() => toggleValue(cat.id)}
                  className="flex items-center gap-2"
                >
                  <Checkbox checked={safeSelectedIds.includes(cat.id)} />
                  {cat.title}
                </CommandItem>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-muted-foreground">
                No categories found.
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryMultiSelect;
