import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireBoardMember, handleApiError, ApiError } from "@/lib/api-helpers";

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
          orderBy: { position: "asc" },
          include: {
            cards: {
              orderBy: { position: "asc" },
              include: {
                labels: { include: { label: true } },
                members: { include: { user: { select: { id: true, name: true, email: true } } } },
                checklists: { include: { items: { orderBy: { position: "asc" } } } },
                comments: { include: { author: { select: { id: true, name: true } } } },
              },
            },
          },
        },
      },
    });
    if (!board) throw new ApiError(404, "Board not found");

    return NextResponse.json(
      { exportedAt: new Date().toISOString(), format: "corkboard-v1", board },
      {
        headers: {
          "Content-Disposition": `attachment; filename="${board.name.replace(/[^a-z0-9-_]+/gi, "_")}.json"`,
        },
      }
    );
  } catch (err) {
    return handleApiError(err);
  }
}
