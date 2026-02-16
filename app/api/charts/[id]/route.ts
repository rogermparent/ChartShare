import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { charts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chart = await getDb().select().from(charts).where(eq(charts.id, Number(id)));

  if (chart.length === 0) {
    return NextResponse.json({ error: "Chart not found" }, { status: 404 });
  }

  return NextResponse.json(chart[0]);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const existing = await getDb().select().from(charts).where(eq(charts.id, Number(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "Chart not found" }, { status: 404 });
  }

  if (body.chartData !== undefined) {
    try {
      JSON.parse(body.chartData);
    } catch {
      return NextResponse.json({ error: "chartData must be valid JSON" }, { status: 400 });
    }
  }

  const updateData: Record<string, string> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.chartData !== undefined) updateData.chartData = body.chartData;

  const result = await getDb()
    .update(charts)
    .set(updateData)
    .where(eq(charts.id, Number(id)))
    .returning();

  return NextResponse.json(result[0]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await getDb().select().from(charts).where(eq(charts.id, Number(id)));
  if (existing.length === 0) {
    return NextResponse.json({ error: "Chart not found" }, { status: 404 });
  }

  await getDb().delete(charts).where(eq(charts.id, Number(id)));
  return NextResponse.json({ success: true });
}
