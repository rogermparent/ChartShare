import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { charts } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-static";

export async function GET() {
  const allCharts = await getDb()
    .select()
    .from(charts)
    .orderBy(desc(charts.updatedAt));

  return NextResponse.json(allCharts);
}
