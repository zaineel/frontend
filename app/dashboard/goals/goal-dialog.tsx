"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Goal = {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: "savings" | "investment" | "debt" | "other";
};

interface GoalDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  goal: Goal;
  onSave: (goal: Omit<Goal, "id">) => void;
  isLoading: boolean;
}

export default function GoalDialog({
  open,
  setOpen,
  goal,
  onSave,
  isLoading,
}: GoalDialogProps) {
  const [formData, setFormData] = useState<Omit<Goal, "id">>({
    title: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
    category: "savings",
  });

  const [errors, setErrors] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  });

  // Initialize form data when dialog opens or goal changes
  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline,
        category: goal.category,
      });
    }
  }, [goal, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "targetAmount" || name === "currentAmount"
          ? Number(value)
          : value,
    }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as Goal["category"],
    }));
  };

  const validateForm = () => {
    const newErrors = {
      title: formData.title.trim() === "" ? "Title is required" : "",
      targetAmount:
        formData.targetAmount <= 0
          ? "Target amount must be greater than 0"
          : "",
      currentAmount:
        formData.currentAmount < 0 ? "Current amount cannot be negative" : "",
      deadline: formData.deadline.trim() === "" ? "Deadline is required" : "",
    };

    // Additional validation: current amount cannot exceed target amount
    if (formData.currentAmount > formData.targetAmount) {
      newErrors.currentAmount = "Current amount cannot exceed target amount";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {goal.id === 0 ? "Create New Goal" : "Edit Goal"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Goal Title</Label>
            <Input
              id='title'
              name='title'
              placeholder='e.g., Emergency Fund'
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className='text-sm text-red-500'>{errors.title}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category'>Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='savings'>Savings</SelectItem>
                <SelectItem value='investment'>Investment</SelectItem>
                <SelectItem value='debt'>Debt Repayment</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='targetAmount'>Target Amount ($)</Label>
            <Input
              id='targetAmount'
              name='targetAmount'
              type='number'
              min='0'
              step='100'
              value={formData.targetAmount}
              onChange={handleChange}
              className={errors.targetAmount ? "border-red-500" : ""}
            />
            {errors.targetAmount && (
              <p className='text-sm text-red-500'>{errors.targetAmount}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='currentAmount'>Current Amount ($)</Label>
            <Input
              id='currentAmount'
              name='currentAmount'
              type='number'
              min='0'
              step='10'
              value={formData.currentAmount}
              onChange={handleChange}
              className={errors.currentAmount ? "border-red-500" : ""}
            />
            {errors.currentAmount && (
              <p className='text-sm text-red-500'>{errors.currentAmount}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='deadline'>Target Date</Label>
            <Input
              id='deadline'
              name='deadline'
              type='date'
              value={formData.deadline}
              onChange={handleChange}
              className={errors.deadline ? "border-red-500" : ""}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.deadline && (
              <p className='text-sm text-red-500'>{errors.deadline}</p>
            )}
          </div>

          <DialogFooter className='pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : goal.id === 0
                ? "Create Goal"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
