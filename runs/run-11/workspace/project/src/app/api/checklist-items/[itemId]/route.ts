import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireBoardMember, handleApiError, ApiError } from "@/lib/api-helpers";

async function requireItemAccess(itemId: string, userId: string) {
  const item = await prisma.checklistItem.findUnique({
    where: { id: itemId },
    select: { checklist: { select: { card: { select: { list: { select: { boardId: true } } } } } } },
  });
  if (!item) throw new ApiError(404, "Item not found");
  await requireBoardMember(item.checklist.card.list.boardId, userId);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await requireUser();
    const { itemId } = await params;
    await requireItemAccess(itemId, user.id);
    const body = await req.json();

    const data: { done?: boolean; text?: string } = {};
    if (typeof body.done === "boolean") data.done = body.done;
    if (typeof body.text === "string" && body.text.trim()) data.text = body.text.trim();

    const item = await prisma.checklistItem.update({ where: { id: itemId }, data });
    return NextResponse.json({ item });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const user = await requireUser();
    const { itemId } = await params;
    await requireItemAccess(itemId, user.id);
    await prisma.checklistItem.delete({ where: { id: itemId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
