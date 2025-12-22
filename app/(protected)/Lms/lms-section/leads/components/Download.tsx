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
} from "lucide-react";
import { addcsv } from "@/app/(protected)/services/csv/api";
import { toast } from "@/components/ui/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { DataProps } from "../table/columns";
import { SelectedValues } from "../components/Leads";

export interface ImportExportButtonsProps<TData> {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  filteredData: TData[];
  columns: ColumnDef<TData>[];
  selectedRowsData: DataProps[];
  selected: string;
  selectedValues: SelectedValues;
}

const ImportExportButtons = <TData extends Record<string, any>>({
  setRefresh,
  filteredData,
  columns,
  selectedRowsData,
  selected,
  selectedValues,
}: ImportExportButtonsProps<TData>) => {
  const [isLoading, setIsLoading] = useState(false);

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

  // Function to extract exportable columns data
  const getExportableColumns = () => {
    return columns
      .map((col) => {
        const id = typeof col.id === "string" ? col.id : "";

        // Get header
        let header = "";
        if (typeof col.header === "string") {
          header = col.header;
        } else if (
          col.header === undefined &&
          "accessorKey" in col &&
          typeof col.accessorKey === "string"
        ) {
          header = col.accessorKey;
        } else if (
          "accessorFn" in col &&
          typeof col.accessorFn === "function" &&
          id
        ) {
          header = id;
        }

        // Get accessor key safely
        const accessorKey =
          "accessorKey" in col && typeof col.accessorKey === "string"
            ? col.accessorKey
            : id;

        return { accessorKey, header };
      })
      .filter((col) => col.header && col.accessorKey);
  };

  // Function to safely extract data from a row
  const extractRowData = (row: TData, accessorKey: string) => {
    try {
      // Handle nested properties using dot notation (e.g., "user.name")
      if (accessorKey.includes(".")) {
        const parts = accessorKey.split(".");
        let value = row as any;
        for (const part of parts) {
          if (value === null || value === undefined) return "";
          value = value[part];
        }
        return value !== undefined && value !== null ? value : "";
      }

      // Simple property access
      const value = (row as any)[accessorKey];
      return value !== undefined && value !== null ? value : "";
    } catch (error) {
      console.error(`Error extracting data for ${accessorKey}:`, error);
      return "";
    }
  };

  const downloadCSV = async () => {
    try {
      const params = new URLSearchParams();

      Object.entries(selectedValues).forEach(([key, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          values.forEach((value) => {
            params.append(key, value);
          });
        }
      });
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const userIds =
        selectedRowsData.length >= 1
          ? selectedRowsData.map((row) => row.id)
          : selected === "all"
          ? "all"
          : [];
      const response = await fetch(`${BASE_URL}/data/csv?${params.toString()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Failed to generate CSV");
        return;
      }

      // Convert Base64 to Uint8Array
      const csvBytes = Uint8Array.from(atob(data.blob), (c) => c.charCodeAt(0));
      const blob = new Blob([csvBytes], { type: "text/csv" });

      // Create URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.filename; // e.g., "users.csv"
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log(`✅ CSV downloaded (${data.rowCount} rows)`);
    } catch (err) {
      console.error("❌ CSV download error:", err);
    }
  };

  const downloadXLSX = async (selectedValues = {}) => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    /* 🔹 Build query params from selectedValues */
    const params = new URLSearchParams();

    Object.entries(selectedValues).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        values.forEach(value => params.append(key, value));
      }
    });
       const userIds =
        selectedRowsData.length >= 1
          ? selectedRowsData.map((row) => row.id)
          : selected === "all"
          ? "all"
          : [];

    const response = await fetch(
      `${BASE_URL}/data/xlxs?${params.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download XLSX");
    }

    const data = await response.json();

    if (!data.success) {
      alert("Failed to generate Excel file");
      return;
    }

    /* 🔁 Base64 → Uint8Array */
    const binary = atob(data.blob);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    /* 📦 Create XLSX Blob */
    const blob = new Blob([bytes], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    /* ⬇ Trigger Download */
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = data.filename || "users.xlsx";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

    console.log(`✅ XLSX downloaded (${data.rowCount} rows)`);
  } catch (error) {
    console.error("❌ XLSX download error:", error);
    alert("Download failed");
  }
};


  // Function to handle CSV export
  const handleExportCSV = async () => {
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
  };

  // Function to handle XLSX export
  const handleExportXLSX = async() => {
 

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
  };

  return (
    <div className="flex space-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileUp size={16} />
            )}
            Add
            <ChevronDown size={16} className="ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleImportCSV} disabled={isLoading}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Import CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportXLSX} disabled={isLoading}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Import XLSX</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2">
            <FileDown size={16} />
            Download
            <ChevronDown size={16} className="ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleExportCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Export CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportXLSX}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Export XLSX</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ImportExportButtons;
