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
    const text = typeof body.body === "string" ? body.body.trim() : "";
    if (!text) throw new ApiError(400, "Comment body is required");

    const comment = await prisma.comment.create({
      data: { cardId, authorId: user.id, body: text },
      include: { author: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
