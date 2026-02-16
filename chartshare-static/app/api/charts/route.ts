import { NextResponse } from "next/server";
import { getDb } from "chartshare-common/db/index";
import { charts } from "chartshare-common/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-static";

export async function GET() {
  const allCharts = await getDb()
    .select()
    .from(charts)
    .orderBy(desc(charts.updatedAt));

  return NextResponse.json(allCharts);
}
