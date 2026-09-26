import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireUser,
  requireBoardMember,
  handleApiError,
  ApiError,
} from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const user = await requireUser();
    const { boardId } = await params;
    await requireBoardMember(boardId, user.id);

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        labels: true,
        lists: {
          where: { archived: false },
          orderBy: { position: "asc" },
          include: {
            cards: {
              where: { archived: false },
              orderBy: { position: "asc" },
              include: {
                labels: { include: { label: true } },
                members: { include: { user: { select: { id: true, name: true, email: true } } } },
                checklists: { include: { items: { orderBy: { position: "asc" } } } },
                _count: { select: { comments: true } },
              },
            },
          },
        },
      },
    });
    if (!board) throw new ApiError(404, "Board not found");
    return NextResponse.json({ board });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const user = await requireUser();
    const { boardId } = await params;
    await requireBoardMember(boardId, user.id);
    const body = await req.json();

    const data: { name?: string; archived?: boolean } = {};
    if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
    if (typeof body.archived === "boolean") data.archived = body.archived;

    const board = await prisma.board.update({ where: { id: boardId }, data });
    return NextResponse.json({ board });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const user = await requireUser();
    const { boardId } = await params;
    const membership = await requireBoardMember(boardId, user.id);
    if (membership.role !== "owner") {
      throw new ApiError(403, "Only the board owner can delete it");
    }
    await prisma.board.delete({ where: { id: boardId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
