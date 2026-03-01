import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/records?month=2026-03
export async function GET(request: NextRequest) {
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
}

// POST /api/records
export async function POST(request: NextRequest) {
  const body = await request.json();

  const record = await prisma.lunchRecord.create({
    data: {
      date: new Date(body.date),
      amount: body.amount,
      memo: body.memo || null,
    },
  });

  return NextResponse.json(record, { status: 201 });
}
