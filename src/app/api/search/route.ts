import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type");
    const gender = searchParams.get("gender");
    const caste = searchParams.get("caste");
    const gotra = searchParams.get("gotra");

    const where: any = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { gotra: { contains: query, mode: "insensitive" } },
        { caste: { contains: query, mode: "insensitive" } },
      ],
    };

    if (type && type !== "ALL") where.type = type;
    if (gender && gender !== "ALL") where.gender = gender;
    if (caste) where.caste = { contains: caste, mode: "insensitive" };
    if (gotra) where.gotra = { contains: gotra, mode: "insensitive" };

    const results = await prisma.person.findMany({
      where,
      orderBy: { name: "asc" },
      take: 50,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to search directory" }, { status: 500 });
  }
}
