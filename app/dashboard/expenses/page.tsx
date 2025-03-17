"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
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

type Expense = {
  id: number;
  userId: number; // Changed to number to match backend model
  amount: number;
  category: string;
  description: string;
  date: string;
};

export default function Expenses() {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to generate a consistent numeric ID from a string
  // Must match exactly with the function in Dashboard.tsx
  function generateNumericId(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 1000000000; // Keep it within 9 digits
  }

  const fetchExpenses = async () => {
    try {
      // Add the userId as a query parameter if a user is logged in
      const endpoint =
        user && currentUserNumericId
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses?userId=${currentUserNumericId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses`;

      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error("Error fetching expenses");
      }
      const data = await res.json();
      setExpenses(data);
      console.log("Fetched expenses:", data);
      setError(null);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Error fetching expenses");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Polling for real-time updates (every 10 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchExpenses();
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Manual refresh function
  const handleRefresh = () => {
    setRefreshing(true);
    fetchExpenses();
  };

  // Calculate the current user's numeric ID
  const currentUserNumericId = user ? generateNumericId(user.id) : null;

  // Filter expenses for the current user using the numeric ID
  const userExpenses = expenses.filter((expense) => {
    if (!user || currentUserNumericId === null) return false;

    // Both should now be numbers so comparison should work properly
    console.log(
      `Comparing expense userId: ${expense.userId} with generated numericId: ${currentUserNumericId}`
    );

    return expense.userId === currentUserNumericId;
  });

  const handleDelete = async (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses?id=${expenseToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      // Remove the deleted expense from the state
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseToDelete.id)
      );
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold'>Your Expenses</h1>
        <Button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          size='sm'>
          {refreshing ? (
            <>
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              Refreshing...
            </>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      {loading && !refreshing ? (
        <p>Loading expenses...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : userExpenses.length === 0 ? (
        <p>You haven't added any expenses yet.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {userExpenses.map((expense) => (
            <Card
              key={expense.id}
              className='p-4 hover:shadow-lg transition-shadow'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-lg font-bold'>{expense.category}</h3>
                  <p className='text-gray-600'>{expense.description}</p>
                </div>
                <div className='flex flex-col items-end'>
                  <div className='text-xl font-bold text-green-600'>
                    ${expense.amount.toFixed(2)}
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30'
                    onClick={() => handleDelete(expense)}>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
              <p className='text-sm text-gray-500 mt-2'>
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-red-500 hover:bg-red-600'
              disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
