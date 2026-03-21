import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  try {
    const persons = await prisma.person.findMany({
      include: {
        relationshipsAsSubject: {
          include: { object: true }
        },
        relationshipsAsObject: {
          include: { subject: true }
        }
      }
    });
    return NextResponse.json(persons);
  } catch (error) {
    console.error("Error fetching persons:", error);
    return NextResponse.json({ error: "Failed to fetch persons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const newPerson = await prisma.person.create({
      data: {
        name: data.name,
        type: data.type,
        gender: data.gender,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        deathDate: data.deathDate ? new Date(data.deathDate) : null,
        isAlive: data.isAlive ?? true,
        region: data.region,
        culture: data.culture,
        language: data.language,
        caste: data.caste,
        subCaste: data.subCaste,
        gotra: data.gotra,
        description: data.description,
        instagram: data.instagram,
        facebook: data.facebook,
        linkedin: data.linkedin,
      }
    });
    return NextResponse.json(newPerson, { status: 201 });
  } catch (error) {
    console.error("Error creating person:", error);
    return NextResponse.json({ error: "Failed to create person" }, { status: 500 });
  }
}
