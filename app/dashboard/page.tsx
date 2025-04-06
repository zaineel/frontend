"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Target,
  Check,
  X,
  AlertCircle,
  Upload,
  FolderIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import ActionButtons from "./action-buttons";
import { useSubscription } from "../context/SubscriptionContext";
import { useRouter } from "next/navigation";
import SubscriptionStatus from "./subscription-status";

export default function Dashboard() {
  const { user } = useUser();
  const { subscription, isSubscriptionValid } = useSubscription();
  const router = useRouter();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expenseData, setExpenseData] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptSource, setReceiptSource] = useState<string | null>(null);

  // Define the Expense type
  interface Expense {
    id: number;
    userId: number;
    amount: number;
    category: string;
    description: string;
    date: string;
  }

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success", // "success", "error"
  });

  // Check if user has valid subscription
  useEffect(() => {
    if (user && !isSubscriptionValid) {
      // Check if this is a success redirect from Stripe
      const urlParams = new URLSearchParams(window.location.search);
      const isSuccessfulPayment =
        urlParams.get("success") === "true" && urlParams.has("session_id");

      if (isSuccessfulPayment) {
        // Set the subscription cookie if this is a successful redirect
        document.cookie = `has_subscription=true; path=/; max-age=${
          60 * 60 * 24 * 30
        }`;
        console.log("Setting subscription cookie after successful payment");

        // Show success notification
        setNotification({
          show: true,
          message: "Your subscription has been activated successfully!",
          type: "success",
        });

        // Don't redirect since we're already on the dashboard
        return;
      }

      // Otherwise redirect to subscribe page
      console.log(
        "No valid subscription detected, redirecting to subscribe page"
      );
      router.push("/subscribe");
    }
  }, [user, isSubscriptionValid, router]);

  // Fetch expenses when component mounts or user changes
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const numericUserId = generateNumericId(user.id);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses?userId=${numericUserId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setNotification({
          show: true,
          message: "Failed to load expenses",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [user]);

  // Calculate monthly expenses
  const calculateMonthlyExpenses = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  // Get recent transactions (last 5)
  const getRecentTransactions = () => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  // Calculate budget overview
  const calculateBudgetOverview = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    // Group expenses by category
    const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for the UI
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      // Using a default budget of amount * 1.5 for demonstration
      budget: amount * 1.5,
      percentage: (amount / (amount * 1.5)) * 100,
    }));
  };

  // Hide notification after timeout
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (notification.show) {
      timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 5000); // Hide after 5 seconds
    }
    return () => clearTimeout(timer);
  }, [notification.show]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExpenseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleReceiptUpload = async () => {
    if (!selectedFile) {
      setNotification({
        show: true,
        message: "Please select a receipt image to upload",
        type: "error",
      });
      return;
    }

    if (!user) {
      setNotification({
        show: true,
        message: "You must be logged in to upload a receipt",
        type: "error",
      });
      return;
    }

    setIsUploading(true);

    // Generate a numerical userId from the Clerk user.id string
    const numericUserId = generateNumericId(user.id);

    const formData = new FormData();
    formData.append("UserId", numericUserId.toString());
    formData.append("ReceiptImage", selectedFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Receipts/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to upload receipt");
      }

      const data = await res.json();
      console.log("Receipt uploaded successfully:", data);

      setNotification({
        show: true,
        message: "Receipt processed successfully! Please review the details.",
        type: "success",
      });

      // Populate expense form with data from receipt
      if (data.amount || data.category || data.description || data.date) {
        setExpenseData({
          amount: data.amount?.toString() || "",
          category: data.category || "",
          description: data.description || "",
          date: data.date || new Date().toISOString().split("T")[0],
        });

        // Set receipt source to track that this expense came from a receipt
        if (!data.id) {
          throw new Error("No receipt ID returned from server");
        }
        setReceiptSource(data.id);

        // Close receipt upload modal and open expense form
        setShowReceiptUpload(false);
        setShowExpenseForm(true);
      } else {
        setNotification({
          show: true,
          message:
            "Receipt processed, but no expense data could be extracted. Please enter details manually.",
          type: "error",
        });
      }

      // Reset the file selection
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading receipt:", error);
      setNotification({
        show: true,
        message:
          "Error processing receipt. Please try again or enter expense manually.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      setNotification({
        show: true,
        message: "You must be logged in to add an expense",
        type: "error",
      });
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

    // If this is a receipt-based expense, we need to check if it's already been processed
    if (receiptSource) {
      try {
        // Since we don't have a receipt status check endpoint, we'll proceed with the submission
        // The backend will handle any duplicate processing logic
        console.log("Submitting expense with receipt source:", receiptSource);
      } catch (error) {
        console.error("Error preparing receipt submission:", error);
        setNotification({
          show: true,
          message: "Error preparing receipt submission. Please try again.",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      id: 0, // Add an ID field with a default value
      userId: numericUserId,
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      description: expenseData.description,
      date: expenseData.date,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses`,
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

      // Show success notification
      setNotification({
        show: true,
        message: `$${payload.amount.toFixed(2)} ${
          payload.category
        } expense added successfully!`,
        type: "success",
      });

      // Reset form and close modal
      setExpenseData({
        amount: "",
        category: "",
        description: "",
        date: "",
      });
      setReceiptSource(null);
      setShowExpenseForm(false);

      // Refetch expenses to update the dashboard
      const fetchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Expenses?userId=${numericUserId}`
      );
      if (!fetchResponse.ok) {
        throw new Error("Failed to fetch updated expenses");
      }
      const updatedExpenses = await fetchResponse.json();
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error("Error adding expense:", error);

      // Show error notification
      setNotification({
        show: true,
        message: "Error adding expense. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancellation of the expense form
  const handleCancelExpense = () => {
    // If this expense came from a receipt upload, show confirmation
    if (receiptSource) {
      if (window.confirm("Discard the data extracted from your receipt?")) {
        resetExpenseForm();
      }
    } else {
      resetExpenseForm();
    }
  };

  // Reset the expense form state
  const resetExpenseForm = () => {
    setExpenseData({
      amount: "",
      category: "",
      description: "",
      date: "",
    });
    setReceiptSource(null);
    setShowExpenseForm(false);
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
      {/* Custom Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg shadow-lg transform transition-all duration-500 animate-bounce ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}>
          <div className='mr-3'>
            {notification.type === "success" ? (
              <Check className='w-6 h-6' />
            ) : (
              <AlertCircle className='w-6 h-6' />
            )}
          </div>
          <div className='text-sm font-medium'>{notification.message}</div>
          <button
            type='button'
            className='ml-4 inline-flex bg-transparent rounded-lg p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700'
            onClick={() =>
              setNotification((prev) => ({ ...prev, show: false }))
            }>
            <X className='w-4 h-4' />
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <ActionButtons
        onAddExpense={() => setShowExpenseForm(true)}
        onSetGoal={() => {
          /* Add goal functionality */
        }}
        onGenerateReport={() => {
          /* Add report generation functionality */
        }}
        onUploadReceipt={() => setShowReceiptUpload(true)}
      />

      {/* Subscription Status */}
      <div className='mb-8'>
        <SubscriptionStatus />
      </div>

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
              ${calculateMonthlyExpenses().toFixed(2)}
            </span>
            <span className='ml-2 text-sm text-red-500'>↓ 0.8%</span>
          </div>
        </Card>
      </div>

      {/* Budget Overview and Transactions */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <h3 className='text-xl font-semibold mb-6 dark:text-gray-100'>
            Budget Overview
          </h3>
          <div className='space-y-6'>
            {calculateBudgetOverview().map((category) => (
              <div key={category.category}>
                <div className='flex justify-between mb-2'>
                  <span className='text-gray-600 dark:text-gray-300'>
                    {category.category}
                  </span>
                  <span className='text-gray-900 dark:text-gray-100'>
                    ${category.amount.toFixed(2)}/${category.budget.toFixed(2)}
                  </span>
                </div>
                <Progress
                  value={category.percentage}
                  className='h-2 bg-gray-100 dark:bg-gray-700'
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className='p-6 dark:bg-gray-800 dark:border-gray-700'>
          <h3 className='text-xl font-semibold mb-6 dark:text-gray-100'>
            Recent Transactions
          </h3>
          <div className='space-y-4'>
            {getRecentTransactions().map((transaction) => (
              <div
                key={transaction.id}
                className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='bg-blue-100 dark:bg-blue-900 p-2 rounded-lg'>
                    <FolderIcon className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-gray-900 dark:text-gray-100'>
                      {transaction.category}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className='text-red-500 dark:text-red-400'>
                  -${transaction.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Expense Modal */}
      {showExpenseForm && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black opacity-50'
            onClick={() => handleCancelExpense()}></div>
          {/* Modal Content */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-10 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4 dark:text-white'>
              {receiptSource ? "Confirm Receipt Expense" : "Add Expense"}
            </h2>
            {receiptSource && (
              <div className='mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-md'>
                <p className='text-sm text-blue-700 dark:text-blue-300'>
                  These details were extracted from your receipt. Please review
                  and confirm.
                </p>
              </div>
            )}
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
                  onClick={handleCancelExpense}
                  className='px-4 py-2 bg-gray-300 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500'
                  disabled={isSubmitting}>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                  disabled={isSubmitting}>
                  {isSubmitting
                    ? "Submitting..."
                    : receiptSource
                    ? "Confirm"
                    : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Upload Modal */}
      {showReceiptUpload && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black opacity-50'
            onClick={() => !isUploading && setShowReceiptUpload(false)}></div>

          {/* Modal Content */}
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-10 w-full max-w-md'>
            {isUploading ? (
              <div className='flex flex-col items-center justify-center py-8'>
                <iframe
                  src='Animation - 1741399814223.gif'
                  width='200'
                  height='200'
                  className='mb-4'></iframe>
                <p className='text-lg font-medium text-gray-700 dark:text-gray-300'>
                  Processing receipt...
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                  We're extracting expense details from your receipt
                </p>
              </div>
            ) : (
              <>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-xl font-bold dark:text-white'>
                    Upload Receipt
                  </h2>
                  <button
                    type='button'
                    onClick={() => setShowReceiptUpload(false)}
                    className='text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'>
                    <X className='w-5 h-5' />
                  </button>
                </div>
                <div className='space-y-6'>
                  <div className='relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center'>
                    {selectedFile ? (
                      <div className='space-y-2'>
                        <div className='flex items-center justify-center'>
                          <Check className='w-8 h-8 text-green-500' />
                        </div>
                        <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                          {selectedFile.name}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                        <button
                          type='button'
                          className='text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'
                          onClick={() => setSelectedFile(null)}>
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className='space-y-2'>
                        <div className='flex items-center justify-center'>
                          <Upload className='w-8 h-8 text-gray-400 dark:text-gray-500' />
                        </div>
                        <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                          Drag and drop a file or click to browse
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          Supports JPG, PNG, PDF (max 10MB)
                        </p>
                      </div>
                    )}
                    <input
                      type='file'
                      id='receipt'
                      name='receipt'
                      ref={fileInputRef}
                      accept='image/jpeg,image/png,application/pdf'
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className='flex justify-end space-x-4'>
                    <button
                      type='button'
                      onClick={() => setShowReceiptUpload(false)}
                      className='px-4 py-2 bg-gray-300 dark:bg-gray-600 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500'>
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={handleReceiptUpload}
                      className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                      disabled={!selectedFile}>
                      Process Receipt
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
