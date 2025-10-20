import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: "blue" | "green" | "purple" | "orange" | "red"; // 🎨 new prop
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  gradient = "blue",
}: StatsCardProps) {
  const gradients = {
    blue: "from-blue-500/10 via-blue-400/10 to-indigo-500/10 text-blue-600 dark:text-blue-400",
    green:
      "from-green-500/10 via-emerald-400/10 to-teal-500/10 text-green-600 dark:text-green-400",
    purple:
      "from-purple-500/10 via-fuchsia-400/10 to-pink-500/10 text-purple-600 dark:text-purple-400",
    orange:
      "from-orange-500/10 via-amber-400/10 to-yellow-500/10 text-amber-600 dark:text-amber-400",
    red: "from-red-500/10 via-rose-400/10 to-pink-500/10 text-red-600 dark:text-red-400",
  };

  const gradientClass = gradients[gradient];

  return (
    <Card
      className={`hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-gradient-to-br ${gradientClass}`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2 text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div
                className={`text-xs font-semibold mt-2 ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          {icon && (
            <div
              className={`p-3 rounded-xl bg-white/70 dark:bg-white/10 shadow-inner ${gradientClass.replace(
                /text-[^ ]+/,
                ""
              )}`}
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
