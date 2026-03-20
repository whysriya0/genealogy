import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const newRelationship = await prisma.relationship.create({
      data: {
        subjectId: data.subjectId,
        objectId: data.objectId,
        type: data.type,
        isCurrent: data.isCurrent ?? true,
      }
    });
    return NextResponse.json(newRelationship, { status: 201 });
  } catch (error) {
    console.error("Error creating relationship:", error);
    return NextResponse.json({ error: "Failed to create relationship" }, { status: 500 });
  }
}
