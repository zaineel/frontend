import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // URL params for filtering
    const url = new URL(request.url);
    const timeRange = url.searchParams.get("timeRange") || "month";

    // In a real application, you would fetch this data from a database
    // Here we're generating dynamic mock data based on the requested time range

    // Generate dynamic monthly expenses data
    const months = timeRange === "year" ? 12 : timeRange === "quarter" ? 3 : 6;
    const monthlyExpenses = generateMonthlyExpenses(months);

    // Generate dynamic category breakdown
    const categoryBreakdown = generateCategoryBreakdown();

    // Generate spending trend data
    const spendingTrend = generateSpendingTrend(months);

    // Generate budget vs actual data
    const budgetVsActual = generateBudgetVsActual(months);

    // Generate savings projection
    const savingsProjection = generateSavingsProjection(12); // Always show 12 months projection

    return NextResponse.json({
      monthlyExpenses,
      categoryBreakdown,
      spendingTrend,
      budgetVsActual,
      savingsProjection,
    });
  } catch (error) {
    console.error("[REPORTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Helper functions to generate dynamic data
function generateMonthlyExpenses(months: number) {
  const currentMonth = new Date().getMonth();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return Array.from({ length: months }, (_, i) => {
    const monthIndex = (currentMonth - months + i + 1 + 12) % 12;
    return {
      month: monthNames[monthIndex],
      amount: Math.floor(2000 + Math.random() * 2000),
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
    };
  });
}

function generateCategoryBreakdown() {
  const categories = [
    { category: "Housing", base: 1200, variance: 300 },
    { category: "Food", base: 600, variance: 200 },
    { category: "Transportation", base: 400, variance: 200 },
    { category: "Entertainment", base: 300, variance: 100 },
    { category: "Utilities", base: 250, variance: 50 },
    { category: "Healthcare", base: 200, variance: 100 },
    { category: "Shopping", base: 350, variance: 150 },
    { category: "Other", base: 300, variance: 200 },
  ];

  const categoryData = categories.map((cat, index) => {
    const amount = Math.floor(cat.base + Math.random() * cat.variance);
    return {
      category: cat.category,
      amount,
      color: `hsl(${index * 45}, 70%, 50%)`,
    };
  });

  // Calculate total and percentages
  const total = categoryData.reduce((sum, cat) => sum + cat.amount, 0);
  return categoryData.map((cat) => ({
    ...cat,
    percentage: Math.round((cat.amount / total) * 100),
  }));
}

function generateSpendingTrend(months: number) {
  const result = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  for (let i = 0; i < months; i++) {
    const monthOffset = months - i - 1;
    const month = (currentMonth - monthOffset + 12) % 12;
    const year = currentYear - Math.floor((monthOffset - currentMonth) / 12);

    const date = `${year}-${String(month + 1).padStart(2, "0")}`;

    // Create a trend with some randomness but also a pattern
    const baseAmount = 3000;
    const seasonalFactor = Math.sin((month / 12) * 2 * Math.PI) * 500; // Seasonal variation
    const randomFactor = Math.random() * 1000 - 500; // Random noise
    const amount = Math.max(
      1000,
      Math.round(baseAmount + seasonalFactor + randomFactor)
    );

    result.push({ date, amount });
  }

  return result;
}

function generateBudgetVsActual(months: number) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();

  return Array.from({ length: months }, (_, i) => {
    const monthIndex = (currentMonth - months + i + 1 + 12) % 12;
    const budget = 3000 + (monthIndex % 3) * 200; // Slightly different budget each quarter
    const actual = budget * (0.8 + Math.random() * 0.4); // Between 80% and 120% of budget

    return {
      month: monthNames[monthIndex],
      budget,
      actual: Math.round(actual),
    };
  });
}

function generateSavingsProjection(months: number) {
  const result = [];
  const initialSavings = 5000 + Math.random() * 3000;
  const monthlySavingsRate = 500 + Math.random() * 300;

  let currentSavings = initialSavings;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  for (let i = 0; i < months; i++) {
    const month = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);
    const date = `${year}-${String(month + 1).padStart(2, "0")}`;

    // Add some variation to monthly savings
    const thisMonthSavings = monthlySavingsRate * (0.9 + Math.random() * 0.2);
    currentSavings += thisMonthSavings;

    result.push({
      date,
      amount: Math.round(currentSavings),
    });
  }

  return result;
}
