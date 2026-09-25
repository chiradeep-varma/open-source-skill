import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireBoardMember, handleApiError, ApiError } from "@/lib/api-helpers";

async function requireLabelAccess(labelId: string, userId: string) {
  const label = await prisma.label.findUnique({ where: { id: labelId } });
  if (!label) throw new ApiError(404, "Label not found");
  await requireBoardMember(label.boardId, userId);
  return label;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ labelId: string }> }
) {
  try {
    const user = await requireUser();
    const { labelId } = await params;
    await requireLabelAccess(labelId, user.id);
    const body = await req.json();

    const data: { name?: string; color?: string } = {};
    if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
    if (typeof body.color === "string") data.color = body.color;

    const label = await prisma.label.update({ where: { id: labelId }, data });
    return NextResponse.json({ label });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ labelId: string }> }
) {
  try {
    const user = await requireUser();
    const { labelId } = await params;
    await requireLabelAccess(labelId, user.id);
    await prisma.label.delete({ where: { id: labelId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
