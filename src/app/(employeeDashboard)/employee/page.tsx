"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useUser from "@/hooks/use-user";
import { EmployeeAPI, DashboardAPI, AuthAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EmployeePage = () => {
  const user = useUser();
  const employeeId = user?.id;

  // --- Local state for password change ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);

  // --- Queries ---
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["employee-profile", employeeId],
    queryFn: () => EmployeeAPI.getProfile(employeeId as string),
    enabled: !!employeeId,
  });

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useQuery({
    queryKey: ["employee-dashboard", employeeId],
    queryFn: () => DashboardAPI.getEmployeeDashboard(employeeId as string),
    enabled: !!employeeId,
  });

  // --- Handle Change Password ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;

    if (!oldPassword || !newPassword) {
      toast.error("Please fill in both fields");
      return;
    }

    setIsChanging(true);
    try {
      const res = await AuthAPI.chanagePassword({
        userId: employeeId,
        oldPassword,
        newPassword,
      });
      console.log(res)
      if (res) {
        toast.success("Password changed successfully!");
      }else{
        toast.error("Invalid credential")
      }
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast.error("Failed to change password");
    } finally {
      setIsChanging(false);
    }
  };

  // --- Conditional states ---
  if (!employeeId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading user...
      </div>
    );
  }

  const loading = profileLoading || dashboardLoading;
  const error = profileError || dashboardError;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <Loader2 className="animate-spin h-6 w-6 mb-2" />
        <p>Loading employee data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-medium">
        Failed to fetch employee data. Please try again later.
      </div>
    );
  }

  const profile = profileData?.data;
  const dashboard = dashboardData?.data;
  const logs = dashboard?.timeLogs || [];

  return (
    <div className="container mx-auto py-10 px-3 space-y-10">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {profile?.name || "Employee"} 👋
      </h1>

      {/* 🔐 Change Password, 👤 Profile Info & 📊 Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 🔐 Change Password */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Old Password</label>
              <Input
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button type="submit" disabled={isChanging} className="w-full mt-2">
              {isChanging ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Changing...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </div>

        {/* 👤 Profile Info */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Profile Information</h2>
          <p>
            <span className="font-medium">Name:</span> {profile?.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {profile?.email}
          </p>
          <p>
            <span className="font-medium">Hourly Rate:</span> $
            {profile?.hourlyRate}
          </p>
        </div>

        {/* 📊 Dashboard Info */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Dashboard Overview</h2>
          <p>
            <span className="font-medium">Total Hours Worked:</span>{" "}
            {dashboard?.stats?.totalHoursWorked || 0}
          </p>
          <p>
            <span className="font-medium">Pending Payments:</span>{" "}
            {dashboard?.stats?.pendingPayments || 0}
          </p>
          <p>
            <span className="font-medium">Total Paid:</span> $
            {dashboard?.stats?.totalPaid || 0}
          </p>
        </div>
      </div>

      {/* 🕒 Time Logs Table */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Time Logs</h2>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableCaption>A summary of your recent working hours</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead className="text-center">Total Hours</TableHead>
                <TableHead className="text-center">Pay Amount ($)</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {logs.length > 0 ? (
                logs.map((log: any) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      {new Date(log.clockIn).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {log.clockOut
                        ? new Date(log.clockOut).toLocaleString()
                        : "--"}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {log.totalHours?.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {log.payAmount?.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          log.status === "paid"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {log.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No time logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
