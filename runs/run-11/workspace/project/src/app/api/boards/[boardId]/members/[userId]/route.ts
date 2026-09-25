import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireBoardMember, handleApiError, ApiError } from "@/lib/api-helpers";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string; userId: string }> }
) {
  try {
    const user = await requireUser();
    const { boardId, userId } = await params;
    const membership = await requireBoardMember(boardId, user.id);
    if (membership.role !== "owner" && user.id !== userId) {
      throw new ApiError(403, "Only the owner can remove other members");
    }
    const target = await prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
    });
    if (target?.role === "owner") {
      throw new ApiError(400, "Cannot remove the board owner");
    }
    await prisma.boardMember.deleteMany({ where: { boardId, userId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
