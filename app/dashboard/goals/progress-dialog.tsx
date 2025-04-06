"use client";

import React, { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

type Goal = {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: "savings" | "investment" | "debt" | "other";
};

interface ProgressDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  goal: Goal;
  onUpdate: (goalId: number, newAmount: number) => void;
  isLoading: boolean;
}

export default function ProgressDialog({
  open,
  setOpen,
  goal,
  onUpdate,
  isLoading,
}: ProgressDialogProps) {
  const [updateType, setUpdateType] = useState<"set" | "add">("add");
  const [amount, setAmount] = useState<number>(0);

  React.useEffect(() => {
    // Reset form when dialog opens
    if (open) {
      setUpdateType("add");
      setAmount(0);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount < 0) {
      toast("Amount cannot be negative");
      return;
    }

    // Calculate new amount based on update type
    let newAmount: number;

    if (updateType === "set") {
      newAmount = amount;

      if (newAmount > goal.targetAmount) {
        toast("Amount cannot exceed target amount");
        return;
      }
    } else {
      // Add to current amount
      newAmount = goal.currentAmount + amount;

      if (newAmount > goal.targetAmount) {
        newAmount = goal.targetAmount;
        toast(`Goal reached! Capped at target amount of $${goal.targetAmount}`);
      }
    }

    onUpdate(goal.id, newAmount);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Update Progress: {goal.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label>Current Progress</Label>
            <div className='text-xl font-semibold'>
              ${goal.currentAmount.toLocaleString()} / $
              {goal.targetAmount.toLocaleString()}
            </div>
            <div className='text-sm text-muted-foreground mt-1'>
              {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
              complete
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Update Type</Label>
            <RadioGroup
              value={updateType}
              onValueChange={(value) => setUpdateType(value as "set" | "add")}
              className='flex flex-col space-y-1'>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='add' id='add' />
                <Label htmlFor='add' className='font-normal'>
                  Add to current amount
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='set' id='set' />
                <Label htmlFor='set' className='font-normal'>
                  Set specific amount
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='amount'>
              {updateType === "add" ? "Amount to Add ($)" : "New Amount ($)"}
            </Label>
            <Input
              id='amount'
              type='number'
              min='0'
              step='10'
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
            {updateType === "set" && (
              <div className='text-xs text-muted-foreground'>
                Must be between $0 and ${goal.targetAmount.toLocaleString()}
              </div>
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
              {isLoading ? "Updating..." : "Update Progress"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
