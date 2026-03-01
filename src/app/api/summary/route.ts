import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/summary?month=2026-03
export async function GET(request: NextRequest) {
  try {
    const month = request.nextUrl.searchParams.get("month");

    const now = new Date();

    // 이전 달 데이터 자동 삭제
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    await prisma.lunchRecord.deleteMany({
      where: { date: { lt: thisMonthStart } },
    });
    const year = month ? parseInt(month.split("-")[0]) : now.getFullYear();
    const mon = month ? parseInt(month.split("-")[1]) - 1 : now.getMonth();

    const start = new Date(year, mon, 1);
    const end = new Date(year, mon + 1, 1);

    const records = await prisma.lunchRecord.findMany({
      where: {
        date: { gte: start, lt: end },
      },
    });

    const budget = 200000;
    const totalSpent = records.reduce((sum, r) => sum + r.amount, 0);
    const remaining = budget - totalSpent;

    // 남은 영업일 계산 (주말 제외)
    const today = new Date();
    let remainingDays = 0;
    const lastDay = new Date(year, mon + 1, 0).getDate();
    const startDay =
      year === today.getFullYear() && mon === today.getMonth()
        ? today.getDate()
        : 1;

    for (let d = startDay; d <= lastDay; d++) {
      const day = new Date(year, mon, d).getDay();
      if (day !== 0 && day !== 6) remainingDays++;
    }

    const dailyAvg = remainingDays > 0 ? Math.floor(remaining / remainingDays) : 0;

    return NextResponse.json({
      budget,
      totalSpent,
      remaining,
      remainingDays,
      dailyAvg,
      recordCount: records.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Summary API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
