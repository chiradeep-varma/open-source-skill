import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleApiError, ApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const user = await requireUser();
    const boards = await prisma.board.findMany({
      where: { archived: false, members: { some: { userId: user.id } } },
      orderBy: { createdAt: "asc" },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { lists: true } },
      },
    });
    return NextResponse.json({ boards });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) throw new ApiError(400, "Board name is required");

    const board = await prisma.board.create({
      data: {
        name,
        createdById: user.id,
        members: { create: { userId: user.id, role: "owner" } },
      },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });
    return NextResponse.json({ board }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
