import { db } from "@/app/db";
import { tasks } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    console.log("[Next.js API] Fetching tasks from database...");
    const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
    console.log(`[Next.js API] Successfully fetched ${allTasks.length} tasks`);
    return NextResponse.json(allTasks);
  } catch (error) {
    console.error("[Next.js API] Error fetching tasks:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch tasks",
        message: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
