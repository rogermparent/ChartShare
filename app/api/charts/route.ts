import { NextResponse } from "next/server";
import { db } from "@/db";
import { charts } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const allCharts = await db.select().from(charts).orderBy(desc(charts.updatedAt));
  return NextResponse.json(allCharts);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  if (!body.chartData || typeof body.chartData !== "string") {
    return NextResponse.json({ error: "chartData is required" }, { status: 400 });
  }

  try {
    JSON.parse(body.chartData);
  } catch {
    return NextResponse.json({ error: "chartData must be valid JSON" }, { status: 400 });
  }

  const result = await db.insert(charts).values({
    name: body.name,
    description: body.description ?? "",
    chartData: body.chartData,
  }).returning();

  return NextResponse.json(result[0], { status: 201 });
}
