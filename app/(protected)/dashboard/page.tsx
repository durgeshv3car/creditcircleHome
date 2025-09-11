"use client";

import { StatisticsBlock } from "@/components/blocks/statistics-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardDropdown from "@/components/dashboard-dropdown";
import dynamic from "next/dynamic";
import { fetchApis } from "../services/apiManagement/api";
import { useEffect, useState } from "react";
import { fetchUsers } from "../services/users/api";
import { fetchLoans } from "../services/loans/api";

const RevinueBarChart = dynamic(
  () => import("@/components/revenue-bar-chart"),
  { ssr: false }
);
const OverviewChart = dynamic(() => import("./components/overview-chart"), {
  ssr: false,
});

const DashboardPage = () => {
  const [apiCount, setApiCount] = useState("");
  const [userCount, setUserCount] = useState("");
  const [loanCount, setLoanCount] = useState("");
  const lengthApi = async () => {
    try {
      const result = await fetchApis();
      setApiCount(result.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const lengthUser = async () => {
    try {
      const result = await fetchUsers();
      setUserCount(result.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const lengthLoan = async () => {
    try {
      const result = await fetchLoans();
      setLoanCount(result.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    lengthApi();
    lengthUser();
    lengthLoan();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-12 items-center gap-5 mb-5">
        <div className="2xl:col-span-12 lg:col-span-8 col-span-12">
          <Card>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-3   gap-4">
                <StatisticsBlock
                  title={"Total Users"}
                  total={userCount}
                  className="bg-info/10 border-none shadow-none"
                />
                <StatisticsBlock
                  title={"Loan Applications"}
                  total={loanCount}
                  className="bg-warning/10 border-none shadow-none"
                  chartColor="#FB8F65"
                />
                <StatisticsBlock
                  title={"Partners"}
                  total={apiCount}
                  className="bg-primary/10 border-none shadow-none"
                  chartColor="#2563eb"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-8 col-span-12">
          <Card>
            <CardContent className="p-4">
              <RevinueBarChart />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex-1">{"Customers Loans"}</CardTitle>
              {/* <DashboardDropdown /> */}
            </CardHeader>
            <CardContent>
              <OverviewChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
