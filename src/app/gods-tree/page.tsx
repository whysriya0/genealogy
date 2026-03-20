import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function GodsTreeRedirect() {
  // Find the most prominent "GOD" (Lord Vishnu is our default root)
  const vishnu = await prisma.person.findFirst({
    where: { 
      name: { contains: "Vishnu", mode: 'insensitive' },
      type: "GOD"
    }
  });

  if (vishnu) {
    redirect(`/tree/${vishnu.id}`);
  }

  // Fallback to first God found
  const firstGod = await prisma.person.findFirst({
    where: { type: "GOD" }
  });

  if (firstGod) {
    redirect(`/tree/${firstGod.id}`);
  }

  // Final fallback to explore
  redirect("/explore");
}
