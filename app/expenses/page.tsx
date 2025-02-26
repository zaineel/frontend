"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Expense = {
  id: number;
  userId: number | string;
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

  const fetchExpenses = async () => {
    try {
      const res = await fetch("https://backend-9ns2.onrender.com/api/Expenses");
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

  // Filter expenses for the current user with improved string comparison
  const userExpenses = expenses.filter((expense) => {
    if (!user) return false;

    // Normalize both IDs to strings
    const expenseUserId = String(expense.userId);
    const currentUserId = String(user.id);

    // Debug logging
    console.log(
      `Comparing expense userId: ${expenseUserId} with currentUserId: ${currentUserId}`,
      `Types: ${typeof expense.userId}, ${typeof user.id}`
    );
    console.log(`Match: ${expenseUserId === currentUserId}`);

    return expenseUserId === currentUserId;
  });

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

      {/* Debug information - can be removed in production */}
      <div className='bg-gray-100 p-4 rounded mb-4 text-sm'>
        <p>
          <strong>Current user ID:</strong> {user?.id || "Not logged in"} (type:{" "}
          {typeof user?.id})
        </p>
        <p>
          <strong>Total expenses in system:</strong> {expenses.length}
        </p>
        <p>
          <strong>Filtered expenses for you:</strong> {userExpenses.length}
        </p>
        {expenses.length > 0 && (
          <p>
            <strong>First expense userId:</strong> {expenses[0]?.userId} (type:{" "}
            {typeof expenses[0]?.userId})
          </p>
        )}
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
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='text-lg font-bold'>{expense.category}</h3>
                  <p className='text-gray-600'>{expense.description}</p>
                </div>
                <div className='text-xl font-bold text-green-600'>
                  ${expense.amount.toFixed(2)}
                </div>
              </div>
              <p className='text-sm text-gray-500 mt-2'>
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
