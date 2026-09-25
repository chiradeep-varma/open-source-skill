import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ApiError(401, "Not signed in");
  }
  return session.user;
}

export async function requireBoardMember(boardId: string, userId: string) {
  const membership = await prisma.boardMember.findUnique({
    where: { boardId_userId: { boardId, userId } },
  });
  if (!membership) {
    throw new ApiError(403, "Not a member of this board");
  }
  return membership;
}

/** Looks up the board a card/list belongs to, and asserts membership. */
export async function requireBoardMemberForList(listId: string, userId: string) {
  const list = await prisma.list.findUnique({
    where: { id: listId },
    select: { boardId: true },
  });
  if (!list) throw new ApiError(404, "List not found");
  await requireBoardMember(list.boardId, userId);
  return list;
}

export async function requireBoardMemberForCard(cardId: string, userId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    select: { listId: true, list: { select: { boardId: true } } },
  });
  if (!card) throw new ApiError(404, "Card not found");
  await requireBoardMember(card.list.boardId, userId);
  return card;
}

export function handleApiError(err: unknown) {
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error(err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
