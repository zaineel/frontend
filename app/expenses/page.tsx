"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all expenses from the API.
    fetch("https://backend-9ns2.onrender.com/api/Expenses")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching expenses");
        }
        return res.json();
      })
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
        setError("Error fetching expenses");
        setLoading(false);
      });
  }, []);

  // Ensure we only display expenses for the logged in user.
  // Note: Adjust the type conversion if your user.id and expense.userId types differ.
  const currentUserId = user?.id;
  const userExpenses = expenses.filter(
    (expense) => expense.userId.toString() === currentUserId
  );

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-2xl font-bold mb-8'>Your Expenses</h1>
      {loading ? (
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
