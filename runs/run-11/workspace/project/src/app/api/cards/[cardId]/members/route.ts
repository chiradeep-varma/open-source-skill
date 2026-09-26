import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireUser,
  requireBoardMemberForCard,
  requireBoardMember,
  handleApiError,
  ApiError,
} from "@/lib/api-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const user = await requireUser();
    const { cardId } = await params;
    const card = await requireBoardMemberForCard(cardId, user.id);
    const body = await req.json();
    const userId = typeof body.userId === "string" ? body.userId : "";
    if (!userId) throw new ApiError(400, "userId is required");

    await requireBoardMember(card.list.boardId, userId);

    await prisma.cardMember.upsert({
      where: { cardId_userId: { cardId, userId } },
      create: { cardId, userId },
      update: {},
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
