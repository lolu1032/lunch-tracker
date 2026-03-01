import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/records/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const record = await prisma.lunchRecord.update({
    where: { id: parseInt(id) },
    data: {
      date: body.date ? new Date(body.date) : undefined,
      amount: body.amount,
      memo: body.memo ?? undefined,
    },
  });

  return NextResponse.json(record);
}

// DELETE /api/records/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.lunchRecord.delete({
    where: { id: parseInt(id) },
  });

  return NextResponse.json({ ok: true });
}
