"use client";

import { LineChart, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FolderIcon } from "lucide-react";

export default function Dashboard() {
  return (
    <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <Card className='p-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Total Balance
          </h3>
          <div className='flex items-baseline'>
            <span className='text-3xl font-bold'>$24,562.00</span>
            <span className='ml-2 text-sm text-green-500'>↑ 2.5%</span>
          </div>
        </Card>
        <Card className='p-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Monthly Income
          </h3>
          <div className='flex items-baseline'>
            <span className='text-3xl font-bold'>$8,350.00</span>
            <span className='ml-2 text-sm text-green-500'>↑ 1.2%</span>
          </div>
        </Card>
        <Card className='p-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Monthly Expenses
          </h3>
          <div className='flex items-baseline'>
            <span className='text-3xl font-bold'>$5,280.00</span>
            <span className='ml-2 text-sm text-red-500'>↓ 0.8%</span>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className='flex space-x-4 mb-8'>
        <Button className='bg-blue-600 hover:bg-blue-700'>+ Add Expense</Button>
        <Button className='bg-emerald-600 hover:bg-emerald-700'>
          <Target className='w-4 h-4 mr-2' /> Set Goal
        </Button>
        <Button variant='secondary'>
          <LineChart className='w-4 h-4 mr-2' /> Generate Report
        </Button>
      </div>

      {/* Budget Overview and Transactions */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='p-6'>
          <h3 className='text-xl font-semibold mb-6'>Budget Overview</h3>
          <div className='space-y-6'>
            <div>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Groceries</span>
                <span className='text-gray-900'>$450/$600</span>
              </div>
              <Progress value={75} className='h-2 bg-gray-100' />
            </div>
            <div>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Entertainment</span>
                <span className='text-gray-900'>$280/$300</span>
              </div>
              <Progress value={93} className='h-2 bg-gray-100' />
            </div>
            <div>
              <div className='flex justify-between mb-2'>
                <span className='text-gray-600'>Transportation</span>
                <span className='text-gray-900'>$150/$200</span>
              </div>
              <Progress value={75} className='h-2 bg-gray-100' />
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <h3 className='text-xl font-semibold mb-6'>Recent Transactions</h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='bg-blue-100 p-2 rounded-lg'>
                  <FolderIcon className='h-6 w-6 text-blue-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-gray-900'>Grocery Store</p>
                  <p className='text-sm text-gray-500'>Mar 15, 2025</p>
                </div>
              </div>
              <span className='text-red-500'>-$85.00</span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='bg-green-100 p-2 rounded-lg'>
                  <FolderIcon className='h-6 w-6 text-green-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-gray-900'>Salary Deposit</p>
                  <p className='text-sm text-gray-500'>Mar 14, 2025</p>
                </div>
              </div>
              <span className='text-green-500'>+$3,450.00</span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='bg-purple-100 p-2 rounded-lg'>
                  <FolderIcon className='h-6 w-6 text-purple-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-gray-900'>Netflix</p>
                  <p className='text-sm text-gray-500'>Mar 13, 2025</p>
                </div>
              </div>
              <span className='text-red-500'>-$14.99</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className='mt-12 flex items-center justify-between text-sm text-gray-500'>
        <div className='flex items-center'>
          <FolderIcon className='h-4 w-4 mr-2' />
          <span>Secure SSL Encryption</span>
        </div>
        <div className='flex space-x-6'>
          <a href='#' className='hover:text-gray-900'>
            Privacy Policy
          </a>
          <a href='#' className='hover:text-gray-900'>
            Terms of Service
          </a>
          <a href='#' className='hover:text-gray-900'>
            Contact Support
          </a>
        </div>
      </footer>
    </main>
  );
}
