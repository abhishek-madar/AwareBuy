import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, interests } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    if (!Array.isArray(interests)) {
      return NextResponse.json({ error: "Invalid interests" }, { status: 400 });
    }

    // Attempt to update the user. The @unique constraint in PostgreSQL ensures atomic safety.
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username,
        interests,
      },
    });

    return NextResponse.json({ success: true, user: { username: updatedUser.username } });
  } catch (error: unknown) {
    // Check if error is Prisma unique constraint violation for username
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
