"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { PaymentAPI } from "@/lib/api";
import { TimeLog } from "@/type/timeLog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const UnpaidPaymentsPage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [submitted, setSubmitted] = useState(false);

  const queryClient = useQueryClient();

  // 🧩 Fetch unpaid payments
  const {
    data: unpaidPayments,
    isLoading,
    isError,
  } = useQuery<TimeLog[]>({
    queryKey: ["unpaid-payments", employeeId, startDate, endDate],
    queryFn: async () => {
      const response = await PaymentAPI.getUnpaid({
        employeeId,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
      });
      const logs = response.data.logs;
      if (!logs?.length) toast.info("No unpaid payments found.");
      return logs;
    },
    enabled: submitted,
  });

  // 💰 Payment Mutation
  const payMutation = useMutation({
    mutationFn: async () => {
      if (!employeeId || !startDate || !endDate) {
        throw new Error("Missing employee or date range");
      }
      const payload = {
        employeeId,
        periodStart: format(startDate, "yyyy-MM-dd"),
        periodEnd: format(endDate, "yyyy-MM-dd"),
      };
      const res = await PaymentAPI.create(payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Payment completed successfully!");
      queryClient.invalidateQueries({
        queryKey: ["unpaid-payments", employeeId, startDate, endDate],
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Payment failed.");
    },
  });

  // 🧩 Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      toast.error("Please enter an Employee ID");
      return;
    }
    setSubmitted(true);
  };

  // 🧮 Calculate total pending amount
  const totalPendingAmount =
    unpaidPayments
      ?.filter((log) => log.status === "pending")
      .reduce((sum, log) => sum + log.payAmount, 0)
      .toFixed(2) || "0.00";

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Unpaid Payments
        </h1>

        {/* 💰 Pay Pending Logs Button */}
        {unpaidPayments && unpaidPayments.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Total Pending:{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">
                ${totalPendingAmount}
              </strong>
            </span>
            <Button
              onClick={() => payMutation.mutate()}
              disabled={payMutation.isPending}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              {payMutation.isPending ? "Processing..." : "Pay Pending Logs"}
            </Button>
          </div>
        )}
      </div>

      {/* Filter Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800"
      >
        {/* Employee ID */}
        <Input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full"
        />

        {/* Start Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                !startDate ? "text-gray-400" : ""
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "yyyy-MM-dd") : "Start Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* End Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                !endDate ? "text-gray-400" : ""
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "yyyy-MM-dd") : "End Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Fetch Button */}
        <Button type="submit" className="w-full text-white dark:bg-blue-800 font-semibold">
          Fetch
        </Button>
      </form>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <p className="text-red-500 font-medium mt-4">
          Failed to fetch unpaid payments.
        </p>
      )}

      {/* Table Display */}
      {!isLoading && unpaidPayments && unpaidPayments.length > 0 && (
        <Table>
          <TableCaption>A list of unpaid payments.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pay Amount ($)</TableHead>
              <TableHead>Total Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unpaidPayments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell className="font-medium">{payment.employee}</TableCell>
                <TableCell>
                  {new Date(payment.clockIn).toLocaleString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    day: "2-digit",
                    month: "short",
                  })}
                </TableCell>
                <TableCell>
                  {payment.clockOut
                    ? new Date(payment.clockOut).toLocaleString(undefined, {
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
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : payment.status === "paid"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell>${payment.payAmount.toFixed(2)}</TableCell>
                <TableCell>{payment.totalHours.toFixed(2)} hr</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* No Results */}
      {!isLoading && unpaidPayments && unpaidPayments.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No unpaid payments found for this criteria.
        </p>
      )}
    </div>
  );
};

export default UnpaidPaymentsPage;
