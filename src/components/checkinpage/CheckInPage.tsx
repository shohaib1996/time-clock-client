"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeeAPI, TimeAPI } from "@/lib/api";
import { Employee } from "@/type/employee";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

export default function CheckInPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const queryClient = useQueryClient();

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await EmployeeAPI.getAll();
      return response.data.data;
    },
  });

  const clockInMutation = useMutation({
    mutationFn: async ({
      employeeId,
      pin,
    }: {
      employeeId: string;
      pin: string;
    }) => {
      return await TimeAPI.clockIn(employeeId, pin);
    },
    onSuccess: () => {
      toast.success("Check in successful!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      toast.error("Invalid credential!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: async ({
      employeeId,
      pin,
    }: {
      employeeId: string;
      pin: string;
    }) => {
      return await TimeAPI.clockOut(employeeId, pin);
    },
    onSuccess: () => {
      toast.success("Check out successful!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      toast.error("Invalid credential!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const handleSelect = (id: string) => {
    setSelectedId(selectedId === id ? null : id);
    setPin("");
  };

  const handleCheck = (employee: Employee) => {
    if (employee.isActive) {
      clockOutMutation.mutate({ employeeId: employee._id, pin });
    } else {
      clockInMutation.mutate({ employeeId: employee._id, pin });
    }
    setSelectedId(null);
    setPin("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br pt-10 from-violet-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors flex flex-col items-center px-4">
      <div className="max-w-4xl w-full text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          SteveClock Employee Check-In
        </h1>
        <p className="text-muted-foreground">
          Select your name, enter your PIN, and check in or out.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {employees?.map((emp) => {
          const isSelected = selectedId === emp._id;
          const isCheckedIn = emp.isActive;

          return (
            <Card
              key={emp._id}
              className={`cursor-pointer overflow-hidden border-2 transition-all duration-300 ${
                isCheckedIn
                  ? "border-green-500 shadow-md shadow-green-200 dark:shadow-green-900/40"
                  : "border-transparent hover:border-violet-500 hover:shadow-md"
              }`}
              onClick={() => handleSelect(emp._id)}
            >
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{emp.name}</h2>
                  {isCheckedIn && (
                    <Badge
                      variant="secondary"
                      className="bg-green-500 text-white"
                    >
                      Checked In
                    </Badge>
                  )}
                </div>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-3 space-y-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Input
                        type="password"
                        placeholder="Enter PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="text-center"
                      />
                      <Button
                        className={`w-full rounded-xl font-semibold ${
                          isCheckedIn
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-violet-600 hover:bg-violet-700"
                        }`}
                        onClick={() => handleCheck(emp)}
                        disabled={!pin}
                      >
                        {isCheckedIn ? "Check Out" : "Check In"}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
