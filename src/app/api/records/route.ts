import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/records?month=2026-03
export async function GET(request: NextRequest) {
  try {
    const month = request.nextUrl.searchParams.get("month");

    const now = new Date();
    const year = month ? parseInt(month.split("-")[0]) : now.getFullYear();
    const mon = month ? parseInt(month.split("-")[1]) - 1 : now.getMonth();

    const start = new Date(year, mon, 1);
    const end = new Date(year, mon + 1, 1);

    const records = await prisma.lunchRecord.findMany({
      where: {
        date: { gte: start, lt: end },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(records);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Records GET error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/records
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const record = await prisma.lunchRecord.create({
      data: {
        date: new Date(body.date),
        amount: body.amount,
        memo: body.memo || null,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Records POST error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
