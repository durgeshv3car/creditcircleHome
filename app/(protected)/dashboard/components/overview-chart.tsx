"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { colors } from "@/lib/colors";
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import { fetchLoans } from "../../services/loans/api";
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
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const chartRef = useRef<any>(null);

  // Load dates from localStorage
  useEffect(() => {
    const storedStart = localStorage.getItem("startDate");
    const storedEnd = localStorage.getItem("endDate");
    if (storedStart && storedEnd) {
      setStartDate(storedStart);
      setEndDate(storedEnd);
    }
  }, []);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const result = await fetchLoans();
        type Loan = {
          loanDataStatus?: Record<string, any>;
          createdAt: string;
          [key: string]: any;
        };

        const filteredLoans = result.filter((loan: Loan) => {
          if (startDate && endDate) {
            const createdDate = new Date(loan.createdAt).toISOString().split('T')[0];
            return createdDate >= startDate && createdDate <= endDate;
          }
          return true; 
        });


        setLoanCount(filteredLoans.length);

        const notAppliedCount = filteredLoans.filter(
          (loan: Loan) =>
            !loan.loanDataStatus ||
            Object.keys(loan.loanDataStatus).length === 0
        ).length;

        setNotApplied(notAppliedCount);
      } catch (error) {
        console.error("Error fetching loan data:", error);
      }
    };

    fetchLoanData();
  }, [startDate, endDate]);

const Applied = Math.max(loanCount - notApplied, 0);
const totalCount = loanCount || 1;

const series = useMemo(() => {
  const appliedPct = (Applied / totalCount) * 100;
  const notAppliedPct = (notApplied / totalCount) * 100;
  return [Math.round(appliedPct), Math.round(notAppliedPct)];
}, [Applied, notApplied, totalCount]);

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
            return `${Applied} loans (${val}%)`;
          }
          return `${notApplied} loans (${val}%)`;
        },
      },
    },
  }),
  [mode, labels, loanCount, Applied, notApplied]
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
      key={`chart-${totalCount}-${Applied}-${notApplied}-${mode}`} 
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
