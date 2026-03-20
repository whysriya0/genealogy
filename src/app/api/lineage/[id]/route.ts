import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const personId = id;
    
    // Fetch a 3-level deep lineage for visualization
    const lineage = await fetchLineage(personId, 3);

    return NextResponse.json(lineage);
  } catch (error) {
    console.error("Error fetching lineage:", error);
    return NextResponse.json({ error: "Failed to fetch lineage" }, { status: 500 });
  }
}

async function fetchLineage(id: string, depth: number, currentDepth = 0): Promise<any> {
  if (currentDepth >= depth) return null;

  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      relationshipsAsSubject: {
        include: { object: true }
      },
      relationshipsAsObject: {
        include: { subject: true }
      }
    }
  });

  if (!person) return null;

  // Process children and disciples recursively
  const children = [];
  const relationships = person.relationshipsAsSubject.filter(r => 
    r.type === "PARENT_OF" || r.type === "GURU_OF" || r.type === "PAST_LIFE_OF"
  );

  for (const rel of relationships) {
    const childNode = await fetchLineage(rel.objectId, depth, currentDepth + 1);
    children.push({
      ...rel.object,
      relationshipType: rel.type,
      lineage: childNode?.children || []
    });
  }

  return {
    ...person,
    children
  };
}
