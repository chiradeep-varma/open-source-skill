import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireBoardMember, handleApiError, ApiError } from "@/lib/api-helpers";

async function requireChecklistAccess(checklistId: string, userId: string) {
  const checklist = await prisma.checklist.findUnique({
    where: { id: checklistId },
    select: { card: { select: { list: { select: { boardId: true } } } } },
  });
  if (!checklist) throw new ApiError(404, "Checklist not found");
  await requireBoardMember(checklist.card.list.boardId, userId);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ checklistId: string }> }
) {
  try {
    const user = await requireUser();
    const { checklistId } = await params;
    await requireChecklistAccess(checklistId, user.id);
    await prisma.checklist.delete({ where: { id: checklistId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
