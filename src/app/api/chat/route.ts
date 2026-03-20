import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Basic logic for the genealogy assistant
    const lowerMessage = message.toLowerCase();
    let response = "";

    if (lowerMessage.includes("vishnu") || lowerMessage.includes("god")) {
      const vishnu = await prisma.person.findFirst({ where: { name: "Lord Vishnu" } });
      response = `Lord Vishnu is the supreme deity in the Vaishnavism tradition. In Vamsha, we trace his divine manifestations (Avatars) and their lineages. ${vishnu ? "You can find his tree in our database." : ""}`;
    } else if (lowerMessage.includes("rama")) {
      response = "Lord Sri Rama is the 7th Avatar of Vishnu. His lineage, the Ikshvaku dynasty (Suryavansha), is one of the most documented in Indian history.";
    } else if (lowerMessage.includes("gothra") || lowerMessage.includes("gotra")) {
      response = "Gothra refers to a clan or lineage traced back to a common ancestor, usually one of the Saptarishis. You can search our directory by Gothra to find your roots.";
    } else if (lowerMessage.includes("who is") || lowerMessage.includes("about")) {
      const name = message.replace(/who is|about/gi, "").trim();
      const person = await prisma.person.findFirst({
        where: { name: { contains: name, mode: 'insensitive' } }
      });
      if (person) {
        response = `${person.name} is a ${person.type.toLowerCase().replace('_', ' ')} in our records. ${person.description || ""}`;
      } else {
        response = `I couldn't find specific details for "${name}" in my current records, but I'm constantly learning!`;
      }
    } else {
      response = "I am Vamsha AI, your genealogy assistant. I can help you find ancestors, explain Gothras, or trace divine lineages. Try asking about 'Lord Vishnu' or 'Gothras'.";
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
