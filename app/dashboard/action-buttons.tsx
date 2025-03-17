"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Target, FileText, Upload, Receipt, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionButtonsProps {
  onAddExpense: () => void;
  onSetGoal: () => void;
  onGenerateReport: () => void;
  onUploadReceipt: () => void;
}

export default function ActionButtons({
  onAddExpense,
  onSetGoal,
  onGenerateReport,
  onUploadReceipt,
}: ActionButtonsProps) {
  return (
    <div className='flex flex-col sm:flex-row gap-4 mb-8'>
      {/* Primary Action Button */}
      <Button
        onClick={onAddExpense}
        className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'>
        <Plus className='h-4 w-4 mr-2' />
        Add Expense
      </Button>

      {/* Secondary Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='flex-1'>
            <Wallet className='h-4 w-4 mr-2' />
            More Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <DropdownMenuItem onClick={onSetGoal}>
            <Target className='h-4 w-4 mr-2' />
            Set Goal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onGenerateReport}>
            <FileText className='h-4 w-4 mr-2' />
            Generate Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUploadReceipt}>
            <Receipt className='h-4 w-4 mr-2' />
            Upload Receipt
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
