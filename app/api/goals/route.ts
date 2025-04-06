import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// Temporary storage for goals (we'll replace this with a database later)
let goalsStore: Record<string, any[]> = {};

// GET - Retrieve user goals
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Get user's goals from store or initialize empty array
    const userGoals = goalsStore[userId] || [];

    return NextResponse.json({ goals: userGoals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

// POST - Create a new goal
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (
      !data.title ||
      data.targetAmount === undefined ||
      !data.deadline ||
      !data.category
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize user's goals if not exists
    if (!goalsStore[userId]) {
      goalsStore[userId] = [];
    }

    // Create new goal with ID
    const newGoal = {
      id: Date.now(), // Simple ID generation
      title: data.title,
      targetAmount: Number(data.targetAmount),
      currentAmount: Number(data.currentAmount || 0),
      deadline: data.deadline,
      category: data.category,
      createdAt: new Date().toISOString(),
    };

    // Add to store
    goalsStore[userId].push(newGoal);

    return NextResponse.json({
      message: "Goal created successfully",
      goal: newGoal,
    });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing goal
export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate goal ID
    if (!data.id) {
      return NextResponse.json(
        { error: "Goal ID is required" },
        { status: 400 }
      );
    }

    // Find and update goal
    const userGoals = goalsStore[userId] || [];
    const goalIndex = userGoals.findIndex((goal) => goal.id === data.id);

    if (goalIndex === -1) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Update goal
    const updatedGoal = {
      ...userGoals[goalIndex],
      title: data.title || userGoals[goalIndex].title,
      targetAmount:
        data.targetAmount !== undefined
          ? Number(data.targetAmount)
          : userGoals[goalIndex].targetAmount,
      currentAmount:
        data.currentAmount !== undefined
          ? Number(data.currentAmount)
          : userGoals[goalIndex].currentAmount,
      deadline: data.deadline || userGoals[goalIndex].deadline,
      category: data.category || userGoals[goalIndex].category,
      updatedAt: new Date().toISOString(),
    };

    userGoals[goalIndex] = updatedGoal;

    return NextResponse.json({
      message: "Goal updated successfully",
      goal: updatedGoal,
    });
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { error: "Failed to update goal" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a goal
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate goal ID
    if (!data.id) {
      return NextResponse.json(
        { error: "Goal ID is required" },
        { status: 400 }
      );
    }

    // Find and delete goal
    const userGoals = goalsStore[userId] || [];
    const goalIndex = userGoals.findIndex((goal) => goal.id === data.id);

    if (goalIndex === -1) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Remove goal
    userGoals.splice(goalIndex, 1);

    return NextResponse.json({
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 }
    );
  }
}
