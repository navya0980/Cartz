import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: [],
  });

  const fetchStats = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(`${import.meta.env.VITE_URL}/orders/sales`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="sm:pl-[350px] bg-gray-100 py-10 pr-20 mx-auto">
      <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* stats card */}

        <Card className="bg-accent-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalUsers}
          </CardContent>
        </Card>

        <Card className="bg-accent-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalProducts}
          </CardContent>
        </Card>

        <Card className="bg-accent-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalOrders}
          </CardContent>
        </Card>

        <Card className="bg-accent-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₹{stats.totalSales}
          </CardContent>
        </Card>

        {/* sales chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales (Last 30 Days)</CardTitle>
          </CardHeader>

          <CardContent style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.sales}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSales;
