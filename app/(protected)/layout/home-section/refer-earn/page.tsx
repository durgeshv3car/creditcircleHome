"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ExampleTwo from "../../example2";
import SiteBreadcrumb from "@/components/site-breadcrumb";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

import { columnsRefer } from "./components/columnsRefer";
import { fetchReferImages } from "@/app/(protected)/services/refer-earns/api";

function Users() {
  const allowed = ["superadmin", "admin"];
  const role = "admin";
  if (!allowed.includes(role)) {
    notFound();
  }
  const router = useRouter();

  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const type = "refer";

  const fetchData = async () => {
    try {
      const result = await fetchReferImages(type);

      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [refresh]);

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <ExampleTwo
              tableHeading="Refer List"
              tableData={data}
              tableColumns={columnsRefer(fetchData, router,setSelectedDate,selectedDate,open,setOpen)}
              setRefresh={setRefresh}
              type={type}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Users;
