import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const relationship = await prisma.relationship.findUnique({
      where: { id },
      include: {
        subject: true,
        object: true
      }
    });

    if (!relationship) {
      return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
    }

    return NextResponse.json(relationship);
  } catch (error) {
    console.error("Error fetching relationship:", error);
    return NextResponse.json({ error: "Failed to fetch relationship" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.relationship.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Relationship deleted successfully" });
  } catch (error) {
    console.error("Error deleting relationship:", error);
    return NextResponse.json({ error: "Failed to delete relationship" }, { status: 500 });
  }
}
