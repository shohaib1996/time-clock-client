"use client";
import { EmployeeAPI } from "@/lib/api";
import type { Employee } from "@/type/employee";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { EditEmployeeDialog } from "@/components/employees/edit-employee-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Link from "next/link";

interface AddEmployeeData {
  name: string;
  email: string;
  hourlyRate: number;
}

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: AddEmployeeData) => Promise<void>;
}

const AddEmployeeDialog = ({
  open,
  onOpenChange,
  onSave,
}: AddEmployeeDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  const handleSubmit = async () => {
    const rateNum = parseFloat(hourlyRate);
    if (!name || !email || isNaN(rateNum) || rateNum <= 0) {
      toast.error("Please fill in all fields with valid data");
      return;
    }
    await onSave({ name, email, hourlyRate: rateNum });
    setName("");
    setEmail("");
    setHourlyRate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Add a new team member to your team.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="john@example.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hourlyRate" className="text-right">
              Hourly Rate
            </Label>
            <Input
              id="hourlyRate"
              type="number"
              step="0.01"
              min="0"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="col-span-3"
              placeholder="25.00"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!name || !email || !hourlyRate}
          >
            Add Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EmployeesPage = () => {
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: employees,
    isLoading,
    isError,
  } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await EmployeeAPI.getAll();
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AddEmployeeData) => {
      return await EmployeeAPI.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setAddDialogOpen(false);
      toast.success("Employee added successfully");
    },
    onError: () => {
      toast.error("Failed to add employee");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { employeeId: string; hourlyRate: number }) => {
      // Replace with your actual API call
      return await EmployeeAPI.update(data.employeeId, {
        hourlyRate: data.hourlyRate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEditingEmployee(null);
      setEditDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      return await EmployeeAPI.delete(employeeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
      toast.success("Employee deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete employee");
    },
  });

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (employeeId: string) => {
    setEmployeeToDelete(employeeId);
    setDeleteDialogOpen(true);
  };

  const handleAddEmployee = async (data: AddEmployeeData) => {
    await createMutation.mutateAsync(data);
  };

  const handleSaveEmployee = async (hourlyRate: number) => {
    if (!editingEmployee) return;
    await updateMutation.mutateAsync({
      employeeId: editingEmployee._id,
      hourlyRate,
    });
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      deleteMutation.mutate(employeeToDelete);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members and their information
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground mt-2">
            Manage your team members and their information
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive font-medium">
              Failed to fetch employees. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-4 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <p className="text-muted-foreground mt-2">
          Manage your team members and their information
        </p>
      </div>

      {/* Employees Table Card */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Team Members</CardTitle>
            <CardDescription>
              {employees?.length || 0} employee
              {employees?.length !== 1 ? "s" : ""} in total
            </CardDescription>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Hourly Rate</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees && employees.length > 0 ? (
                  employees.map((employee) => (
                    <TableRow key={employee._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {employee._id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {employee.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {employee.email}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${employee.hourlyRate.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {employee.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={employee.isActive ? "default" : "secondary"}
                          className={
                            employee.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : ""
                          }
                        >
                          {employee.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`employees/${employee._id}`}>
                            <Button variant="outline" size="sm">
                              View Time log
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(employee)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(employee._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">
                        No employees found
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Employee Dialog */}
      <EditEmployeeDialog
        employee={editingEmployee}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEmployee}
      />

      {/* Add Employee Dialog */}
      <AddEmployeeDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleAddEmployee}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeesPage;
