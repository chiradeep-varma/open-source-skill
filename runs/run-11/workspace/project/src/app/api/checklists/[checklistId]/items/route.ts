import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireBoardMember, handleApiError, ApiError } from "@/lib/api-helpers";
import { positionForAppend } from "@/lib/ordering";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ checklistId: string }> }
) {
  try {
    const user = await requireUser();
    const { checklistId } = await params;
    const checklist = await prisma.checklist.findUnique({
      where: { id: checklistId },
      select: { card: { select: { list: { select: { boardId: true } } } } },
    });
    if (!checklist) throw new ApiError(404, "Checklist not found");
    await requireBoardMember(checklist.card.list.boardId, user.id);

    const body = await req.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) throw new ApiError(400, "Item text is required");

    const last = await prisma.checklistItem.findFirst({
      where: { checklistId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const item = await prisma.checklistItem.create({
      data: { text, checklistId, position: positionForAppend(last?.position) },
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
