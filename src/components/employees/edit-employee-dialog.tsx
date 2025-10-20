"use client"

import { useState } from "react"
import type { Employee } from "@/type/employee"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface EditEmployeeDialogProps {
  employee: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (hourlyRate: number) => Promise<void>
}

export function EditEmployeeDialog({ employee, open, onOpenChange, onSave }: EditEmployeeDialogProps) {
  const [hourlyRate, setHourlyRate] = useState(employee?.hourlyRate.toString() || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!hourlyRate || isNaN(Number.parseFloat(hourlyRate))) {
      toast.error("Invalid Input")
      return
    }

    setIsLoading(true)
    try {
      await onSave(Number.parseFloat(hourlyRate))
      toast.success("Success")
      onOpenChange(false)
    } catch (error) {
      console.log(error)
      toast.error("Error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update the hourly rate for this employee. Name and email cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name Field - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input id="name" value={employee?.name || ""} disabled className="bg-muted cursor-not-allowed" />
            <p className="text-xs text-muted-foreground">Read-only field</p>
          </div>

          {/* Email Field - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input id="email" value={employee?.email || ""} disabled className="bg-muted cursor-not-allowed" />
            <p className="text-xs text-muted-foreground">Read-only field</p>
          </div>

          {/* Hourly Rate Field - Editable */}
          <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-sm font-medium">
              Hourly Rate
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">$</span>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                min="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="Enter hourly rate"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
