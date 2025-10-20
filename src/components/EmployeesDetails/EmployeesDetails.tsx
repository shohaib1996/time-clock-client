"use client";

import { EmployeeAPI, TimeAPI } from "@/lib/api";
import { Employee } from "@/type/employee";
import { TimeLogResponse } from "@/type/timeLog";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EmployeesDetails = ({ id }: { id: string }) => {
  // 🧩 Fetch employee details
  const {
    data: employee,
    isLoading,
    isError,
  } = useQuery<Employee>({
    queryKey: ["employeeById", id],
    queryFn: async () => {
      const response = await EmployeeAPI.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });

  // 🧩 Fetch time logs
  const {
    data: timelogData,
    isLoading: timelogLoading,
    isError: timelogError,
  } = useQuery<TimeLogResponse>({
    queryKey: ["employeeTimeLogs", id],
    queryFn: async () => {
      const response = await TimeAPI.getLogs(id);
      return response.data;
    },
    enabled: !!id,
  });

  // Loading and error states
  if (isLoading || timelogLoading)
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading employee details...
      </div>
    );

  if (isError || timelogError || !employee)
    return (
      <div className="text-center text-red-500 font-medium">
        Failed to load employee details.
      </div>
    );

  const logs = timelogData?.logs || [];

  return (
    <div className="mx-auto mt-6 p-6 rounded-2xl shadow-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
      {/* ================= EMPLOYEE INFO ================= */}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Employee Details
      </h2>

      <div className="space-y-3 mb-6">
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium text-gray-900 dark:text-white">
            Name:
          </span>{" "}
          {employee.name}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium text-gray-900 dark:text-white">
            Email:
          </span>{" "}
          {employee.email}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium text-gray-900 dark:text-white">
            Hourly Rate:
          </span>{" "}
          ${employee?.hourlyRate?.toFixed(2) ?? "N/A"}
        </p>
      </div>

      {/* ================= TIME LOGS TABLE ================= */}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
        Time Logs ({logs.length})
      </h3>

      <Table>
        <TableCaption>
          {logs.length === 0
            ? "No logs available for this employee."
            : "A list of recent time logs."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Employee ID</TableHead>
            <TableHead>Pay Amount ($)</TableHead>
            <TableHead>Total Hours</TableHead>
            <TableHead>Clock In</TableHead>
            <TableHead>Clock Out</TableHead>
            <TableHead>Payment Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell className="font-medium">{log.employee}</TableCell>
                <TableCell>{log.payAmount?.toFixed(2) ?? "0.00"}</TableCell>
                <TableCell>{log.totalHours?.toFixed(2) ?? "0.00"}</TableCell>
                <TableCell>
                  {new Date(log.clockIn).toLocaleString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    day: "2-digit",
                    month: "short",
                  })}
                </TableCell>
                <TableCell>
                  {log.clockOut
                    ? new Date(log.clockOut).toLocaleString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        day: "2-digit",
                        month: "short",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.status === "paid"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                No logs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesDetails;