import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, handleApiError, ApiError } from "@/lib/api-helpers";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const user = await requireUser();
    const { commentId } = await params;
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new ApiError(404, "Comment not found");
    if (comment.authorId !== user.id) throw new ApiError(403, "Not your comment");
    await prisma.comment.delete({ where: { id: commentId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
