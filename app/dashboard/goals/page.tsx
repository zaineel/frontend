"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Target,
  DollarSign,
  Calendar,
  TrendingUp,
  Edit,
  Trash2,
  ArrowUpCircle,
} from "lucide-react";
import { toast } from "sonner";
import GoalDialog from "./goal-dialog";
import ProgressDialog from "./progress-dialog";
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

type Goal = {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: "savings" | "investment" | "debt" | "other";
};

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch goals on component mount
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/goals");

      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }

      const data = await response.json();
      setGoals(data.goals || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Could not load your financial goals");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    setCurrentGoal(null);
    setIsAddOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setCurrentGoal(goal);
    setIsEditOpen(true);
  };

  const handleUpdateProgress = (goal: Goal) => {
    setCurrentGoal(goal);
    setIsProgressOpen(true);
  };

  const handleDeleteGoal = (goal: Goal) => {
    setCurrentGoal(goal);
    setIsDeleteOpen(true);
  };

  const saveGoal = async (goalData: Omit<Goal, "id">) => {
    setIsSubmitting(true);

    try {
      // Create new goal
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        throw new Error("Failed to create goal");
      }

      toast.success("Financial goal created successfully");
      fetchGoals(); // Refresh goals
      setIsAddOpen(false);
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Could not create your financial goal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateGoal = async (goalId: number, goalData: Partial<Goal>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/goals", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: goalId,
          ...goalData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update goal");
      }

      toast.success("Financial goal updated successfully");
      fetchGoals(); // Refresh goals
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Could not update your financial goal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateGoalProgress = async (goalId: number, newAmount: number) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/goals", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: goalId,
          currentAmount: newAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update progress");
      }

      if (currentGoal && newAmount >= currentGoal.targetAmount) {
        toast.success("🎉 Congratulations! You've reached your goal!");
      } else {
        toast.success("Goal progress updated");
      }

      fetchGoals(); // Refresh goals
      setIsProgressOpen(false);
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Could not update your goal progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteGoal = async () => {
    if (!currentGoal) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/goals", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentGoal.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete goal");
      }

      toast.success("Financial goal deleted");
      fetchGoals(); // Refresh goals
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Could not delete your financial goal");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Button className='w-full sm:w-auto' onClick={handleAddGoal}>
          <Plus className='h-4 w-4 mr-2' />
          Add New Goal
        </Button>
      </div>

      {loading ? (
        <div className='flex justify-center py-8'>
          <p>Loading your financial goals...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className='text-center py-10'>
          <h3 className='text-lg font-medium mb-2'>
            No financial goals set yet
          </h3>
          <p className='text-gray-500 mb-4'>
            Start tracking your financial progress by creating your first goal
          </p>
          <Button onClick={handleAddGoal}>
            <Plus className='h-4 w-4 mr-2' />
            Create Your First Goal
          </Button>
        </div>
      ) : (
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

                  <div className='flex justify-between pt-2'>
                    <div className='space-x-1'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditGoal(goal)}>
                        <Edit className='h-4 w-4 mr-1' />
                        Edit
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-red-600 hover:text-red-700'
                        onClick={() => handleDeleteGoal(goal)}>
                        <Trash2 className='h-4 w-4 mr-1' />
                        Delete
                      </Button>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-green-600 hover:text-green-700'
                      onClick={() => handleUpdateProgress(goal)}>
                      <ArrowUpCircle className='h-4 w-4 mr-1' />
                      Update Progress
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Goal Dialog */}
      {isAddOpen && (
        <GoalDialog
          open={isAddOpen}
          setOpen={setIsAddOpen}
          goal={{
            id: 0,
            title: "",
            targetAmount: 0,
            currentAmount: 0,
            deadline: new Date().toISOString().split("T")[0],
            category: "savings",
          }}
          onSave={saveGoal}
          isLoading={isSubmitting}
        />
      )}

      {/* Edit Goal Dialog */}
      {isEditOpen && currentGoal && (
        <GoalDialog
          open={isEditOpen}
          setOpen={setIsEditOpen}
          goal={currentGoal}
          onSave={(data) => updateGoal(currentGoal.id, data)}
          isLoading={isSubmitting}
        />
      )}

      {/* Progress Update Dialog */}
      {isProgressOpen && currentGoal && (
        <ProgressDialog
          open={isProgressOpen}
          setOpen={setIsProgressOpen}
          goal={currentGoal}
          onUpdate={updateGoalProgress}
          isLoading={isSubmitting}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Financial Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteGoal}
              disabled={isSubmitting}
              className='bg-red-600 hover:bg-red-700'>
              {isSubmitting ? "Deleting..." : "Delete Goal"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
