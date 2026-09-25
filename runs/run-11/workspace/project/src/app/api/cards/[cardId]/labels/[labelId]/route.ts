import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireBoardMemberForCard, handleApiError } from "@/lib/api-helpers";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string; labelId: string }> }
) {
  try {
    const user = await requireUser();
    const { cardId, labelId } = await params;
    await requireBoardMemberForCard(cardId, user.id);
    await prisma.cardLabel.deleteMany({ where: { cardId, labelId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
