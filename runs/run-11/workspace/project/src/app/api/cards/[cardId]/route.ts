import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireUser,
  requireBoardMemberForCard,
  requireBoardMemberForList,
  handleApiError,
  ApiError,
} from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const user = await requireUser();
    const { cardId } = await params;
    await requireBoardMemberForCard(cardId, user.id);

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        labels: { include: { label: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        checklists: { orderBy: { position: "asc" }, include: { items: { orderBy: { position: "asc" } } } },
        comments: { orderBy: { createdAt: "asc" }, include: { author: { select: { id: true, name: true } } } },
        createdBy: { select: { id: true, name: true } },
        list: { select: { id: true, name: true, boardId: true } },
      },
    });
    if (!card) throw new ApiError(404, "Card not found");
    return NextResponse.json({ card });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const user = await requireUser();
    const { cardId } = await params;
    const existing = await requireBoardMemberForCard(cardId, user.id);
    const body = await req.json();

    const data: {
      title?: string;
      description?: string;
      dueDate?: Date | null;
      archived?: boolean;
      position?: number;
      listId?: string;
    } = {};

    if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
    if (typeof body.description === "string") data.description = body.description;
    if (body.dueDate === null) data.dueDate = null;
    else if (typeof body.dueDate === "string") data.dueDate = new Date(body.dueDate);
    if (typeof body.archived === "boolean") data.archived = body.archived;
    if (typeof body.position === "number") data.position = body.position;

    if (typeof body.listId === "string" && body.listId !== existing.listId) {
      const targetList = await requireBoardMemberForList(body.listId, user.id);
      const currentList = await prisma.list.findUnique({
        where: { id: existing.listId },
        select: { boardId: true },
      });
      if (targetList.boardId !== currentList?.boardId) {
        throw new ApiError(400, "Cannot move a card to a different board");
      }
      data.listId = body.listId;
    }

    const card = await prisma.card.update({
      where: { id: cardId },
      data,
      include: {
        labels: { include: { label: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        checklists: { include: { items: true } },
        _count: { select: { comments: true } },
      },
    });
    return NextResponse.json({ card });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> }
) {
  try {
    const user = await requireUser();
    const { cardId } = await params;
    await requireBoardMemberForCard(cardId, user.id);
    await prisma.card.delete({ where: { id: cardId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
