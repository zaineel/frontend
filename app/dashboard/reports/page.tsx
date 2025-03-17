"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Calendar,
  ChevronDown,
} from "lucide-react";

type ReportData = {
  monthlyExpenses: {
    month: string;
    amount: number;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  spendingTrend: {
    date: string;
    amount: number;
  }[];
};

export default function Reports() {
  const [timeRange, setTimeRange] = useState("month");
  const [reportData] = useState<ReportData>({
    monthlyExpenses: [
      { month: "Jan", amount: 2500 },
      { month: "Feb", amount: 3200 },
      { month: "Mar", amount: 2800 },
      { month: "Apr", amount: 3500 },
      { month: "May", amount: 3100 },
      { month: "Jun", amount: 2900 },
    ],
    categoryBreakdown: [
      { category: "Housing", amount: 1500, percentage: 30 },
      { category: "Food", amount: 800, percentage: 16 },
      { category: "Transportation", amount: 600, percentage: 12 },
      { category: "Entertainment", amount: 400, percentage: 8 },
      { category: "Utilities", amount: 300, percentage: 6 },
      { category: "Other", amount: 1400, percentage: 28 },
    ],
    spendingTrend: [
      { date: "2024-01", amount: 2500 },
      { date: "2024-02", amount: 3200 },
      { date: "2024-03", amount: 2800 },
      { date: "2024-04", amount: 3500 },
      { date: "2024-05", amount: 3100 },
      { date: "2024-06", amount: 2900 },
    ],
  });

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0'>
        <h1 className='text-2xl font-bold'>Financial Reports</h1>
        <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
          <div className='relative'>
            <Button variant='outline' className='w-full sm:w-auto'>
              <Calendar className='h-4 w-4 mr-2' />
              {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
              <ChevronDown className='h-4 w-4 ml-2' />
            </Button>
          </div>
          <Button className='w-full sm:w-auto'>
            <Download className='h-4 w-4 mr-2' />
            Export Report
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Monthly Expenses Chart */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold'>Monthly Expenses</h3>
            <BarChart3 className='h-5 w-5 text-gray-500' />
          </div>
          <div className='h-64 flex items-end justify-between space-x-2'>
            {reportData.monthlyExpenses.map((expense, index) => (
              <div key={index} className='flex flex-col items-center'>
                <div
                  className='w-8 bg-blue-500 rounded-t'
                  style={{
                    height: `${(expense.amount / 4000) * 100}%`,
                  }}
                />
                <span className='mt-2 text-sm text-gray-500'>
                  {expense.month}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold'>Category Breakdown</h3>
            <PieChart className='h-5 w-5 text-gray-500' />
          </div>
          <div className='space-y-4'>
            {reportData.categoryBreakdown.map((category, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                    }}
                  />
                  <span className='text-sm'>{category.category}</span>
                </div>
                <div className='flex items-center space-x-4'>
                  <span className='text-sm text-gray-500'>
                    ${category.amount}
                  </span>
                  <span className='text-sm font-medium'>
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Spending Trend */}
        <Card className='p-6 lg:col-span-2'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold'>Spending Trend</h3>
            <LineChart className='h-5 w-5 text-gray-500' />
          </div>
          <div className='h-64 flex items-end justify-between space-x-2'>
            {reportData.spendingTrend.map((data, index) => (
              <div key={index} className='flex flex-col items-center'>
                <div
                  className='w-8 bg-green-500 rounded-t'
                  style={{
                    height: `${(data.amount / 4000) * 100}%`,
                  }}
                />
                <span className='mt-2 text-sm text-gray-500'>
                  {new Date(data.date).toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
