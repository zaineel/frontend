"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Download,
  Calendar,
  ChevronDown,
  RefreshCw,
  InfoIcon,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ReportData = {
  monthlyExpenses: {
    month: string;
    amount: number;
    color: string;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
  spendingTrend: {
    date: string;
    amount: number;
  }[];
  budgetVsActual: {
    month: string;
    budget: number;
    actual: number;
  }[];
  savingsProjection: {
    date: string;
    amount: number;
  }[];
};

export default function Reports() {
  const [timeRange, setTimeRange] = useState("month");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");
  const [error, setError] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/Expenses/reports?timeRange=${timeRange}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }

      const data = await response.json();
      setReportData(data);
      setError("");
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Failed to load report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const handleExportReport = async (format: string = "csv") => {
    try {
      setExportLoading(true);

      // Create a download URL for the CSV report
      const downloadUrl = `/api/Expenses/reports/download?timeRange=${timeRange}&format=csv`;

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute(
        "download",
        `financial_report_${timeRange}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );

      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast("Report downloaded successfully!");
      setShowExportOptions(false);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast("Failed to download report. Please try again.", {
        description: "There was an issue generating your report.",
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Currency formatter
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0'>
        <h1 className='text-2xl font-bold'>Financial Reports</h1>
        <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select Time Range' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='month'>Last 6 Months</SelectItem>
              <SelectItem value='quarter'>Last Quarter</SelectItem>
              <SelectItem value='year'>Last Year</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu
            open={showExportOptions}
            onOpenChange={setShowExportOptions}>
            <DropdownMenuTrigger asChild>
              <Button className='w-full sm:w-auto'>
                <Download className='h-4 w-4 mr-2' />
                {exportLoading ? "Downloading..." : "Export Report"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={exportLoading}
                onClick={() => handleExportReport("csv")}>
                CSV Format
              </DropdownMenuItem>
              <DropdownMenuItem disabled={true}>
                PDF Format (Coming Soon)
              </DropdownMenuItem>
              <DropdownMenuItem disabled={true}>
                Excel Format (Coming Soon)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
          <p>{error}</p>
          <Button variant='outline' onClick={fetchReportData} className='mt-2'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Retry
          </Button>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Monthly Expenses Chart */}
        <Card className='p-6 overflow-hidden'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold'>Monthly Expenses</h3>
              <p className='text-sm text-gray-500'>Your spending by month</p>
            </div>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className='w-[100px]'>
                <SelectValue placeholder='Chart Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='bar'>Bar</SelectItem>
                <SelectItem value='line'>Line</SelectItem>
                <SelectItem value='area'>Area</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='h-80'>
            {loading ? (
              <div className='flex flex-col space-y-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </div>
            ) : reportData ? (
              <ResponsiveContainer width='100%' height='100%'>
                {chartType === "bar" ? (
                  <BarChart data={reportData.monthlyExpenses}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                    <Legend />
                    <Bar dataKey='amount' name='Spending' radius={[4, 4, 0, 0]}>
                      {reportData.monthlyExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : chartType === "line" ? (
                  <LineChart data={reportData.monthlyExpenses}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='amount'
                      name='Spending'
                      stroke='#8884d8'
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={reportData.monthlyExpenses}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                    <Legend />
                    <defs>
                      <linearGradient
                        id='colorAmount'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'>
                        <stop
                          offset='5%'
                          stopColor='#8884d8'
                          stopOpacity={0.8}
                        />
                        <stop
                          offset='95%'
                          stopColor='#8884d8'
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type='monotone'
                      dataKey='amount'
                      name='Spending'
                      stroke='#8884d8'
                      fillOpacity={1}
                      fill='url(#colorAmount)'
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <p>No data available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className='p-6 overflow-hidden'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold'>Category Breakdown</h3>
              <p className='text-sm text-gray-500'>Where your money goes</p>
            </div>
            <PieChartIcon className='h-5 w-5 text-gray-500' />
          </div>

          <div className='h-80'>
            {loading ? (
              <div className='flex flex-col space-y-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </div>
            ) : reportData ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <ResponsiveContainer width='100%' height={200}>
                  <PieChart>
                    <Pie
                      data={reportData.categoryBreakdown}
                      cx='50%'
                      cy='50%'
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={1}
                      dataKey='amount'
                      nameKey='category'
                      label={({ category, percentage }) =>
                        `${category}: ${percentage}%`
                      }
                      labelLine={false}>
                      {reportData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(Number(value)),
                        "Amount",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className='space-y-2 mt-4 md:mt-0'>
                  {reportData.categoryBreakdown.map((category, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <div
                          className='w-3 h-3 rounded-full'
                          style={{ backgroundColor: category.color }}
                        />
                        <span className='text-sm'>{category.category}</span>
                      </div>
                      <div className='flex items-center space-x-4'>
                        <span className='text-sm text-gray-500'>
                          {formatCurrency(category.amount)}
                        </span>
                        <span className='text-sm font-medium'>
                          {category.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <p>No data available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Budget vs Actual */}
        <Card className='p-6 overflow-hidden'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold'>Budget vs Actual</h3>
              <p className='text-sm text-gray-500'>
                How you're tracking against your budget
              </p>
            </div>
            <Wallet className='h-5 w-5 text-gray-500' />
          </div>

          <div className='h-80'>
            {loading ? (
              <div className='flex flex-col space-y-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </div>
            ) : reportData ? (
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={reportData.budgetVsActual}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  <Legend />
                  <Bar
                    dataKey='budget'
                    name='Budget'
                    fill='#8884d8'
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey='actual'
                    name='Actual'
                    fill='#82ca9d'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <p>No data available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Savings Projection */}
        <Card className='p-6 overflow-hidden'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold'>Savings Projection</h3>
              <p className='text-sm text-gray-500'>
                Your forecasted savings over time
              </p>
            </div>
            <ArrowUpRight className='h-5 w-5 text-gray-500' />
          </div>

          <div className='h-80'>
            {loading ? (
              <div className='flex flex-col space-y-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </div>
            ) : reportData ? (
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={reportData.savingsProjection}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='date'
                    tickFormatter={(value) => {
                      return format(new Date(value), "MMM yy");
                    }}
                  />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Projected Savings",
                    ]}
                    labelFormatter={(value) =>
                      format(new Date(value), "MMMM yyyy")
                    }
                  />
                  <defs>
                    <linearGradient
                      id='colorSavings'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'>
                      <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
                      <stop
                        offset='95%'
                        stopColor='#82ca9d'
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type='monotone'
                    dataKey='amount'
                    stroke='#82ca9d'
                    fillOpacity={1}
                    fill='url(#colorSavings)'
                    name='Projected Savings'
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <p>No data available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Spending Trend */}
        <Card className='p-6 lg:col-span-2 overflow-hidden'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold'>Spending Trend</h3>
              <p className='text-sm text-gray-500'>
                Your spending patterns over time
              </p>
            </div>
            <LineChartIcon className='h-5 w-5 text-gray-500' />
          </div>

          <div className='h-96'>
            {loading ? (
              <div className='flex flex-col space-y-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </div>
            ) : reportData ? (
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={reportData.spendingTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='date'
                    tickFormatter={(value) => {
                      return format(new Date(value), "MMM yy");
                    }}
                  />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Amount",
                    ]}
                    labelFormatter={(value) =>
                      format(new Date(value), "MMMM yyyy")
                    }
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='amount'
                    name='Monthly Spending'
                    stroke='#8884d8'
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex items-center justify-center h-full'>
                <p>No data available</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
