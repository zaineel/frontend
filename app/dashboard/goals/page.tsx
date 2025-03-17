"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, DollarSign, Calendar, TrendingUp } from "lucide-react";

type Goal = {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: "savings" | "investment" | "debt" | "other";
};

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: "2024-12-31",
      category: "savings",
    },
    {
      id: 2,
      title: "New Car Down Payment",
      targetAmount: 5000,
      currentAmount: 2000,
      deadline: "2025-06-30",
      category: "savings",
    },
    {
      id: 3,
      title: "Investment Portfolio",
      targetAmount: 25000,
      currentAmount: 15000,
      deadline: "2025-12-31",
      category: "investment",
    },
  ]);

  const getCategoryIcon = (category: Goal["category"]) => {
    switch (category) {
      case "savings":
        return <DollarSign className='h-5 w-5' />;
      case "investment":
        return <TrendingUp className='h-5 w-5' />;
      case "debt":
        return <Target className='h-5 w-5' />;
      default:
        return <Calendar className='h-5 w-5' />;
    }
  };

  const getCategoryColor = (category: Goal["category"]) => {
    switch (category) {
      case "savings":
        return "text-green-500 bg-green-100 dark:bg-green-900/30";
      case "investment":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/30";
      case "debt":
        return "text-red-500 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0'>
        <h1 className='text-2xl font-bold'>Financial Goals</h1>
        <Button className='w-full sm:w-auto'>
          <Plus className='h-4 w-4 mr-2' />
          Add New Goal
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysLeft = Math.ceil(
            (new Date(goal.deadline).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <Card
              key={goal.id}
              className='p-6 hover:shadow-lg transition-shadow'>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center space-x-3'>
                  <div
                    className={`p-2 rounded-lg ${getCategoryColor(
                      goal.category
                    )}`}>
                    {getCategoryIcon(goal.category)}
                  </div>
                  <div>
                    <h3 className='font-semibold text-lg'>{goal.title}</h3>
                    <p className='text-sm text-gray-500 capitalize'>
                      {goal.category}
                    </p>
                  </div>
                </div>
                <span className='text-sm text-gray-500'>
                  {daysLeft} days left
                </span>
              </div>

              <div className='space-y-4'>
                <div>
                  <div className='flex justify-between text-sm mb-2'>
                    <span className='text-gray-600 dark:text-gray-300'>
                      Progress
                    </span>
                    <span className='font-medium'>
                      ${goal.currentAmount.toLocaleString()} / $
                      {goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={progress} className='h-2' />
                </div>

                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>Target Date</span>
                  <span className='font-medium'>
                    {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
