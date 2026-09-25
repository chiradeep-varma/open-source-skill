import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireUser, handleApiError, ApiError } from "@/lib/api-helpers";

// Any signed-in team member can list or add teammates. This is a small,
// trusted, self-hosted instance (8-person team) — there is no public
// sign-up, so "already has a valid session" is the bar for inviting others.
export async function GET() {
  try {
    await requireUser();
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ users });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireUser();
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !name || password.length < 8) {
      throw new ApiError(400, "Name, email, and an 8+ character password are required");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ApiError(409, "A user with that email already exists");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, name: true, email: true },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
