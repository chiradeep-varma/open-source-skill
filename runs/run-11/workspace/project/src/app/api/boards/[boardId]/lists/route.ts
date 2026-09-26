import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireBoardMember, handleApiError, ApiError } from "@/lib/api-helpers";
import { positionForAppend } from "@/lib/ordering";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const user = await requireUser();
    const { boardId } = await params;
    await requireBoardMember(boardId, user.id);
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) throw new ApiError(400, "List name is required");

    const last = await prisma.list.findFirst({
      where: { boardId, archived: false },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const list = await prisma.list.create({
      data: {
        name,
        boardId,
        position: positionForAppend(last?.position),
      },
    });
    return NextResponse.json({ list }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
