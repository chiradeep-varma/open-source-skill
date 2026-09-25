import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireBoardMemberForCard, handleApiError } from "@/lib/api-helpers";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string; userId: string }> }
) {
  try {
    const user = await requireUser();
    const { cardId, userId } = await params;
    await requireBoardMemberForCard(cardId, user.id);
    await prisma.cardMember.deleteMany({ where: { cardId, userId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
