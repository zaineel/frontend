"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, FolderIcon } from "lucide-react";
import Link from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";

export default function DashboardNav() {
  return (
    <nav className='border-b bg-white dark:bg-gray-800 dark:border-gray-700'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <Link href='/dashboard' className='flex items-center'>
              <FolderIcon className='h-8 w-8 text-blue-600 dark:text-blue-400 animate-bounce' />
              <span className='ml-2 text-xl font-semibold dark:text-white'>
                Budget Buddy
              </span>
            </Link>
          </div>
          <div className='flex items-center space-x-8'>
            <Link
              href='/dashboard'
              className='text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-[#18b0a2]'>
              Dashboard
            </Link>
            <Link
              href='/dashboard/expenses'
              className='text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-[#18b0a2]'>
              Expenses
            </Link>
            <Link
              href='/dashboard/goals'
              className='text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-[#18b0a2]'>
              Goals
            </Link>
            <Link
              href='/dashboard/reports'
              className='text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-[#18b0a2]'>
              Reports
            </Link>
          </div>
          <div className='flex items-center space-x-4'>
            <ThemeSwitch />
            <Bell className='text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-[#18b0a2] cursor-pointer' />
            <UserButton afterSwitchSessionUrl='/sign-in' />
          </div>
        </div>
      </div>
    </nav>
  );
}
