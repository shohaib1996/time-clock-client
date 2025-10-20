"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MonthlyPaymentsChartItem } from "@/type/dashboard";
import { useTheme } from "next-themes";

interface MonthlyPaymentsChartProps {
  data: MonthlyPaymentsChartItem[];
}

const monthNames = [
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
  "Dec",
];

export function MonthlyPaymentsChart({ data }: MonthlyPaymentsChartProps) {
  const { theme } = useTheme();

  const formattedData = data.map((item) => ({
    ...item,
    month: monthNames[item._id - 1] || `Month ${item._id}`,
  }));

  // Define colors that adapt to dark/light theme
  const lineColor = "hsl(var(--chart-1))";
  const textColor = theme === "dark" ? "#e5e7eb" : "#111827"; // gray-200 / gray-900
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const tooltipBg = theme === "dark" ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.95)";
  const tooltipBorder = theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";
  const tooltipText = theme === "dark" ? "#f8fafc" : "#111827";

  return (
    <Card className="w-full h-auto ">
      <CardHeader>
        <CardTitle>Monthly Payments</CardTitle>
        <CardDescription>Payment amounts by month</CardDescription>
      </CardHeader>

      <CardContent className="p-0 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] transition-colors">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={textColor} tick={{ fill: textColor }} />
            <YAxis stroke={textColor} tick={{ fill: textColor }} />

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
              formatter={(value: number) => [`$${value}`, "Total Amount"]}
              cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: "3 3" }}
            />

            <Legend
              wrapperStyle={{
                color: textColor,
                fontSize: "0.9rem",
                paddingTop: "1rem",
              }}
            />

            <Line
              type="monotone"
              dataKey="totalAmount"
              stroke={lineColor}
              name="Total Amount"
              strokeWidth={2}
              dot={{
                fill: lineColor,
                r: 4,
                strokeWidth: 1,
                stroke: theme === "dark" ? "#e2e8f0" : "#1f2937", // subtle border
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: theme === "dark" ? "#e2e8f0" : "#1f2937",
                fill: lineColor,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
