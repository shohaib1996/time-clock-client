"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeStatusChartItem } from "@/type/dashboard";

interface EmployeeStatusChartProps {
  data: EmployeeStatusChartItem[];
  totalEmployees: number;
}

export function EmployeeStatusChart({ data, totalEmployees }: EmployeeStatusChartProps) {
  // ✅ Fixed: Consistent spelling & labels
  const COLORS = {
    "Checked In": "#22c55e", // Tailwind green-500
    "Checked Out": "#ef4444", // Tailwind red-500
  };

  // ✅ Extract and compute values
  const checkedInValue = data.find((d) => d.name === "Clocked In")?.value || 0;
  const checkedOutValue = Math.max(totalEmployees - checkedInValue, 0);

  // ✅ Construct actual dataset to display
  const adjustedData =
    totalEmployees === 0
      ? [{ name: "No Data", value: 1 }]
      : [
          { name: "Checked In", value: checkedInValue },
          { name: "Checked Out", value: checkedOutValue },
        ];

  // ✅ Choose colors dynamically
  const colorMap =
    checkedInValue === 0 && checkedOutValue > 0
      ? ["#ef4444"]
      : checkedOutValue === 0 && checkedInValue > 0
      ? ["#22c55e"]
      : [COLORS["Checked In"], COLORS["Checked Out"]];

  return (
    <Card className="w-full h-auto">
      <CardHeader>
        <CardTitle>Employee Status</CardTitle>
        <CardDescription>
          {totalEmployees > 0
            ? `Out of ${totalEmployees} total employees`
            : "No employees yet"}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={adjustedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) =>
                name === "No Data" ? "No Employees" : `${name}: ${value}`
              }
              outerRadius={120}
              dataKey="value"
              isAnimationActive={false}
            >
              {adjustedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorMap[index % colorMap.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: number, name: string) =>
                name === "No Data"
                  ? "No employees yet"
                  : `${value} employees`
              }
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              formatter={(value) => {
                if (value === "Checked In")
                  return <span style={{ color: COLORS["Checked In"] }}>🟢 Checked In</span>;
                if (value === "Checked Out")
                  return <span style={{ color: COLORS["Checked Out"] }}>🔴 Checked Out</span>;
                return value;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
