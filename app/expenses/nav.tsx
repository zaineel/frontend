"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import {
  Filter,
  Grid,
  List,
  PieChart,
  Calendar,
  ArrowDownUp,
} from "lucide-react";

export default function ExpensesNav() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("all");

  // Function to handle tab selection
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className='mb-8 border-b'>
      <div className='flex flex-col sm:flex-row'>
        <div className='flex overflow-x-auto pb-3 sm:pb-0'>
          <button
            onClick={() => handleTabChange("all")}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeTab === "all"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            <List className='h-4 w-4 mr-2' />
            All Expenses
          </button>

          <button
            onClick={() => handleTabChange("categories")}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeTab === "categories"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            <PieChart className='h-4 w-4 mr-2' />
            By Category
          </button>

          <button
            onClick={() => handleTabChange("monthly")}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeTab === "monthly"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            <Calendar className='h-4 w-4 mr-2' />
            Monthly View
          </button>

          <button
            onClick={() => handleTabChange("recurring")}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeTab === "recurring"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}>
            <ArrowDownUp className='h-4 w-4 mr-2' />
            Recurring
          </button>
        </div>

        <div className='ml-auto flex items-center space-x-2 pt-3 sm:pt-0'>
          <button className='px-3 py-1 text-sm flex items-center text-gray-600 hover:text-gray-900 border rounded-md'>
            <Filter className='h-4 w-4 mr-1' />
            Filter
          </button>

          <button className='px-3 py-1 text-sm flex items-center text-gray-600 hover:text-gray-900 border rounded-md'>
            <Grid className='h-4 w-4 mr-1' />
            Group
          </button>
        </div>
      </div>
    </div>
  );
}
