"use client"
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const dummyData = {
  daily: [
    { date: "Mon", leads: 5 },
    { date: "Tue", leads: 8 },
    { date: "Wed", leads: 6 },
    { date: "Thu", leads: 10 },
    { date: "Fri", leads: 7 },
    { date: "Sat", leads: 12 },
    { date: "Sun", leads: 9 },
  ],
  weekly: [
    { date: "Week 1", leads: 45 },
    { date: "Week 2", leads: 58 },
    { date: "Week 3", leads: 49 },
    { date: "Week 4", leads: 62 },
  ],
  monthly: [
    { date: "Jan", leads: 180 },
    { date: "Feb", leads: 200 },
    { date: "Mar", leads: 190 },
    { date: "Apr", leads: 210 },
  ],
};

const DashboardPage = () => {
  const [filter, setFilter] = useState("daily");

  return (
    <div className="space-y-5 p-6">
      <h1 className="text-2xl font-semibold">Leads Dashboard</h1>
      <Tabs defaultValue="daily" onValueChange={(val) => setFilter(val)}>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value={filter}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Total {filter} leads</p>
                <p className="text-xl font-bold">
                  {dummyData[filter].reduce((acc, item) => acc + item.leads, 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">Lead Source 1</CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">Lead Source 2</CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">Lead Source 3</CardContent>
            </Card>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyData[filter]}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
