import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireUser,
  requireBoardMemberForList,
  handleApiError,
  ApiError,
} from "@/lib/api-helpers";
import { positionForAppend } from "@/lib/ordering";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  try {
    const user = await requireUser();
    const { listId } = await params;
    await requireBoardMemberForList(listId, user.id);
    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) throw new ApiError(400, "Card title is required");

    const last = await prisma.card.findFirst({
      where: { listId, archived: false },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const card = await prisma.card.create({
      data: {
        title,
        listId,
        createdById: user.id,
        position: positionForAppend(last?.position),
      },
      include: {
        labels: { include: { label: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        checklists: { include: { items: true } },
        _count: { select: { comments: true } },
      },
    });
    return NextResponse.json({ card }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
