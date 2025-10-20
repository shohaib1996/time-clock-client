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
import type { RecentHoursChartItem } from "@/type/dashboard";
import { useTheme } from "next-themes";

interface RecentHoursChartProps {
  data: RecentHoursChartItem[];
}

export function RecentHoursChart({ data }: RecentHoursChartProps) {
  const { theme } = useTheme();

  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item._id).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  // 🎨 Theme-aware colors
  const textColor = theme === "dark" ? "#e5e7eb" : "#111827"; // gray-200 / gray-900
  const gridColor =
    theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const tooltipBg =
    theme === "dark" ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.95)";
  const tooltipBorder =
    theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";
  const tooltipText = theme === "dark" ? "#f8fafc" : "#111827";

  const lineColor = "hsl(var(--chart-2))";

  return (
    <Card className="w-full h-auto ">
      <CardHeader>
        <CardTitle>Recent Hours</CardTitle>
        <CardDescription>Total hours logged per day</CardDescription>
      </CardHeader>

      <CardContent className="p-0 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] transition-colors">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" stroke={textColor} tick={{ fill: textColor }} />
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
              formatter={(value: number) => [`${value} hrs`, "Total Hours"]}
              cursor={{
                stroke: lineColor,
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
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
              dataKey="totalHours"
              stroke={lineColor}
              name="Total Hours"
              strokeWidth={2}
              dot={{
                fill: lineColor,
                r: 4,
                strokeWidth: 1,
                stroke: theme === "dark" ? "#e2e8f0" : "#1f2937",
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
