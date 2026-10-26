"use client"

import { useConfig } from "@/hooks/use-config";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RevenueBarChartProps {
  height?: number;
  chartType?: "bar" | "area";
  series?: any[];
  chartColors?: string[];
  showTitle?: boolean;
}
const defaultSeries = [{
  name: "Cashe",
  data: [44, 55, 57, 56, 61, 58, 63, 60, 66,89,67,98],
},
{
  name: "Money Control",
  data: [76, 85, 101, 98, 87, 105, 91, 114, 94,56,90,95],
},
{
  name: "Bank",
  data: [35, 41, 36, 26, 45, 48, 52, 53, 41,45,65,34],
}]
const RevenueBarChart = ({
  height = 400,
  chartType = "bar",
  series = defaultSeries,
  chartColors = ["#4669FA", "#0CE7FA", "#FA916B"],
  showTitle = true,
}: RevenueBarChartProps) => {
  const [config] = useConfig();
  const { isRtl } = config;

  const { theme: mode } = useTheme();
  const options: any = {
    chart: {
      toolbar: {
        show: false,
      },
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: "45%",
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      offsetY: showTitle ? -30 : 0,
      markers: {
        width: 8,
        height: 8,
        offsetY: -1,
        offsetX: -5,
        radius: 0,
      },
      labels: {
        colors: mode === "dark" ? "#CBD5E1" : "#475569",
      },
      itemMargin: {
        horizontal: 18,
        vertical: 0,
      },
    },
    title: {
      text: showTitle ? "Partners Loan Approval" : "",
      align: "left",
      offsetY: showTitle ? 13 : 0,
      offsetX: isRtl ? "0%" : 0,
      floating: false,
      style: {
        fontSize: showTitle ? "20px" : "0px",
        fontWeight: "600",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: mode === "dark" ? "#fff" : "#0f172a",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    yaxis: {
      labels: {
        style: {
          colors: mode === "dark" ? "#CBD5E1" : "#475569",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      labels: {
        style: {
          colors: mode === "dark" ? "#CBD5E1" : "#475569",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val;
        },
      },
    },
    colors: chartColors,
    grid: {
      show: false,
      borderColor: mode === "dark" ? "#334155" : "#E2E8F0",
      strokeDashArray: 10,
      position: "back",
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: "bottom",
            offsetY: 8,
            horizontalAlign: "center",
          },
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: "80%",
            },
          },
        },
      },
    ],
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

export default RevenueBarChart;
