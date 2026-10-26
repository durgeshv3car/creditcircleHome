"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { colors } from "@/lib/colors";
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import { fetchLoans, fetchLoansLength } from "../../services/loans/api";
import React, { useEffect, useState, useMemo, useRef } from "react";

interface OverviewChartProps {
  height?: number;
  chartType?: "donut" | "pie" | "radialBar";
  labels?: string[];
}

const OverviewChart = ({
  height = 373,
  chartType = "radialBar",
  labels = ["Apply For Loan", "Not Apply"],
}: OverviewChartProps) => {
  const [config] = useConfig();
  const { theme: mode } = useTheme();

  const [loanCount, setLoanCount] = useState(0);
  const [notApplied, setNotApplied] = useState(0);
  const [applied, setApplied] = useState(0);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const chartRef = useRef<any>(null);

  // Load dates from localStorage
const [isDateLoaded, setIsDateLoaded] = useState(false);

useEffect(() => {
  const storedStart = localStorage.getItem("startDate");
  const storedEnd = localStorage.getItem("endDate");
  if (storedStart && storedEnd) {
    setStartDate(storedStart);
    setEndDate(storedEnd);
  }
  setIsDateLoaded(true);
}, []);

useEffect(() => {
  if (!isDateLoaded) return; // ✅ Wait until localStorage is loaded

  const fetchLoanData = async () => {
    try {
      const result = await fetchLoansLength(startDate || "", endDate || "");
      setLoanCount(result.data);
      setNotApplied(result.notAppliedLoans);
      setApplied(result.appliedLoans);
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  };

  fetchLoanData();
}, [isDateLoaded, startDate, endDate]);


const totalCount = applied+notApplied || 1;

const series = useMemo(() => {
  const appliedPct = (applied / totalCount) * 100;
  const notAppliedPct = (notApplied / totalCount) * 100;
  return [Math.round(appliedPct), Math.round(notAppliedPct)];
}, [applied, notApplied, totalCount]);

const options: any = useMemo(
  () => ({
    chart: {
      toolbar: { show: false },
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "18px",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          },
          value: {
            fontSize: "15px",
            fontWeight: 700,
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: mode === "light" ? colors["default-600"] : colors["default-300"],
            formatter: (val: number) => `${val}%`, 
          },
          total: {
            show: true,
            label: "Total",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: mode === "light" ? colors["default-600"] : colors["default-300"],
            formatter: () => String(loanCount), 
          },
        },
      },
    },
    colors: ["#4669FA", "#0CE7FA"],
    labels: labels,
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
      y: {
        formatter: (val: number, { seriesIndex }: any) => {
          if (seriesIndex === 0) {
            return `${applied} loans (${val}%)`;
          }
          return `${notApplied} loans (${val}%)`;
        },
      },
    },
  }),
  [mode, labels, loanCount, applied, notApplied]
);


  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      try {
        chartRef.current.chart.updateOptions(options, false, false);
        chartRef.current.chart.updateSeries(series, true);
      } catch (e) {
        console.warn("chart update failed, remount fallback may be used", e);
      }
    }
  }, [options, series]);

  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      <div className="w-full flex items-center justify-center">
        <Chart
          key={`chart-${totalCount}-${applied}-${notApplied}-${mode}`} 
          ref={chartRef}
          options={options}
          series={series}
          type={chartType}
          height={height}
          width={"100%"}
        />
      </div>
      <div className="w-full grid grid-cols-2 gap-3 pt-3 mt-auto border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 p-2.5 rounded-sm bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4669FA] shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">Applied</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {applied} <span className="text-[11px] font-normal text-slate-400">({series[0]}%)</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2.5 rounded-sm bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0CE7FA] shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">Not Applied</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {notApplied} <span className="text-[11px] font-normal text-slate-400">({series[1]}%)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewChart;
