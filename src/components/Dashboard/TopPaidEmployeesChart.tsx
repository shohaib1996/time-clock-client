"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TopPaidEmployeeChartItem } from "@/type/dashboard";
import { useTheme } from "next-themes";

interface TopPaidEmployeesChartProps {
  data: TopPaidEmployeeChartItem[];
}

export function TopPaidEmployeesChart({ data }: TopPaidEmployeesChartProps) {
  const { theme } = useTheme();

  // ✅ Limit to 5 and round values
  const formattedData = data
    .slice(0, 5)
    .map((item) => ({
      ...item,
      totalAmount: Number(item.totalAmount.toFixed(2)),
    }));

  // 🎨 Beautiful 5-color palette
  const COLORS = [
    "#22c55e", // Green
    "#3b82f6", // Blue
    "#a855f7", // Purple
    "#f59e0b", // Amber
    "#ef4444", // Red
  ];

  // 🧠 Dark/light theme handling
  const textColor = theme === "dark" ? "#e5e7eb" : "#111827";
  const gridColor =
    theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const tooltipBg =
    theme === "dark" ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.95)";
  const tooltipBorder =
    theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";
  const tooltipText = theme === "dark" ? "#f8fafc" : "#111827";

  return (
    <Card className="w-full h-auto ">
      <CardHeader>
        <CardTitle>Top Paid Employees</CardTitle>
        <CardDescription>Highest earning employees this period</CardDescription>
      </CardHeader>

      <CardContent className="p-0 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] transition-colors">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="name"
              stroke={textColor}
              tick={{ fill: textColor, fontSize: 12 }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              stroke={textColor}
              tick={{ fill: textColor }}
              tickFormatter={(value) => `$${value}`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "0.5rem",
                color: tooltipText,
                backdropFilter: "blur(6px)",
              }}
              labelStyle={{
                color: tooltipText,
                fontWeight: 600,
              }}
              itemStyle={{
                color: tooltipText,
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Earnings"]}
            />

            <Legend
              wrapperStyle={{
                color: textColor,
                fontSize: "0.9rem",
                paddingTop: "1rem",
              }}
            />

            <Bar
              dataKey="totalAmount"
              name="Total Amount"
              radius={[10, 10, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
            >
              {formattedData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke={theme === "dark" ? "#f1f5f9" : "#1e293b"}
                  strokeWidth={0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
