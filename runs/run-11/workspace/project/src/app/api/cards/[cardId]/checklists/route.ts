import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireUser,
  requireBoardMemberForCard,
  handleApiError,
  ApiError,
} from "@/lib/api-helpers";
import { positionForAppend } from "@/lib/ordering";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const user = await requireUser();
    const { cardId } = await params;
    await requireBoardMemberForCard(cardId, user.id);
    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) throw new ApiError(400, "Checklist title is required");

    const last = await prisma.checklist.findFirst({
      where: { cardId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const checklist = await prisma.checklist.create({
      data: { title, cardId, position: positionForAppend(last?.position) },
      include: { items: true },
    });
    return NextResponse.json({ checklist }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
