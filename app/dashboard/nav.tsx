"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, FolderIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function DashboardNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/expenses", label: "Expenses" },
    { href: "/dashboard/goals", label: "Goals" },
    { href: "/dashboard/reports", label: "Reports" },
  ];

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
          <div className='hidden md:flex items-center space-x-8'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-[#18b0a2]'>
                {item.label}
              </Link>
            ))}
          </div>
          <div className='flex items-center space-x-4'>
            <ThemeSwitch />
            <Bell className='hidden sm:block text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-[#18b0a2] cursor-pointer' />
            <UserButton afterSwitchSessionUrl='/sign-in' />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='md:hidden'>
                  <Menu className='h-6 w-6' />
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className='flex flex-col space-y-4 mt-8'>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className='text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-[#18b0a2] py-2 text-lg'
                      onClick={() => setIsOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
