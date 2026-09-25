import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireUser,
  requireBoardMemberForList,
  handleApiError,
} from "@/lib/api-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  try {
    const user = await requireUser();
    const { listId } = await params;
    await requireBoardMemberForList(listId, user.id);
    const body = await req.json();

    const data: { name?: string; archived?: boolean; position?: number } = {};
    if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
    if (typeof body.archived === "boolean") data.archived = body.archived;
    if (typeof body.position === "number") data.position = body.position;

    const list = await prisma.list.update({ where: { id: listId }, data });
    return NextResponse.json({ list });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  try {
    const user = await requireUser();
    const { listId } = await params;
    await requireBoardMemberForList(listId, user.id);
    await prisma.list.delete({ where: { id: listId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
