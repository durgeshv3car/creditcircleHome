"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { colors } from "@/lib/colors";
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import { fetchLoans } from "../../services/loans/api";
import { useEffect, useState, useMemo } from "react";

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
  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const result = await fetchLoans(); 
        setLoanCount(result.length);

        // Define a type for loan objects
        type Loan = {
          loanDataStatus?: Record<string, any>;
          [key: string]: any;
        };

        const notAppliedCount = result.filter(
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
  }, []);

  const Applied = Math.max(loanCount - notApplied, 0);
  const series = [Applied, notApplied];

  const options: any = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 6,
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
            fontWeight: 700,
            color:
              mode === "light" ? colors["default-600"] : colors["default-300"],
          },
          total: {
            show: true,
            label: "Total",
            color:
              mode === "light" ? colors["default-600"] : colors["default-300"],
            formatter: function (w: any) {
              const total = w.globals.seriesTotals.reduce(
                (a: number, b: number) => a + b,
                0
              );
              return total.toString();
            },
          },
        },
      },
    },
    colors: [colors.primary, colors.info],
    labels: labels,
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type={chartType}
      height={height}
      width={"100%"}
    />
  );
};

export default OverviewChart;
