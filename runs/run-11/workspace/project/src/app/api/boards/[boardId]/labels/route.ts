import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireBoardMember, handleApiError, ApiError } from "@/lib/api-helpers";

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
    const color = typeof body.color === "string" ? body.color : "#6b7280";
    if (!name) throw new ApiError(400, "Label name is required");

    const label = await prisma.label.create({ data: { name, color, boardId } });
    return NextResponse.json({ label }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
