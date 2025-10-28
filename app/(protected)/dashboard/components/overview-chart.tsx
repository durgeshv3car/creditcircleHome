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
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: { fontSize: "22px" },
          value: {
            fontSize: "16px",
            fontWeight: 700,
            color: mode === "light" ? colors["default-600"] : colors["default-300"],
            formatter: (val: number) => `${val}%`, 
          },
          total: {
            show: true,
            label: "Total",
            color: mode === "light" ? colors["default-600"] : colors["default-300"],
            formatter: () => String(loanCount), 
          },
        },
      },
    },
    colors: [colors.primary, colors.info],
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

    <Chart
      key={`chart-${totalCount}-${applied}-${notApplied}-${mode}`} 
      ref={chartRef}
      options={options}
      series={series}
      type={chartType}
      height={height}
      width={"100%"}
    />
  );
};

export default OverviewChart;
