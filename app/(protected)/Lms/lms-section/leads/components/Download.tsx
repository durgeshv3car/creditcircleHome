import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileUp,
  FileDown,
  FileSpreadsheet,
  ChevronDown,
  Loader2,
  Plus,
} from "lucide-react";
import { addcsv, createOtp } from "@/app/(protected)/services/csv/api";
import { toast } from "@/components/ui/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { DataProps } from "../table/columns";
import { SelectedValues } from "../components/Leads";
import OtpModal from "./OtpModal";

export interface ImportExportButtonsProps<TData = any> {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  filteredData: TData[];
  columns: ColumnDef<any, any>[];
  selectedRowsData: DataProps[];
  selected: string;
  selectedValues: SelectedValues;
}

const ImportExportButtons = <TData extends Record<string, any> = any>({
  setRefresh,
  filteredData,
  columns,
  selectedRowsData,
  selected,
  selectedValues,
}: ImportExportButtonsProps<TData>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openOtp, setOpenOtp] = useState(false);
  const [exportType, setExportType] = useState<"csv" | "xlsx" | null>(null);

  const refreshData = () => {
    setRefresh((prev) => !prev);
  };

  // Function to handle CSV import
  const handleImportCSV = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target?.files?.[0];
      if (file) {
        try {
          setIsLoading(true);
          const result = await addcsv(file);

          if (result.success) {
            refreshData();
            toast({
              title: "Success",
              description: "CSV file imported successfully",
            });
          } else {
            throw new Error("Failed to import CSV");
          }
        } catch (error) {
          console.error("Error importing CSV:", error);
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to import CSV file",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    input.click();
  };

  // Function to handle XLSX import
  const handleImportXLSX = () => {
    const payload = {
      userIds:
        selectedRowsData.length >= 1
          ? selectedRowsData.map((row) => row.id)
          : selected === "all"
          ? "all"
          : [],
    };
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement | null;
      const file = target?.files?.[0];
      if (file) {
        try {
          setIsLoading(true);
          const result = await addcsv(file);

          if (result.success) {
            refreshData();
            toast({
              title: "Success",
              description: "XLSX file imported successfully",
            });
          } else {
            throw new Error("Failed to import XLSX");
          }
        } catch (error) {
          console.error("Error importing XLSX:", error);
          toast({
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to import XLSX file",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    input.click();
  };

 const downloadCSV = () => {
  const params = new URLSearchParams();

  Object.entries(selectedValues).forEach(([key, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      values.forEach((value) => params.append(key, value));
    }
  });

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const userIds =
    selectedRowsData.length >= 1
      ? selectedRowsData.map((row) => row.id)
      : selected === "all"
      ? "all"
      : [];

  // 🔥 Hidden form (POST + STREAM DOWNLOAD)
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${BASE_URL}/data/csv?${params.toString()}`;

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "userIds";
  input.value = JSON.stringify(userIds);

  form.appendChild(input);
  document.body.appendChild(form);

  form.submit();
  document.body.removeChild(form);
};


const downloadXLSX = (selectedValues = {}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  /* 🔹 Build query params */
  const params = new URLSearchParams();

  Object.entries(selectedValues).forEach(([key, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      values.forEach((value) => params.append(key, value));
    }
  });

  const userIds =
    selectedRowsData.length >= 1
      ? selectedRowsData.map((row) => row.id)
      : selected === "all"
      ? "all"
      : [];

  /* 🔥 Hidden POST form (REQUIRED) */
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${BASE_URL}/data/xlxs?${params.toString()}`;

  /* 🔹 userIds field */
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "userIds";
  input.value = JSON.stringify(userIds);

  form.appendChild(input);
  document.body.appendChild(form);

  /* ⬇ Native browser download */
  form.submit();

  /* 🧹 Cleanup */
  document.body.removeChild(form);
};

  const onOtpVerified = async () => {
    if (exportType === "csv") {
      try {
        await downloadCSV();
        toast({
          title: "Success",
          description: "CSV file exported successfully",
        });
      } catch (error) {
        console.error("Error exporting CSV:", error);
        toast({
          title: "Error",
          description: "Failed to export CSV file",
          variant: "destructive",
        });
      }
    }
    if (exportType === "xlsx") {
      try {
        await downloadXLSX();

        toast({
          title: "Success",
          description: "XLSX file exported successfully",
        });
      } catch (error) {
        console.error("Error exporting XLSX:", error);
        toast({
          title: "Error",
          description: "Failed to export XLSX file",
          variant: "destructive",
        });
      }
    }
  };

const handleExportCSV = async () => {
  setExportType("csv");
  await createOtp();      
  setOpenOtp(true);       
};

const handleExportXLSX = async () => {
  setExportType("xlsx");
  await createOtp();
  setOpenOtp(true);
};


  return (
    <div className="flex items-center gap-2">
      {/* Export Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-1.5 h-9 px-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-44 p-1 rounded-lg bg-white border border-slate-200 shadow-lg"
          align="end"
        >
          <DropdownMenuItem
            onClick={handleExportCSV}
            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#EA580C] hover:bg-[#FFF1ED] cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
            <span>Export CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleExportXLSX}
            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#EA580C] hover:bg-[#FFF1ED] cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-[#EA580C]" />
            <span>Export XLSX</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Lead Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex items-center gap-1.5 h-9 px-3.5 bg-[#FF6B4A] hover:bg-[#E65A38] text-white text-xs font-semibold rounded-md shadow-sm shadow-orange-500/20 transition-colors cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5 text-white" />
            )}
            <span>Add lead</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-44 p-1 rounded-lg bg-white border border-slate-200 shadow-lg"
          align="end"
        >
          <DropdownMenuItem
            onClick={handleImportCSV}
            disabled={isLoading}
            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#EA580C] hover:bg-[#FFF1ED] cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
            <span>Import CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleImportXLSX}
            disabled={isLoading}
            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-[#EA580C] hover:bg-[#FFF1ED] cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
            <span>Import XLSX</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openOtp && (
        <OtpModal
          open={openOtp}
          onClose={() => setOpenOtp(false)}
          onVerified={onOtpVerified}
        />
      )}
    </div>
  );
};

export default ImportExportButtons;
