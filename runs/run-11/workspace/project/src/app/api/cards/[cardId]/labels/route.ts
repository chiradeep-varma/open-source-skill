import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireUser,
  requireBoardMemberForCard,
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
    await requireBoardMemberForCard(cardId, user.id);
    const body = await req.json();
    const labelId = typeof body.labelId === "string" ? body.labelId : "";
    if (!labelId) throw new ApiError(400, "labelId is required");

    await prisma.cardLabel.upsert({
      where: { cardId_labelId: { cardId, labelId } },
      create: { cardId, labelId },
      update: {},
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
