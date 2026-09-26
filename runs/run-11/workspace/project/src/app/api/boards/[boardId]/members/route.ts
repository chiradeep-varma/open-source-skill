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
    const userId = typeof body.userId === "string" ? body.userId : "";
    if (!userId) throw new ApiError(400, "userId is required");

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) throw new ApiError(404, "User not found");

    const membership = await prisma.boardMember.upsert({
      where: { boardId_userId: { boardId, userId } },
      create: { boardId, userId, role: "member" },
      update: {},
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json({ membership }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
