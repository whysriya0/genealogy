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
    const person = await prisma.person.findUnique({
      where: { id },
      include: {
        relationshipsAsSubject: { include: { object: true } },
        relationshipsAsObject: { include: { subject: true } }
      }
    });

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    return NextResponse.json(person);
  } catch (error) {
    console.error("Error fetching person:", error);
    return NextResponse.json({ error: "Failed to fetch person" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const updatedPerson = await prisma.person.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        gender: data.gender,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        deathDate: data.deathDate ? new Date(data.deathDate) : undefined,
        isAlive: data.isAlive,
        region: data.region,
        culture: data.culture,
        language: data.language,
        caste: data.caste,
        subCaste: data.subCaste,
        gotra: data.gotra,
        description: data.description,
      }
    });
    return NextResponse.json(updatedPerson);
  } catch (error) {
    console.error("Error updating person:", error);
    return NextResponse.json({ error: "Failed to update person" }, { status: 500 });
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
    await prisma.person.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Person deleted successfully" });
  } catch (error) {
    console.error("Error deleting person:", error);
    return NextResponse.json({ error: "Failed to delete person" }, { status: 500 });
  }
}
