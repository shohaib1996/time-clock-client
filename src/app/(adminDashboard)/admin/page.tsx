"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "@/lib/api";
import type {
  DashboardCharts,
  DashboardResponse,
  DashboardStats,
} from "@/type/dashboard";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { EmployeeStatusChart } from "@/components/Dashboard/EmployeeStatusChart";
import { MonthlyPaymentsChart } from "@/components/Dashboard/MonthlyPaymentsChart";
import { RecentHoursChart } from "@/components/Dashboard/RecentHoursChart";
import { TopPaidEmployeesChart } from "@/components/Dashboard/TopPaidEmployeesChart";
import {
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Loader2Icon,
} from "lucide-react";

const AdminPage = () => {
  const { data, isLoading, isError, error } = useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await DashboardAPI.getAll();
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">
          <Loader2Icon size={50} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-destructive">
          Error: {error?.message || "Failed to load dashboard"}
        </div>
      </div>
    );
  }

  const stats: DashboardStats = data?.stats || {
    totalEmployees: 0,
    totalActiveEmployees: 0,
    employeesClockedIn: 0,
    totalHoursThisMonth: 0,
    totalPaymentsThisMonth: 0,
    totalPendingPayments: 0,
    newEmployeesThisMonth: 0,
  };
  const charts: DashboardCharts = data?.charts || ({} as DashboardCharts);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8 bg-background dark:bg-transparent">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here&apos;s your business overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="Total Employee"
            value={stats.totalEmployees || 0}
            icon={
              <Users className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            }
            description="Currently working"
            gradient="blue"
          />
          <StatsCard
            title="Clocked In"
            value={stats.employeesClockedIn || 0}
            icon={
              <Clock className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            }
            description="Currently working"
            gradient="blue"
          />

          <StatsCard
            title="Hours This Month"
            value={`${(stats.totalHoursThisMonth || 0).toFixed(1)}h`}
            icon={
              <TrendingUp className="w-6 h-6 text-green-500 dark:text-green-400" />
            }
            description="Total hours logged"
            gradient="green"
          />

          <StatsCard
            title="Payments This Month"
            value={`$${(stats.totalPaymentsThisMonth || 0).toFixed(2)}`}
            icon={
              <DollarSign className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            }
            description="Total paid out"
            gradient="purple"
          />

          <StatsCard
            title="Pending Payments"
            value={`$${(stats.totalPendingPayments || 0).toFixed(2)}`}
            icon={
              <DollarSign className="w-6 h-6 text-orange-500 dark:text-orange-400" />
            }
            description="Awaiting payment"
            gradient="orange"
          />

          <StatsCard
            title="New Employees"
            value={stats.newEmployeesThisMonth || 0}
            icon={<Users className="w-6 h-6 text-red-500 dark:text-red-400" />}
            description="Hired this month"
            gradient="red"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts.employeeStatusChart && (
            <EmployeeStatusChart data={charts.employeeStatusChart} totalEmployees={stats.totalEmployees || 0} />
          )}
          {charts.monthlyPaymentsChart && (
            <MonthlyPaymentsChart data={charts.monthlyPaymentsChart} />
          )}
          {charts.recentHoursChart && (
            <RecentHoursChart data={charts.recentHoursChart} />
          )}
          {charts.topPaidEmployeesChart && (
            <TopPaidEmployeesChart data={charts.topPaidEmployeesChart} />
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminPage;
