"use client"

import type { Employee } from "@/type/employee"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

interface EmployeeActionsProps {
  employee: Employee
  onEdit: (employee: Employee) => void
  onDelete: (employeeId: string) => void
}

export function EmployeeActions({ employee, onEdit, onDelete }: EmployeeActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(employee)}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(employee._id)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
