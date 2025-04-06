"use client";

import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Home, Receipt, Target, BarChart } from "lucide-react";

export default function DashboardSidebar() {
  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Home className='h-5 w-5 text-neutral-600 dark:text-neutral-300' />,
    },
    {
      href: "/dashboard/expenses",
      label: "Expenses",
      icon: (
        <Receipt className='h-5 w-5 text-neutral-600 dark:text-neutral-300' />
      ),
    },
    {
      href: "/dashboard/goals",
      label: "Goals",
      icon: (
        <Target className='h-5 w-5 text-neutral-600 dark:text-neutral-300' />
      ),
    },
    {
      href: "/dashboard/reports",
      label: "Reports",
      icon: (
        <BarChart className='h-5 w-5 text-neutral-600 dark:text-neutral-300' />
      ),
    },
  ];

  return (
    <Sidebar>
      <SidebarBody>
        <div className='flex flex-col space-y-4 mt-6'>
          {navItems.map((item) => (
            <SidebarLink
              key={item.href}
              link={{
                href: item.href,
                label: item.label,
                icon: item.icon,
              }}
            />
          ))}
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
