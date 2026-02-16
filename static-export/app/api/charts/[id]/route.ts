import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { charts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const chartsResponse = await getDb()
    .select({ id: charts.id })
    .from(charts)
    .orderBy(desc(charts.updatedAt));
  if (!chartsResponse?.length) {
    return [{ id: ["_"] }];
  }
  return chartsResponse.map(({ id }) => ({ id: String(id) }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const chart = await getDb()
    .select()
    .from(charts)
    .where(eq(charts.id, Number(id)));

  if (chart.length === 0) {
    return NextResponse.json({ error: "Chart not found" }, { status: 404 });
  }

  return NextResponse.json(chart[0]);
}
