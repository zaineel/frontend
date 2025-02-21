"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, FolderIcon } from "lucide-react";
import Link from "next/link";

export default function DashboardNav() {
  return (
    <nav className='border-b bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <Link href='/dashboard' className='flex items-center'>
              <FolderIcon className='h-8 w-8 text-blue-600' />
              <span className='ml-2 text-xl font-semibold'>Budget Buddy</span>
            </Link>
          </div>
          <div className='flex items-center space-x-8'>
            <Link
              href='/dashboard'
              className='text-gray-600 hover:text-gray-900'>
              Dashboard
            </Link>
            <Link
              href='/expenses'
              className='text-gray-600 hover:text-gray-900'>
              Expenses
            </Link>
            <Link href='/goals' className='text-gray-600 hover:text-gray-900'>
              Goals
            </Link>
            <Link href='/reports' className='text-gray-600 hover:text-gray-900'>
              Reports
            </Link>
          </div>
          <div className='flex items-center space-x-4'>
            <Bell className='h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer' />
            <UserButton afterSignOutUrl='/sign-in' />
          </div>
        </div>
      </div>
    </nav>
  );
}
