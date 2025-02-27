"use client";

import React, { useState } from "react";
import { LineChart, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FolderIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseData, setExpenseData] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExpenseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      alert("You must be logged in to add an expense");
      setIsSubmitting(false);
      return;
    }

    // Generate a numerical userId from the Clerk user.id string
    // This ensures compatibility with the C# backend model which expects an integer
    const numericUserId = generateNumericId(user.id);
    console.log(
      "Generated numeric ID:",
      numericUserId,
      "from original:",
      user.id
    );

    const payload = {
      userId: numericUserId, // Use the numeric ID for backend compatibility
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      description: expenseData.description,
      date: expenseData.date, // expected format: YYYY-MM-DD
    };

    try {
      const res = await fetch(
        "https://backend-9ns2.onrender.com/api/Expenses",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Request failed");
      }
      const data = await res.json();
      console.log("Expense created:", data);
      alert("Expense added successfully!");

      // Reset form and close modal
      setExpenseData({
        amount: "",
        category: "",
        description: "",
        date: "",
      });
      setShowExpenseForm(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Error adding expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to generate a consistent numeric ID from a string
  // This ensures the same string always maps to the same number
  function generateNumericId(str: string): number {
    // Use a simple hash function to convert the string to a number
    // This will ensure consistent numeric IDs for the same string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    // Make sure the ID is positive and within a reasonable range for an int
    return Math.abs(hash) % 1000000000; // Keep it within 9 digits to fit in most int columns
  }

  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
            Total Balance
          </h3>
          <div className='flex items-baseline'>
            <span className='text-3xl font-bold dark:text-white'>
              $24,562.00
            </span>
            <span className='ml-2 text-sm text-green-500'>↑ 2.5%</span>
          </div>
        </Card>
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
            Monthly Income
          </h3>
          <div className='flex items-baseline'>
            <span className='text-3xl font-bold dark:text-white'>
              $8,350.00
            </span>
            <span className='ml-2 text-sm text-green-500'>↑ 1.2%</span>
          </div>
        </Card>
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
            Monthly Expenses
          </h3>
          <div className='flex items-baseline'>
            <span className='text-3xl font-bold dark:text-white'>
              $5,280.00
            </span>
            <span className='ml-2 text-sm text-red-500'>↓ 0.8%</span>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className='flex space-x-4 mb-8'>
        <Button
          className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
          onClick={() => setShowExpenseForm(true)}
          disabled={!user}>
          + Add Expense
        </Button>
        <Button className='bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800'>
          <Target className='w-4 h-4 mr-2' /> Set Goal
        </Button>
        <Button
          variant='secondary'
          className='dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'>
          <LineChart className='w-4 h-4 mr-2' /> Generate Report
        </Button>
      </div>

      {/* Budget Overview and Transactions */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <h3 className='text-xl font-semibold mb-6 dark:text-gray-100'>
            Budget Overview
          </h3>
          <div className='space-y-6'>
            <div>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600 dark:text-gray-300'>
                  Groceries
                </span>
                <span className='text-gray-900 dark:text-gray-100'>
                  $450/$600
                </span>
              </div>
              <Progress
                value={75}
                className='h-2 bg-gray-100 dark:bg-gray-700'
              />
            </div>
            <div>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600 dark:text-gray-300'>
                  Entertainment
                </span>
                <span className='text-gray-900 dark:text-gray-100'>
                  $280/$300
                </span>
              </div>
              <Progress
                value={93}
                className='h-2 bg-gray-100 dark:bg-gray-700'
              />
            </div>
            <div>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600 dark:text-gray-300'>
                  Transportation
                </span>
                <span className='text-gray-900 dark:text-gray-100'>
                  $150/$200
                </span>
              </div>
              <Progress
                value={75}
                className='h-2 bg-gray-100 dark:bg-gray-700'
              />
            </div>
          </div>
        </Card>

        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <h3 className='text-xl font-semibold mb-6 dark:text-gray-100'>
            Recent Transactions
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='bg-blue-100 dark:bg-blue-900 p-2 rounded-lg'>
                  <FolderIcon className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                </div>
                <div className='ml-4'>
                  <p className='text-gray-900 dark:text-gray-100'>
                    Grocery Store
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Mar 15, 2025
                  </p>
                </div>
              </div>
              <span className='text-red-500 dark:text-red-400'>-$85.00</span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='bg-green-100 dark:bg-green-900 p-2 rounded-lg'>
                  <FolderIcon className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
                <div className='ml-4'>
                  <p className='text-gray-900 dark:text-gray-100'>
                    Salary Deposit
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Mar 14, 2025
                  </p>
                </div>
              </div>
              <span className='text-green-500 dark:text-green-400'>
                +$3,450.00
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='bg-purple-100 dark:bg-purple-900 p-2 rounded-lg'>
                  <FolderIcon className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                </div>
                <div className='ml-4'>
                  <p className='text-gray-900 dark:text-gray-100'>Netflix</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Mar 13, 2025
                  </p>
                </div>
              </div>
              <span className='text-red-500 dark:text-red-400'>-$14.99</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Expense Modal */}
      {showExpenseForm && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black opacity-50'
            onClick={() => setShowExpenseForm(false)}></div>
          {/* Modal Content */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-10 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4 dark:text-white'>
              Add Expense
            </h2>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label
                  htmlFor='amount'
                  className='block text-gray-700 dark:text-gray-300 mb-1'>
                  Amount
                </label>
                <input
                  type='number'
                  step='0.01'
                  id='amount'
                  name='amount'
                  value={expenseData.amount}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  required
                />
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='category'
                  className='block text-gray-700 dark:text-gray-300 mb-1'>
                  Category
                </label>
                <input
                  type='text'
                  id='category'
                  name='category'
                  value={expenseData.category}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  required
                />
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='description'
                  className='block text-gray-700 dark:text-gray-300 mb-1'>
                  Description
                </label>
                <textarea
                  id='description'
                  name='description'
                  value={expenseData.description}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  required></textarea>
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='date'
                  className='block text-gray-700 dark:text-gray-300 mb-1'>
                  Date
                </label>
                <input
                  type='date'
                  id='date'
                  name='date'
                  value={expenseData.date}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  required
                />
              </div>
              <div className='flex justify-end space-x-4'>
                <button
                  type='button'
                  onClick={() => setShowExpenseForm(false)}
                  className='px-4 py-2 bg-gray-300 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500'
                  disabled={isSubmitting}>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                  disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
