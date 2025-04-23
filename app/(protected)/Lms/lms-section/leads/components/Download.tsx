"use client";

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
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

 const ImportExportButtons = ({ setRefresh, filteredData, columns }) => {
  const [isLoading, setIsLoading] = useState(false);
  const refreshData = () => setRefresh((prev) => !prev);

  // Function to handle CSV import
  const handleImportCSV = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
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
            description: error.message || "Failed to import CSV file",
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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
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
            description: error.message || "Failed to import XLSX file",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    input.click();
  };

  // Function to handle CSV export
  const handleExportCSV = () => {
    if (!filteredData || !filteredData.length || !columns || !columns.length) {
      toast({
        title: "Error",
        description: "No data available for export",
        variant: "destructive",
      });
      return;
    }

    // Filter columns to exclude unwanted data
    const exportableColumns = columns.filter(col => col.accessorKey && col.header);
    const headers = exportableColumns.map(col => col.header);
    let csvContent = headers.join(',') + '\n';

    // Add data rows
    filteredData.forEach(row => {
      const rowData = exportableColumns.map(col => {
        const value = col.accessorKey ? row[col.accessorKey] : '';
        const cellText = String(value !== undefined && value !== null ? value : '').replace(/"/g, '""');
        return `"${cellText}"`;
      });
      csvContent += rowData.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'Users.csv');
  };

  // Function to handle XLSX export
  const handleExportXLSX = () => {
    if (!filteredData || !filteredData.length || !columns || !columns.length) {
      toast({
        title: "Error",
        description: "No data available for export",
        variant: "destructive",
      });
      return;
    }

    // Filter columns to exclude unwanted data
    const exportableColumns = columns.filter(col => col.accessorKey && col.header);
    const headers = exportableColumns.map(col => col.header);
    const excelData = [headers];

    filteredData.forEach(row => {
      const rowData = exportableColumns.map(col => {
        const value = col.accessorKey ? row[col.accessorKey] : '';
        return value !== undefined && value !== null ? value : '';
      });
      excelData.push(rowData);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'TableData');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Users.xlsx');
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
            Import
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
            Export
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
